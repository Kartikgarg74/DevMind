import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ApiService } from '@/lib/api';
import type { Tables } from '@/types/supabase';

interface AnalyticsData {
  commits: Tables<'commits'>[];
  projects: Tables<'projects'>[];
  tasks: Tables<'tasks'>[];
  analytics: Tables<'analytics'>[];
}

export default function AnalyticsDashboard({ userId }: { userId: string }) {
  const [data, setData] = useState<AnalyticsData>({
    commits: [],
    projects: [],
    tasks: [],
    analytics: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [projectsRes, commitsRes, tasksRes] = await Promise.all([
          ApiService.getProjects(userId),
          ApiService.getCommits(userId),
          ApiService.getTasks(undefined, userId)
        ]);

        setData({
          projects: projectsRes.data || [],
          commits: commitsRes.data || [],
          tasks: tasksRes.data || [],
          analytics: []
        });
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [userId]);

  const metrics = {
    totalProjects: data.projects.length,
    totalCommits: data.commits.length,
    totalTasks: data.tasks.length,
    completedTasks: data.tasks.filter(task => task.status === 'completed').length,
    activeProjects: data.projects.filter(project => project.status === 'active').length,
    productivityScore: Math.round((data.commits.length / Math.max(data.projects.length, 1)) * 100)
  };

  const recentActivity = [
    ...data.commits.slice(0, 5).map(commit => ({
      type: 'commit',
      title: commit.title,
      timestamp: new Date(commit.created_at),
      description: commit.narrative || 'Code changes committed'
    })),
    ...data.tasks.slice(0, 5).map(task => ({
      type: 'task',
      title: task.title,
      timestamp: new Date(task.created_at),
      description: `Task ${task.status} - ${task.priority} priority`
    }))
  ].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime()).slice(0, 8);

  if (loading) {
    return (
      <div className="bg-card border border-border rounded-2xl shadow-card p-8">
        <div className="animate-pulse">
          <div className="h-8 bg-border rounded mb-6"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-24 bg-border rounded-xl"></div>
            ))}
          </div>
          <div className="h-64 bg-border rounded-xl"></div>
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
      <h2 className="text-2xl font-bold text-textPrimary mb-6 flex items-center">
        <span className="text-neonAqua mr-3">📊</span>
        Analytics Dashboard
      </h2>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <MetricCard
          title="Total Projects"
          value={metrics.totalProjects}
          icon="🚀"
          color="neonAqua"
        />
        <MetricCard
          title="Total Commits"
          value={metrics.totalCommits}
          icon="💾"
          color="neonEmerald"
        />
        <MetricCard
          title="Active Tasks"
          value={metrics.totalTasks}
          icon="📋"
          color="neonIndigo"
        />
        <MetricCard
          title="Productivity Score"
          value={`${metrics.productivityScore}%`}
          icon="⚡"
          color="neonBlue"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
        {/* Commit Activity Chart */}
        <div className="bg-background border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">Commit Activity</h3>
          <CommitActivityChart commits={data.commits} />
        </div>

        {/* Task Status Chart */}
        <div className="bg-background border border-border rounded-xl p-6">
          <h3 className="text-lg font-semibold text-textPrimary mb-4">Task Status</h3>
          <TaskStatusChart tasks={data.tasks} />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-background border border-border rounded-xl p-6">
        <h3 className="text-lg font-semibold text-textPrimary mb-4">Recent Activity</h3>
        <div className="space-y-4">
          {recentActivity.map((activity, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center space-x-4 p-3 bg-card rounded-lg border border-border"
            >
              <div className={`text-2xl ${activity.type === 'commit' ? 'text-neonEmerald' : 'text-neonIndigo'}`}>
                {activity.type === 'commit' ? '💾' : '📋'}
              </div>
              <div className="flex-1">
                <h4 className="text-textPrimary font-medium">{activity.title}</h4>
                <p className="text-textSecondary text-sm">{activity.description}</p>
              </div>
              <div className="text-textSecondary text-sm">
                {activity.timestamp.toLocaleDateString()}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

function MetricCard({ title, value, icon, color }: {
  title: string;
  value: string | number;
  icon: string;
  color: string;
}) {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={`bg-background border border-border rounded-xl p-6 text-center`}
    >
      <div className={`text-3xl mb-2 ${color === 'neonAqua' ? 'text-neonAqua' : color === 'neonEmerald' ? 'text-neonEmerald' : color === 'neonIndigo' ? 'text-neonIndigo' : 'text-neonBlue'}`}>
        {icon}
      </div>
      <div className="text-2xl font-bold text-textPrimary mb-1">{value}</div>
      <div className="text-textSecondary text-sm">{title}</div>
    </motion.div>
  );
}

function CommitActivityChart({ commits }: { commits: Tables<'commits'>[] }) {
  // Simple bar chart for commit activity
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    return date.toISOString().split('T')[0];
  }).reverse();

  const commitCounts = last7Days.map(date =>
    commits.filter(commit =>
      commit.created_at.startsWith(date)
    ).length
  );

  const maxCommits = Math.max(...commitCounts, 1);

  return (
    <div className="flex items-end justify-between h-32 space-x-2">
      {commitCounts.map((count, index) => (
        <div key={index} className="flex-1 flex flex-col items-center">
          <div
            className="bg-neonAqua rounded-t w-full transition-all duration-300 hover:bg-neonEmerald"
            style={{ height: `${(count / maxCommits) * 100}%` }}
          />
          <div className="text-textSecondary text-xs mt-2">
            {last7Days[index].split('-')[2]}
          </div>
        </div>
      ))}
    </div>
  );
}

function TaskStatusChart({ tasks }: { tasks: Tables<'tasks'>[] }) {
  const statusCounts = tasks.reduce((acc, task) => {
    acc[task.status] = (acc[task.status] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const colors = {
    todo: 'text-neonIndigo',
    in_progress: 'text-neonAqua',
    completed: 'text-neonEmerald',
    blocked: 'text-red-400'
  };

  return (
    <div className="space-y-3">
      {Object.entries(statusCounts).map(([status, count]) => (
        <div key={status} className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className={`w-3 h-3 rounded-full ${colors[status as keyof typeof colors] || 'text-textSecondary'}`} />
            <span className="text-textPrimary capitalize">{status.replace('_', ' ')}</span>
          </div>
          <span className="text-textSecondary font-medium">{count}</span>
        </div>
      ))}
    </div>
  );
}
