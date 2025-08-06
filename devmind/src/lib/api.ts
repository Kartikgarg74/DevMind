import { supabase, handleSupabaseError } from './supabaseClient';
import type { Tables, Inserts, Updates } from '@/types/supabase';

export class ApiService {
  // Project operations
  static async createProject(projectData: Inserts<'projects'>) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .insert(projectData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  static async getProjects(userId: string) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('created_by', userId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  static async getProject(projectId: string) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  static async updateProject(projectId: string, updates: Updates<'projects'>) {
    try {
      const { data, error } = await supabase
        .from('projects')
        .update(updates)
        .eq('id', projectId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  static async deleteProject(projectId: string) {
    try {
      const { error } = await supabase
        .from('projects')
        .delete()
        .eq('id', projectId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: handleSupabaseError(error) };
    }
  }

  // Task operations
  static async createTask(taskData: Inserts<'tasks'>) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .insert(taskData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  static async getTasks(projectId?: string, userId?: string) {
    try {
      let query = supabase.from('tasks').select('*');

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      if (userId) {
        query = query.or(`assigned_to.eq.${userId},created_by.eq.${userId}`);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  static async updateTask(taskId: string, updates: Updates<'tasks'>) {
    try {
      const { data, error } = await supabase
        .from('tasks')
        .update(updates)
        .eq('id', taskId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  static async deleteTask(taskId: string) {
    try {
      const { error } = await supabase
        .from('tasks')
        .delete()
        .eq('id', taskId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: handleSupabaseError(error) };
    }
  }

  // Commit operations
  static async createCommit(commitData: Inserts<'commits'>) {
    try {
      const { data, error } = await supabase
        .from('commits')
        .insert(commitData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  static async getCommits(userId: string, projectId?: string) {
    try {
      let query = supabase
        .from('commits')
        .select('*')
        .eq('user_id', userId);

      if (projectId) {
        query = query.eq('project_id', projectId);
      }

      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  static async updateCommit(commitId: string, updates: Updates<'commits'>) {
    try {
      const { data, error } = await supabase
        .from('commits')
        .update(updates)
        .eq('id', commitId)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  static async deleteCommit(commitId: string) {
    try {
      const { error } = await supabase
        .from('commits')
        .delete()
        .eq('id', commitId);

      if (error) throw error;
      return { error: null };
    } catch (error) {
      return { error: handleSupabaseError(error) };
    }
  }

  // Analytics operations
  static async createAnalytics(analyticsData: Inserts<'analytics'>) {
    try {
      const { data, error } = await supabase
        .from('analytics')
        .insert(analyticsData)
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  static async getAnalytics(projectId: string, metricName?: string) {
    try {
      let query = supabase
        .from('analytics')
        .select('*')
        .eq('project_id', projectId);

      if (metricName) {
        query = query.eq('metric_name', metricName);
      }

      const { data, error } = await query.order('recorded_at', { ascending: false });

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  // Real-time subscriptions
  static subscribeToChanges(table: string, callback: (payload: any) => void) {
    return supabase
      .channel(`${table}_changes`)
      .on('postgres_changes', { event: '*', schema: 'public', table }, callback)
      .subscribe();
  }

  // File upload operations
  static async uploadFile(bucket: string, path: string, file: File) {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .upload(path, file);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }

  static async getFileUrl(bucket: string, path: string) {
    try {
      const { data } = supabase.storage
        .from(bucket)
        .getPublicUrl(path);

      return { data, error: null };
    } catch (error) {
      return { data: null, error: handleSupabaseError(error) };
    }
  }
}
