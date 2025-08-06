import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ApiService } from '@/lib/api';
import type { Tables, Inserts } from '@/types/supabase';

interface ProjectManagerProps {
  userId: string;
}

export default function ProjectManager({ userId }: ProjectManagerProps) {
  const [projects, setProjects] = useState<Tables<'projects'>[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProject, setEditingProject] = useState<Tables<'projects'> | null>(null);

  useEffect(() => {
    fetchProjects();
  }, [userId]);

  const fetchProjects = async () => {
    try {
      const { data, error } = await ApiService.getProjects(userId);
      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProject = async (projectData: Omit<Inserts<'projects'>, 'created_by'>) => {
    try {
      const { data, error } = await ApiService.createProject({
        ...projectData,
        created_by: userId
      });

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      setShowCreateModal(false);
    } catch (error) {
      console.error('Error creating project:', error);
    }
  };

  const handleUpdateProject = async (projectId: string, updates: Partial<Tables<'projects'>>) => {
    try {
      const { data, error } = await ApiService.updateProject(projectId, updates);

      if (error) throw error;

      setProjects(prev => prev.map(p => p.id === projectId ? data : p));
      setEditingProject(null);
    } catch (error) {
      console.error('Error updating project:', error);
    }
  };

  const handleDeleteProject = async (projectId: string) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const { error } = await ApiService.deleteProject(projectId);

      if (error) throw error;

      setProjects(prev => prev.filter(p => p.id !== projectId));
    } catch (error) {
      console.error('Error deleting project:', error);
    }
  };

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-card p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-border rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="h-48 bg-border rounded-xl"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-card border border-border rounded-2xl shadow-card p-8"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-bold text-textPrimary flex items-center">
          <span className="text-neonAqua mr-3">🚀</span>
          Projects
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowCreateModal(true)}
          className="bg-neonAqua text-background px-6 py-3 rounded-xl font-semibold hover:bg-neonEmerald transition-colors"
        >
          + New Project
        </motion.button>
      </div>

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <ProjectCard
            key={project.id}
            project={project}
            onEdit={() => setEditingProject(project)}
            onDelete={() => handleDeleteProject(project.id)}
          />
        ))}
      </div>

      {projects.length === 0 && (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">📁</div>
          <h3 className="text-xl font-semibold text-textPrimary mb-2">No projects yet</h3>
          <p className="text-textSecondary mb-6">Create your first project to get started</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            className="bg-neonAqua text-background px-6 py-3 rounded-xl font-semibold hover:bg-neonEmerald transition-colors"
          >
            Create Project
          </motion.button>
        </div>
      )}

      {/* Create Project Modal */}
      <AnimatePresence>
        {showCreateModal && (
          <CreateProjectModal
            onClose={() => setShowCreateModal(false)}
            onSubmit={handleCreateProject}
          />
        )}
      </AnimatePresence>

      {/* Edit Project Modal */}
      <AnimatePresence>
        {editingProject && (
          <EditProjectModal
            project={editingProject}
            onClose={() => setEditingProject(null)}
            onSubmit={handleUpdateProject}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}

function ProjectCard({
  project,
  onEdit,
  onDelete
}: {
  project: Tables<'projects'>;
  onEdit: () => void;
  onDelete: () => void;
}) {
  const statusColors = {
    active: 'text-neonEmerald',
    paused: 'text-neonIndigo',
    completed: 'text-neonAqua',
    archived: 'text-textSecondary'
  };

  return (
    <motion.div
      whileHover={{ y: -5 }}
      className="bg-background border border-border rounded-xl p-6 hover:border-neonAqua transition-colors"
    >
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-textPrimary mb-2">{project.name}</h3>
          <p className="text-textSecondary text-sm mb-3 line-clamp-2">
            {project.description || 'No description provided'}
          </p>
        </div>
                  <div className="flex space-x-2">
            <button
              onClick={onEdit}
              className="text-neonAqua hover:text-neonEmerald transition-colors"
              title="Edit project"
              aria-label="Edit project"
            >
              ✏️
            </button>
            <button
              onClick={onDelete}
              className="text-red-400 hover:text-red-300 transition-colors"
              title="Delete project"
              aria-label="Delete project"
            >
              🗑️
            </button>
          </div>
      </div>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-textSecondary text-sm">Status</span>
          <span className={`text-sm font-medium ${statusColors[project.status as keyof typeof statusColors]}`}>
            {project.status}
          </span>
        </div>

        {project.github_repo && (
          <div className="flex items-center justify-between">
            <span className="text-textSecondary text-sm">Repository</span>
            <a
              href={project.github_repo}
              target="_blank"
              rel="noopener noreferrer"
              className="text-neonAqua hover:text-neonEmerald text-sm transition-colors"
            >
              View
            </a>
          </div>
        )}

        <div className="flex items-center justify-between">
          <span className="text-textSecondary text-sm">Created</span>
          <span className="text-textSecondary text-sm">
            {new Date(project.created_at).toLocaleDateString()}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

function CreateProjectModal({
  onClose,
  onSubmit
}: {
  onClose: () => void;
  onSubmit: (data: Omit<Inserts<'projects'>, 'created_by'>) => void;
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    github_repo: '',
    status: 'active'
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border border-border rounded-2xl shadow-card p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-textPrimary mb-6">Create New Project</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="project-name" className="block text-textPrimary text-sm font-medium mb-2">
              Project Name
            </label>
            <input
              id="project-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary focus:border-neonAqua focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="project-description" className="block text-textPrimary text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="project-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary focus:border-neonAqua focus:outline-none"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="project-repo" className="block text-textPrimary text-sm font-medium mb-2">
              GitHub Repository (optional)
            </label>
            <input
              id="project-repo"
              type="url"
              value={formData.github_repo}
              onChange={(e) => setFormData(prev => ({ ...prev, github_repo: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary focus:border-neonAqua focus:outline-none"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div>
            <label htmlFor="project-status" className="block text-textPrimary text-sm font-medium mb-2">
              Status
            </label>
            <select
              id="project-status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary focus:border-neonAqua focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-border text-textPrimary px-4 py-3 rounded-lg hover:bg-border/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-neonAqua text-background px-4 py-3 rounded-lg font-semibold hover:bg-neonEmerald transition-colors"
            >
              Create Project
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}

function EditProjectModal({
  project,
  onClose,
  onSubmit
}: {
  project: Tables<'projects'>;
  onClose: () => void;
  onSubmit: (projectId: string, updates: Partial<Tables<'projects'>>) => void;
}) {
  const [formData, setFormData] = useState({
    name: project.name,
    description: project.description || '',
    github_repo: project.github_repo || '',
    status: project.status
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(project.id, formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        className="bg-card border border-border rounded-2xl shadow-card p-8 max-w-md w-full"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-textPrimary mb-6">Edit Project</h3>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="edit-project-name" className="block text-textPrimary text-sm font-medium mb-2">
              Project Name
            </label>
            <input
              id="edit-project-name"
              type="text"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary focus:border-neonAqua focus:outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="edit-project-description" className="block text-textPrimary text-sm font-medium mb-2">
              Description
            </label>
            <textarea
              id="edit-project-description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary focus:border-neonAqua focus:outline-none"
              rows={3}
            />
          </div>

          <div>
            <label htmlFor="edit-project-repo" className="block text-textPrimary text-sm font-medium mb-2">
              GitHub Repository
            </label>
            <input
              id="edit-project-repo"
              type="url"
              value={formData.github_repo}
              onChange={(e) => setFormData(prev => ({ ...prev, github_repo: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary focus:border-neonAqua focus:outline-none"
              placeholder="https://github.com/username/repo"
            />
          </div>

          <div>
            <label htmlFor="edit-project-status" className="block text-textPrimary text-sm font-medium mb-2">
              Status
            </label>
            <select
              id="edit-project-status"
              value={formData.status}
              onChange={(e) => setFormData(prev => ({ ...prev, status: e.target.value }))}
              className="w-full bg-background border border-border rounded-lg px-4 py-3 text-textPrimary focus:border-neonAqua focus:outline-none"
            >
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div className="flex space-x-4 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-border text-textPrimary px-4 py-3 rounded-lg hover:bg-border/80 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-neonAqua text-background px-4 py-3 rounded-lg font-semibold hover:bg-neonEmerald transition-colors"
            >
              Update Project
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
