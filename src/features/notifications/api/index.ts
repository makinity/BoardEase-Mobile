import { supabase } from '@/lib/supabase';

import type { Notification } from '../types';

const TABLE = 'notifications';

export async function listNotifications(): Promise<Notification[]> {
  const { data, error } = await supabase.from(TABLE).select('*').order('createdAt', { ascending: false });
  if (error) throw error;
  return (data ?? []) as Notification[];
}

export async function getUnreadCount(): Promise<number> {
  const { count, error } = await supabase
    .from(TABLE)
    .select('*', { count: 'exact', head: true })
    .eq('isRead', false);
  if (error) throw error;
  return count ?? 0;
}

export async function markRead(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).update({ isRead: true }).eq('id', id);
  if (error) throw error;
}

export async function markAllRead(): Promise<void> {
  const { error } = await supabase.from(TABLE).update({ isRead: true }).eq('isRead', false);
  if (error) throw error;
}
