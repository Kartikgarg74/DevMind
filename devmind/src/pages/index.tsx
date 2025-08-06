import { useEffect, useState, useCallback } from "react";
import { useRouter } from "next/router";
import Sidebar from "@/components/Sidebar";
import NeuralCore3D from "@/components/NeuralCore3D";
import CommitTimeline from "@/components/CommitTimeline";
import VoiceChatTerminal from "@/components/VoiceChatTerminal";
import CreateCommitForm from "@/components/CreateCommitForm";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import ProjectManager from "@/components/ProjectManager";
import NotificationSystem from "@/components/NotificationSystem";
import { useUser } from "./_app";
import { ApiService } from "@/lib/api";
import { realtimeService, type RealtimeEvent } from "@/lib/realtime";
import type { Tables } from "@/types/supabase";

const mockCommits = [
  {
    id: "1",
    title: "Refactor Auth Pipeline",
    narrative: "Refactored the authentication pipeline to improve token security and modularity.",
    files: ["auth.ts", "security.ts"],
    user_id: "mock-user",
    project_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "2",
    title: "Add Debug Agent",
    narrative: "Implemented the Debug Agent for intelligent bug tracing across files.",
    files: ["debug_agent.py", "core.py"],
    user_id: "mock-user",
    project_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "3",
    title: "Story Commit Messages",
    narrative: "Enabled narrative-style commit messages for better project history.",
    files: ["commit.py", "storyteller_agent.py"],
    user_id: "mock-user",
    project_id: null,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export default function Home() {
  const { user, loading, signOut } = useUser();
  const router = useRouter();
  const [commits, setCommits] = useState<typeof mockCommits>(mockCommits);
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'projects' | 'analytics'>('overview');

  const fetchCommits = useCallback(async () => {
    if (!user) return;
    setLoadingCommits(true);
    try {
      const { data, error } = await ApiService.getCommits(user.id);
      if (error) throw error;
      if (data && data.length > 0) setCommits(data);
    } catch (error) {
      console.error('Error fetching commits:', error);
    } finally {
      setLoadingCommits(false);
    }
  }, [user]);

  // Set up real-time subscriptions
  useEffect(() => {
    if (!user) return;

    const handleRealtimeEvent = (event: RealtimeEvent) => {
      console.log('Realtime event:', event);

      // Handle different event types
      switch (event.type) {
        case 'commit':
          if (event.action === 'insert') {
            setCommits(prev => [event.data, ...prev]);
          } else if (event.action === 'delete') {
            setCommits(prev => prev.filter(c => c.id !== event.data.id));
          } else if (event.action === 'update') {
            setCommits(prev => prev.map(c => c.id === event.data.id ? event.data : c));
          }
          break;
        case 'project':
          // Handle project updates
          break;
        case 'task':
          // Handle task updates
          break;
      }
    };

    const unsubscribe = realtimeService.subscribeToUserActivity(user.id, handleRealtimeEvent);

    return () => {
      unsubscribe();
    };
  }, [user]);

  useEffect(() => {
    if (!loading && !user) {
      router.push("/auth/login");
    }
  }, [user, loading, router]);

  useEffect(() => {
    fetchCommits();
  }, [fetchCommits]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-[#181C24] to-[#23283A] flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neonAqua mx-auto mb-4"></div>
          <p className="text-textPrimary">Loading DevMind...</p>
        </div>
      </div>
    );
  }

  if (!user) return null;

  return (
    <>
      <Sidebar />
      <div className="flex-1 flex flex-col min-h-screen pl-72 pr-8 py-8">
        {/* Header Bar */}
        <header className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-4xl font-mono font-bold text-neonAqua tracking-tight drop-shadow-neon">
              Welcome to DevMind
            </h1>
            <p className="text-textSecondary mt-2">Your AI-powered development companion</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="text-neonAqua font-mono text-lg bg-card px-6 py-2 rounded-xl border border-border shadow-card">
              {user.email}
            </div>
            <button
              onClick={signOut}
              className="text-textSecondary hover:text-neonAqua transition-colors"
              title="Sign out"
            >
              🚪
            </button>
          </div>
        </header>

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-card rounded-xl p-1 border border-border">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'overview'
                ? 'bg-neonAqua text-background shadow-neon'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Overview
          </button>
          <button
            onClick={() => setActiveTab('projects')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'projects'
                ? 'bg-neonAqua text-background shadow-neon'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Projects
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              activeTab === 'analytics'
                ? 'bg-neonAqua text-background shadow-neon'
                : 'text-textSecondary hover:text-textPrimary'
            }`}
          >
            Analytics
          </button>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <div>
              <CreateCommitForm userId={user.id} onCommitCreated={fetchCommits} />
              {loadingCommits ? (
                <div className="mt-8 text-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-neonAqua mx-auto mb-2"></div>
                  <p className="text-textSecondary">Loading commits...</p>
                </div>
              ) : (
                <CommitTimeline commits={commits} />
              )}
            </div>
            <div className="hidden xl:block">
              <AnalyticsDashboard userId={user.id} />
            </div>
          </div>
        )}

        {activeTab === 'projects' && (
          <ProjectManager userId={user.id} />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard userId={user.id} />
        )}
      </div>

      {/* Global Components */}
      <NeuralCore3D />
      <VoiceChatTerminal />
      <NotificationSystem />
    </>
  );
}
