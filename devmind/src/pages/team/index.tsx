import { useEffect, useState } from "react";
import Sidebar from "@/components/Sidebar";
import NeuralCore3D from "@/components/NeuralCore3D";
import VoiceChatTerminal from "@/components/VoiceChatTerminal";
import { useUser } from "../_app";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/router";

interface TeamUser {
  id: string;
  email: string;
  role?: string;
}

export default function TeamPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [loadingUsers, setLoadingUsers] = useState(false);

  useEffect(() => {
    if (!loading && !user) router.push("/auth/login");
  }, [user, loading, router]);

  useEffect(() => {
    async function fetchUsers() {
      setLoadingUsers(true);
      // Supabase auth.users is only accessible with service role, so this is a placeholder for demo
      // In production, use a secure API route or RLS policies
      const { data, error } = await supabase.from("users").select("id, email, role");
      if (data) setUsers(data);
      setLoadingUsers(false);
    }
    fetchUsers();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-background text-textPrimary font-sans">
      <Sidebar />
      <main className="ml-64 min-h-screen flex flex-col p-8">
        <h1 className="text-3xl font-mono mb-6">Team Management</h1>
        <div className="mb-8">Invite new users, manage roles, and see your team.</div>
        <div className="mb-8 bg-background border border-neonAqua rounded-xl p-6 max-w-xl">
          <h2 className="text-xl font-mono text-neonAqua mb-2">Invite User (coming soon)</h2>
          <input className="p-3 rounded bg-neonAqua/10 text-textPrimary font-mono mb-2 w-full" placeholder="Email address" disabled />
          <button className="bg-neonAqua text-background px-4 py-2 rounded font-mono shadow-neon opacity-50" disabled>Send Invite</button>
        </div>
        <h2 className="text-xl font-mono text-neonAqua mb-4">Team Members</h2>
        {loadingUsers ? (
          <div>Loading users...</div>
        ) : (
          <table className="w-full max-w-2xl text-left border-collapse">
            <thead>
              <tr>
                <th className="p-2 border-b border-neonAqua">Email</th>
                <th className="p-2 border-b border-neonAqua">Role</th>
              </tr>
            </thead>
            <tbody>
              {users.map(u => (
                <tr key={u.id} className="border-b border-neonAqua/20">
                  <td className="p-2 font-mono">{u.email}</td>
                  <td className="p-2 font-mono">{u.role || "member"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
      <NeuralCore3D />
      <VoiceChatTerminal />
    </div>
  );
}
