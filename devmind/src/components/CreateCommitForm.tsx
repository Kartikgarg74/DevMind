import { useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ApiService } from "@/lib/api";
import { AIService, type CommitSuggestion } from "@/lib/ai";
import type { Tables } from "@/types/supabase";

interface CreateCommitFormProps {
  userId: string;
  onCommitCreated: () => void;
}

export default function CreateCommitForm({ userId, onCommitCreated }: CreateCommitFormProps) {
  const [title, setTitle] = useState("");
  const [narrative, setNarrative] = useState("");
  const [files, setFiles] = useState<string[]>([]);
  const [currentFile, setCurrentFile] = useState("");
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<CommitSuggestion[]>([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [selectedProject, setSelectedProject] = useState<string>("");
  const [projects, setProjects] = useState<Tables<'projects'>[]>([]);

  // Load projects on component mount
  useState(() => {
    const loadProjects = async () => {
      try {
        const { data, error } = await ApiService.getProjects(userId);
        if (error) throw error;
        setProjects(data || []);
      } catch (error) {
        console.error('Error loading projects:', error);
      }
    };
    loadProjects();
  });

  const handleAddFile = useCallback(() => {
    if (currentFile.trim() && !files.includes(currentFile.trim())) {
      setFiles(prev => [...prev, currentFile.trim()]);
      setCurrentFile("");
    }
  }, [currentFile, files]);

  const handleRemoveFile = useCallback((fileToRemove: string) => {
    setFiles(prev => prev.filter(file => file !== fileToRemove));
  }, []);

  const handleKeyPress = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddFile();
    }
  }, [handleAddFile]);

  const generateSuggestions = useCallback(async () => {
    if (!title.trim() && !narrative.trim()) return;

    setLoading(true);
    try {
      const suggestions = await AIService.generateCommitMessage(
        files,
        `${title}\n${narrative}`,
        selectedProject ? projects.find(p => p.id === selectedProject)?.description : undefined
      );
      setSuggestions(suggestions);
      setShowSuggestions(true);
    } catch (error) {
      console.error('Error generating suggestions:', error);
    } finally {
      setLoading(false);
    }
  }, [title, narrative, files, selectedProject, projects]);

  const useSuggestion = useCallback((suggestion: CommitSuggestion) => {
    setTitle(suggestion.title);
    setNarrative(suggestion.narrative);
    setShowSuggestions(false);
  }, []);

  const handleSubmit = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    setLoading(true);
    try {
      const { error } = await ApiService.createCommit({
        title: title.trim(),
        narrative: narrative.trim() || null,
        files: files.length > 0 ? files : null,
        user_id: userId,
        project_id: selectedProject || null,
      });

      if (error) throw error;

      // Reset form
      setTitle("");
      setNarrative("");
      setFiles([]);
      setSelectedProject("");
      setShowSuggestions(false);
      setSuggestions([]);

      // Notify parent
      onCommitCreated();
    } catch (error) {
      console.error('Error creating commit:', error);
    } finally {
      setLoading(false);
    }
  }, [title, narrative, files, userId, selectedProject, onCommitCreated]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl shadow-card p-8 mb-8"
    >
      <h2 className="text-2xl font-bold text-textPrimary mb-6 flex items-center">
        <span className="text-neonAqua mr-3">💾</span>
        Create Commit
      </h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Project Selection */}
        <div>
          <label htmlFor="project-select" className="block text-textPrimary text-sm font-medium mb-2">
            Project (optional)
          </label>
          <select
            id="project-select"
            value={selectedProject}
            onChange={(e) => setSelectedProject(e.target.value)}
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary focus:border-neonAqua focus:outline-none"
          >
            <option value="">No project</option>
            {projects.map((project) => (
              <option key={project.id} value={project.id}>
                {project.name}
              </option>
            ))}
          </select>
        </div>

        {/* Commit Title */}
        <div>
          <label htmlFor="commit-title" className="block text-textPrimary text-sm font-medium mb-2">
            Commit Title *
          </label>
          <input
            id="commit-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="feat: add new authentication system"
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary focus:border-neonAqua focus:outline-none"
            required
          />
        </div>

        {/* Commit Narrative */}
        <div>
          <label htmlFor="commit-narrative" className="block text-textPrimary text-sm font-medium mb-2">
            Narrative (optional)
          </label>
          <textarea
            id="commit-narrative"
            value={narrative}
            onChange={(e) => setNarrative(e.target.value)}
            placeholder="Describe the changes and their impact..."
            className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary focus:border-neonAqua focus:outline-none"
            rows={3}
          />
        </div>

        {/* Files */}
        <div>
          <label htmlFor="file-input" className="block text-textPrimary text-sm font-medium mb-2">
            Modified Files
          </label>
          <div className="flex space-x-2 mb-3">
            <input
              id="file-input"
              type="text"
              value={currentFile}
              onChange={(e) => setCurrentFile(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="src/components/Button.tsx"
              className="flex-1 bg-background border border-border rounded-lg px-4 py-3 text-textPrimary focus:border-neonAqua focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddFile}
              className="bg-neonAqua text-background px-4 py-3 rounded-lg font-semibold hover:bg-neonEmerald transition-colors"
            >
              Add
            </button>
          </div>

          {files.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {files.map((file, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="bg-background border border-border rounded-lg px-3 py-1 flex items-center space-x-2"
                >
                  <span className="text-textPrimary text-sm">{file}</span>
                  <button
                    type="button"
                    onClick={() => handleRemoveFile(file)}
                    className="text-red-400 hover:text-red-300 transition-colors"
                    title="Remove file"
                  >
                    ×
                  </button>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* AI Suggestions */}
        <div className="flex space-x-4">
          <button
            type="button"
            onClick={generateSuggestions}
            disabled={loading || (!title.trim() && !narrative.trim())}
            className="bg-neonIndigo text-background px-6 py-3 rounded-lg font-semibold hover:bg-neonAqua transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Generating..." : "🤖 AI Suggestions"}
          </button>
        </div>

        {/* Suggestions Panel */}
        <AnimatePresence>
          {showSuggestions && suggestions.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-background border border-border rounded-xl p-6"
            >
              <h3 className="text-lg font-semibold text-textPrimary mb-4">AI Suggestions</h3>
              <div className="space-y-4">
                {suggestions.map((suggestion, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="bg-card border border-border rounded-lg p-4 hover:border-neonAqua transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-textPrimary font-medium">{suggestion.title}</h4>
                      <div className="flex items-center space-x-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          suggestion.type === 'feat' ? 'bg-green-500/20 text-green-400' :
                          suggestion.type === 'fix' ? 'bg-red-500/20 text-red-400' :
                          suggestion.type === 'refactor' ? 'bg-blue-500/20 text-blue-400' :
                          'bg-gray-500/20 text-gray-400'
                        }`}>
                          {suggestion.type}
                        </span>
                        <span className="text-textSecondary text-sm">
                          {Math.round(suggestion.confidence * 100)}%
                        </span>
                      </div>
                    </div>
                    <p className="text-textSecondary text-sm mb-3">{suggestion.narrative}</p>
                    <button
                      type="button"
                      onClick={() => useSuggestion(suggestion)}
                      className="bg-neonAqua text-background px-4 py-2 rounded-lg text-sm font-medium hover:bg-neonEmerald transition-colors"
                    >
                      Use This
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Submit Button */}
        <div className="flex justify-end">
          <button
            type="submit"
            disabled={loading || !title.trim()}
            className="bg-neonAqua text-background px-8 py-3 rounded-xl font-semibold hover:bg-neonEmerald transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? "Creating..." : "Create Commit"}
          </button>
        </div>
      </form>
    </motion.div>
  );
}
