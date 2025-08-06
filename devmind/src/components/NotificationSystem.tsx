import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { realtimeService, type Notification } from '@/lib/realtime';

export default function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    // Load stored notifications
    const storedNotifications = realtimeService.getStoredNotifications();
    setNotifications(storedNotifications);
    setUnreadCount(storedNotifications.filter(n => !n.read).length);

    // Listen for new notifications
    const handleNewNotification = (notification: Notification) => {
      setNotifications(prev => [notification, ...prev]);
      setUnreadCount(prev => prev + 1);
    };

    realtimeService.addNotificationListener(handleNewNotification);

    return () => {
      realtimeService.removeNotificationListener(handleNewNotification);
    };
  }, []);

  const markAsRead = (notificationId: string) => {
    realtimeService.markNotificationAsRead(notificationId);
    setNotifications(prev =>
      prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
    );
    setUnreadCount(prev => Math.max(0, prev - 1));
  };

  const markAllAsRead = () => {
    notifications.forEach(n => {
      if (!n.read) {
        realtimeService.markNotificationAsRead(n.id);
      }
    });
    setNotifications(prev => prev.map(n => ({ ...n, read: true })));
    setUnreadCount(0);
  };

  const clearAll = () => {
    realtimeService.clearNotifications();
    setNotifications([]);
    setUnreadCount(0);
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return '✅';
      case 'warning':
        return '⚠️';
      case 'error':
        return '❌';
      default:
        return 'ℹ️';
    }
  };

  const getNotificationColor = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-green-500/30 bg-green-500/10';
      case 'warning':
        return 'border-yellow-500/30 bg-yellow-500/10';
      case 'error':
        return 'border-red-500/30 bg-red-500/10';
      default:
        return 'border-neonAqua/30 bg-neonAqua/10';
    }
  };

  return (
    <>
      {/* Notification Bell */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className="relative fixed top-4 right-20 w-12 h-12 bg-card border border-border rounded-xl shadow-card hover:border-neonAqua transition-colors z-50 flex items-center justify-center"
      >
        <span className="text-xl">🔔</span>
        {unreadCount > 0 && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-bold"
          >
            {unreadCount > 99 ? '99+' : unreadCount}
          </motion.div>
        )}
      </motion.button>

      {/* Notification Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-16 right-4 w-80 max-h-96 bg-card border border-border rounded-2xl shadow-card z-40 flex flex-col"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-4 border-b border-border">
              <h3 className="text-textPrimary font-semibold">Notifications</h3>
              <div className="flex space-x-2">
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-neonAqua hover:text-neonEmerald text-sm transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={clearAll}
                  className="text-textSecondary hover:text-red-400 text-sm transition-colors"
                >
                  Clear all
                </button>
              </div>
            </div>

            {/* Notifications List */}
            <div className="flex-1 overflow-y-auto max-h-64">
              {notifications.length === 0 ? (
                <div className="p-6 text-center text-textSecondary">
                  <div className="text-3xl mb-2">🔕</div>
                  <p>No notifications yet</p>
                </div>
              ) : (
                <div className="p-2 space-y-2">
                  <AnimatePresence>
                    {notifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 20 }}
                        className={`p-3 rounded-lg border ${getNotificationColor(notification.type)} ${
                          !notification.read ? 'ring-1 ring-neonAqua/50' : ''
                        }`}
                        onClick={() => !notification.read && markAsRead(notification.id)}
                      >
                        <div className="flex items-start space-x-3">
                          <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-textPrimary font-medium text-sm mb-1">
                              {notification.title}
                            </h4>
                            <p className="text-textSecondary text-xs mb-2">
                              {notification.message}
                            </p>
                            <div className="flex items-center justify-between">
                              <span className="text-textSecondary text-xs">
                                {new Date(notification.timestamp).toLocaleTimeString()}
                              </span>
                              {notification.action && (
                                <button
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    window.open(notification.action!.url, '_blank');
                                  }}
                                  className="text-neonAqua hover:text-neonEmerald text-xs transition-colors"
                                >
                                  {notification.action.label}
                                </button>
                              )}
                            </div>
                          </div>
                          {!notification.read && (
                            <div className="w-2 h-2 bg-neonAqua rounded-full flex-shrink-0 mt-1"></div>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toast Notifications */}
      <div className="fixed top-4 right-4 z-50 space-y-2">
        <AnimatePresence>
          {notifications.slice(0, 3).map((notification) => (
            <motion.div
              key={notification.id}
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className={`p-4 rounded-lg border shadow-lg ${getNotificationColor(notification.type)} max-w-sm`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                <div className="flex-1">
                  <h4 className="text-textPrimary font-medium text-sm mb-1">
                    {notification.title}
                  </h4>
                  <p className="text-textSecondary text-xs">
                    {notification.message}
                  </p>
                </div>
                <button
                  onClick={() => markAsRead(notification.id)}
                  className="text-textSecondary hover:text-textPrimary transition-colors"
                >
                  ✕
                </button>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
    </>
  );
}
