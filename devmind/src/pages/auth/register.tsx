import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function RegisterPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else router.push('/auth/login');
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleRegister} className="bg-card border border-border rounded-2xl shadow-card p-10 flex flex-col gap-6">
        <h1 className="text-3xl font-mono text-neonAqua mb-2 text-center tracking-tight">Create your DevMind account</h1>
        <input className="p-3 rounded-xl bg-neonAqua/10 text-textPrimary font-mono border border-border focus:border-neonAqua outline-none transition" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} />
        <input className="p-3 rounded-xl bg-neonAqua/10 text-textPrimary font-mono border border-border focus:border-neonAqua outline-none transition" type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)} />
        {error && <div className="text-red-400 text-center">{error}</div>}
        <button className="bg-neonAqua text-background px-4 py-2 rounded-xl font-mono shadow-neon hover:bg-neonBlue transition-all">Register</button>
        <div className="text-textSecondary text-sm text-center mt-2">Already have an account? <a href="/auth/login" className="text-neonAqua underline">Login</a></div>
      </form>
    </div>
  );
}
