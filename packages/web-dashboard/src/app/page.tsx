import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-[#181C24] to-[#23283A] text-textPrimary font-sans relative overflow-hidden">
      {/* Optional: Futuristic 3D/AI visual or animated background here */}
      <div className="z-10 w-full max-w-xl mx-auto bg-card/80 border border-border rounded-2xl shadow-card p-10 flex flex-col items-center gap-6 backdrop-blur-xl mt-12">
        <h1 className="text-4xl font-mono font-bold text-neonAqua tracking-tight drop-shadow-neon text-center mb-2">
          Welcome to DevMind
        </h1>
        <p className="text-textSecondary text-lg text-center mb-4">
          Your AI-powered development companion.<br />
          Supercharge your workflow with commit intelligence, analytics, and more.
        </p>
        <div className="flex gap-4 w-full justify-center">
          <Link href="/auth/login" className="bg-neonAqua text-background px-6 py-3 rounded-xl font-mono font-bold shadow-neon hover:bg-neonBlue transition-all text-lg tracking-wide text-center">
            Login
          </Link>
          <Link href="/auth/register" className="bg-card border border-neonAqua text-neonAqua px-6 py-3 rounded-xl font-mono font-bold hover:bg-neonAqua hover:text-background transition-all text-lg tracking-wide text-center">
            Register
          </Link>
        </div>
      </div>
      {/* Subtle animated glow or 3D effect can be added here for extra polish */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center z-0">
        <span className="text-xs text-textSecondary opacity-60">© {new Date().getFullYear()} DevMind. All rights reserved.</span>
      </div>
    </div>
  );
}
