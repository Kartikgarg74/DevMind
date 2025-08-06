import { motion } from "framer-motion";

type Commit = {
  id: string;
  title: string;
  narrative: string;
  files: string[];
};

interface CommitTimelineProps {
  commits: Commit[];
}

export default function CommitTimeline({ commits }: CommitTimelineProps) {
  return (
    <div className="flex overflow-x-auto py-4 gap-6 scrollbar-thin scrollbar-thumb-neonAqua/40 scrollbar-track-card">
      {commits.map((commit, idx) => (
        <motion.div
          key={commit.id}
          className="bg-card border border-border rounded-2xl p-6 min-w-[340px] max-w-xs shadow-card flex flex-col gap-2 hover:shadow-neon transition-all duration-200"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.08, type: 'spring', stiffness: 80 }}
        >
          <div className="font-mono text-neonAqua text-lg font-bold mb-1 truncate">{commit.title}</div>
          <div className="text-textSecondary text-sm mb-2 line-clamp-3">{commit.narrative}</div>
          <div className="flex flex-wrap gap-2 mt-auto">
            {commit.files.map((f) => (
              <span key={f} className="text-xs bg-neonIndigo/20 text-neonIndigo px-2 py-1 rounded font-mono border border-neonIndigo/40">
                {f}
              </span>
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
}
