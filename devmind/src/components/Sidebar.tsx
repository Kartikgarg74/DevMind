import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";
import { motion } from "framer-motion";

const tabs = [
  { name: "Explain", icon: "💡" },
  { name: "Refactor", icon: "🛠️" },
  { name: "Trace Bug", icon: "🐞" },
  { name: "PR Review", icon: "🔍" },
  { name: "Story Commit", icon: "📖" },
];

export default function Sidebar() {
  const [activeTab, setActiveTab] = useState(tabs[0].name);

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.reload();
  }

  return (
    <aside className="fixed left-6 top-6 h-[90vh] w-60 bg-card border border-border shadow-card rounded-2xl flex flex-col py-8 z-50 backdrop-blur-xl bg-opacity-90">
      <div className="text-2xl font-mono mb-10 px-8 text-neonAqua tracking-tight">DevMind</div>
      <nav className="flex flex-col gap-2 flex-1 px-2">
        {tabs.map(tab => (
          <motion.button
            key={tab.name}
            className={`flex items-center gap-3 px-6 py-3 rounded-xl font-mono text-lg transition-all duration-200
              ${activeTab === tab.name ? 'bg-neonAqua/20 text-neonAqua shadow-neon' : 'hover:bg-neonAqua/10 text-textSecondary'}`}
            whileHover={{ scale: 1.04 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setActiveTab(tab.name)}
          >
            <span className="text-xl">{tab.icon}</span>
            <span>{tab.name}</span>
          </motion.button>
        ))}
      </nav>
      <button
        onClick={handleLogout}
        className="mx-8 mt-10 bg-neonAqua text-background px-4 py-2 rounded-xl font-mono shadow-neon hover:bg-neonBlue transition-all"
      >
        Logout
      </button>
    </aside>
  );
}
