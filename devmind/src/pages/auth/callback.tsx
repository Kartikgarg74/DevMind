import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function AuthCallback() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();

        if (error) {
          setError(error.message);
          return;
        }

        if (data.session) {
          // Successful authentication
          router.push('/');
        } else {
          // No session found
          setError('Authentication failed. Please try again.');
          setTimeout(() => {
            router.push('/auth/login');
          }, 3000);
        }
      } catch (err) {
        console.error('Auth callback error:', err);
        setError('An unexpected error occurred.');
        setTimeout(() => {
          router.push('/auth/login');
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [router]);

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-[#181C24] to-[#23283A]">
        <div className="bg-card border border-border rounded-2xl shadow-card p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="text-red-400 text-6xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-textPrimary mb-4">Authentication Error</h1>
            <p className="text-textSecondary mb-6">{error}</p>
            <div className="animate-pulse text-neonAqua">Redirecting to login...</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-[#181C24] to-[#23283A]">
      <div className="bg-card border border-border rounded-2xl shadow-card p-8 max-w-md w-full mx-4">
        <div className="text-center">
          <div className="text-neonAqua text-6xl mb-4 animate-pulse">⚡</div>
          <h1 className="text-2xl font-bold text-textPrimary mb-4">Authenticating...</h1>
          <p className="text-textSecondary mb-6">Please wait while we complete your authentication.</p>
          <div className="flex justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neonAqua"></div>
          </div>
        </div>
      </div>
    </div>
  );
}
