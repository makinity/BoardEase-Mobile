import { create } from 'zustand';

import type { Notification } from '@/types';

type NotificationStore = {
  notifications: Notification[];
  unreadCount: number;
  setNotifications: (items: Notification[]) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  clear: () => void;
};

export const useNotificationStore = create<NotificationStore>((set) => ({
  notifications: [],
  unreadCount: 0,
  setNotifications: (items) =>
    set({ notifications: items, unreadCount: items.filter((n) => !n.isRead).length }),
  markRead: (id) =>
    set((state) => {
      const notifications = state.notifications.map((n) => (n.id === id ? { ...n, isRead: true } : n));
      return { notifications, unreadCount: notifications.filter((n) => !n.isRead).length };
    }),
  markAllRead: () =>
    set((state) => ({
      notifications: state.notifications.map((n) => ({ ...n, isRead: true })),
      unreadCount: 0,
    })),
  clear: () => set({ notifications: [], unreadCount: 0 }),
}));
