import { supabase } from './supabaseClient';
import { ApiService } from './api';

export interface RealtimeEvent {
  type: 'commit' | 'task' | 'project' | 'notification';
  action: 'insert' | 'update' | 'delete';
  data: any;
  timestamp: string;
}

export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  action?: {
    label: string;
    url: string;
  };
}

export class RealtimeService {
  private static instance: RealtimeService;
  private subscriptions: Map<string, any> = new Map();
  private listeners: Map<string, Set<(event: RealtimeEvent) => void>> = new Map();
  private notificationListeners: Set<(notification: Notification) => void> = new Set();

  static getInstance(): RealtimeService {
    if (!RealtimeService.instance) {
      RealtimeService.instance = new RealtimeService();
    }
    return RealtimeService.instance;
  }

  // Subscribe to real-time changes for a specific table
  subscribeToTable(table: string, userId: string, callback: (event: RealtimeEvent) => void) {
    const key = `${table}_${userId}`;

    if (this.subscriptions.has(key)) {
      this.subscriptions.get(key).unsubscribe();
    }

    const subscription = ApiService.subscribeToChanges(table, (payload) => {
      // Filter events based on user permissions
      if (this.shouldNotifyUser(payload, userId)) {
        const event: RealtimeEvent = {
          type: this.getEventType(table),
          action: payload.eventType,
          data: payload.new || payload.old,
          timestamp: new Date().toISOString(),
        };

        callback(event);
        this.notifyListeners(event);
      }
    });

    this.subscriptions.set(key, subscription);
    this.addListener(table, callback);

    return () => {
      subscription.unsubscribe();
      this.subscriptions.delete(key);
      this.removeListener(table, callback);
    };
  }

  // Subscribe to all user-related changes
  subscribeToUserActivity(userId: string, callback: (event: RealtimeEvent) => void) {
    const tables = ['commits', 'tasks', 'projects'];
    const unsubscribers: (() => void)[] = [];

    tables.forEach(table => {
      const unsubscribe = this.subscribeToTable(table, userId, callback);
      unsubscribers.push(unsubscribe);
    });

    return () => {
      unsubscribers.forEach(unsubscribe => unsubscribe());
    };
  }

  // Add event listener
  addListener(table: string, callback: (event: RealtimeEvent) => void) {
    if (!this.listeners.has(table)) {
      this.listeners.set(table, new Set());
    }
    this.listeners.get(table)!.add(callback);
  }

  // Remove event listener
  removeListener(table: string, callback: (event: RealtimeEvent) => void) {
    const tableListeners = this.listeners.get(table);
    if (tableListeners) {
      tableListeners.delete(callback);
    }
  }

  // Notify all listeners for an event
  private notifyListeners(event: RealtimeEvent) {
    const tableListeners = this.listeners.get(event.type);
    if (tableListeners) {
      tableListeners.forEach(callback => {
        try {
          callback(event);
        } catch (error) {
          console.error('Error in realtime listener:', error);
        }
      });
    }
  }

  // Add notification listener
  addNotificationListener(callback: (notification: Notification) => void) {
    this.notificationListeners.add(callback);
  }

  // Remove notification listener
  removeNotificationListener(callback: (notification: Notification) => void) {
    this.notificationListeners.delete(callback);
  }

  // Send notification
  sendNotification(notification: Omit<Notification, 'id' | 'timestamp' | 'read'>) {
    const fullNotification: Notification = {
      ...notification,
      id: crypto.randomUUID(),
      timestamp: new Date().toISOString(),
      read: false,
    };

    this.notificationListeners.forEach(callback => {
      try {
        callback(fullNotification);
      } catch (error) {
        console.error('Error in notification listener:', error);
      }
    });

    // Store notification in local storage for persistence
    this.storeNotification(fullNotification);
  }

  // Get stored notifications
  getStoredNotifications(): Notification[] {
    try {
      const stored = localStorage.getItem('devmind_notifications');
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Error reading stored notifications:', error);
      return [];
    }
  }

  // Mark notification as read
  markNotificationAsRead(notificationId: string) {
    const notifications = this.getStoredNotifications();
    const updatedNotifications = notifications.map(notification =>
      notification.id === notificationId
        ? { ...notification, read: true }
        : notification
    );
    localStorage.setItem('devmind_notifications', JSON.stringify(updatedNotifications));
  }

  // Clear all notifications
  clearNotifications() {
    localStorage.removeItem('devmind_notifications');
  }

  // Store notification in local storage
  private storeNotification(notification: Notification) {
    try {
      const notifications = this.getStoredNotifications();
      notifications.unshift(notification);

      // Keep only last 50 notifications
      const trimmedNotifications = notifications.slice(0, 50);
      localStorage.setItem('devmind_notifications', JSON.stringify(trimmedNotifications));
    } catch (error) {
      console.error('Error storing notification:', error);
    }
  }

  // Check if user should be notified about an event
  private shouldNotifyUser(payload: any, userId: string): boolean {
    // For commits, notify if user is the author
    if (payload.table === 'commits') {
      return payload.new?.user_id === userId;
    }

    // For tasks, notify if user is assigned or created by
    if (payload.table === 'tasks') {
      return payload.new?.assigned_to === userId || payload.new?.created_by === userId;
    }

    // For projects, notify if user is the creator
    if (payload.table === 'projects') {
      return payload.new?.created_by === userId;
    }

    return false;
  }

  // Get event type from table name
  private getEventType(table: string): RealtimeEvent['type'] {
    switch (table) {
      case 'commits':
        return 'commit';
      case 'tasks':
        return 'task';
      case 'projects':
        return 'project';
      default:
        return 'notification';
    }
  }

  // Disconnect all subscriptions
  disconnect() {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
    this.subscriptions.clear();
    this.listeners.clear();
    this.notificationListeners.clear();
  }
}

// Export singleton instance
export const realtimeService = RealtimeService.getInstance();
