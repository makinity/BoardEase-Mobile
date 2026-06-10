import { supabase } from '@/lib/supabase';

import type { Notification } from '../types';

const TABLE = 'notifications';

function toNotification(row: Record<string, unknown>): Notification {
  return {
    id: row.id as string,
    userId: row.user_id as string,
    title: row.title as string,
    message: row.message as string,
    isRead: row.is_read as boolean,
    createdAt: row.created_at as string,
  };
}

export async function listNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase.from(TABLE).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toNotification);
}

export async function getUnreadCount(): Promise<number> {
  const { count, error } = await supabase.from(TABLE).select('*', { count: 'exact', head: true }).eq('is_read', false);
  if (error) throw error;
  return count ?? 0;
}

export async function markRead(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).update({ is_read: true }).eq('id', id);
  if (error) throw error;
}

export async function markAllRead(): Promise<void> {
  const { error } = await supabase.from(TABLE).update({ is_read: true }).eq('is_read', false);
  if (error) throw error;
}
