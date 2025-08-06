import "@/styles/globals.css";
import type { AppProps } from "next/app";
import { createContext, useEffect, useState, useContext } from "react";
import { useRouter } from "next/router";
import { supabase } from "@/lib/supabaseClient";
import { AuthService } from "@/lib/auth";
import type { AuthUser } from "@/lib/auth";

interface UserContextType {
  user: AuthUser | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const UserContext = createContext<UserContextType>({
  user: null,
  loading: true,
  signOut: async () => {}
});

export function useUser() {
  return useContext(UserContext);
}

function UserProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const signOut = async () => {
    try {
      await AuthService.signOut();
      setUser(null);
      router.push('/auth/login');
    } catch (error) {
      console.error('Sign out error:', error);
    }
  };

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        // Get current session
        const { data: { session } } = await supabase.auth.getSession();

        if (session?.user) {
          // Get or create user profile
          const { data: profile, error } = await AuthService.getUserProfile(session.user.id);

          if (error) {
            // Create profile if it doesn't exist
            const { data: newProfile } = await AuthService.upsertUserProfile({
              id: session.user.id,
              email: session.user.email!,
              username: session.user.user_metadata?.username || session.user.email!.split('@')[0],
              github_id: session.user.user_metadata?.provider === 'github' ? session.user.user_metadata.sub : null,
              avatar_url: session.user.user_metadata?.avatar_url || null
            });

            if (newProfile) {
              setUser(newProfile);
            }
          } else if (profile) {
            setUser(profile);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: listener } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session?.user) {
        // Get or create user profile
        const { data: profile, error } = await AuthService.getUserProfile(session.user.id);

        if (error) {
          // Create profile if it doesn't exist
          const { data: newProfile } = await AuthService.upsertUserProfile({
            id: session.user.id,
            email: session.user.email!,
            username: session.user.user_metadata?.username || session.user.email!.split('@')[0],
            github_id: session.user.user_metadata?.provider === 'github' ? session.user.user_metadata.sub : null,
            avatar_url: session.user.user_metadata?.avatar_url || null
          });

          if (newProfile) {
            setUser(newProfile);
          }
        } else if (profile) {
          setUser(profile);
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null);
      }
    });

    return () => {
      listener?.subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider value={{ user, loading, signOut }}>
      {children}
    </UserContext.Provider>
  );
}

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-[#181C24] to-[#23283A] text-textPrimary font-sans flex flex-row">
      {children}
    </div>
  );
}

export default function App({ Component, pageProps, router }: AppProps & { router: any }) {
  const isAuthPage = router.pathname.startsWith("/auth");
  const isCallbackPage = router.pathname === "/auth/callback";

  return (
    <UserProvider>
      {isAuthPage ? (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-[#181C24] to-[#23283A] text-textPrimary font-sans">
          <Component {...pageProps} />
        </div>
      ) : (
        <Layout>
          <Component {...pageProps} />
        </Layout>
      )}
    </UserProvider>
  );
}
