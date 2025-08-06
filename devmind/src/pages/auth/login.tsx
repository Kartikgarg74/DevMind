import { useState } from 'react';
import { useRouter } from 'next/router';
import { supabase } from '@/lib/supabaseClient';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    else router.push('/');
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#10131a] via-[#181C24] to-[#23283A]">
      <div className="w-full max-w-md mx-auto">
        <form onSubmit={handleLogin} className="bg-[#181C24]/80 border border-[#23283A] rounded-2xl shadow-2xl p-10 flex flex-col gap-6 backdrop-blur-xl">
          <div className="flex flex-col items-center mb-2">
            {/* Optional: Add a logo/icon here */}
            <h1 className="text-3xl font-extrabold text-neonAqua mb-1 text-center tracking-tight drop-shadow-neon">Sign in to DevMind</h1>
          </div>
          <input
            className="p-3 rounded-xl bg-[#23283A] text-textPrimary font-mono border border-[#23283A] focus:border-neonAqua outline-none transition placeholder:text-gray-400"
            placeholder="Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            type="email"
            autoComplete="email"
            required
          />
          <input
            className="p-3 rounded-xl bg-[#23283A] text-textPrimary font-mono border border-[#23283A] focus:border-neonAqua outline-none transition placeholder:text-gray-400"
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
          {error && <div className="text-red-400 text-center text-sm font-mono bg-red-900/30 rounded-lg py-2 px-3">{error}</div>}
          <button
            className="bg-neonAqua text-background px-4 py-3 rounded-xl font-mono font-bold shadow-neon hover:bg-neonBlue transition-all text-lg tracking-wide mt-2"
            type="submit"
          >
            Login
          </button>
          <div className="text-textSecondary text-sm text-center mt-2">
            Don't have an account?{' '}
            <a href="/auth/register" className="text-neonAqua underline hover:text-neonBlue transition-colors font-semibold">Register</a>
          </div>
        </form>
      </div>
    </div>
  );
}
