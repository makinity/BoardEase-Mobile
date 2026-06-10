import { supabase } from '@/lib/supabase';

import type { UpdateProfileInput, User } from '../types';

const TABLE = 'profiles';

export async function getMyProfile(): Promise<User> {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('Not authenticated');

  const { data, error } = await supabase.from(TABLE).select('*').eq('id', userId).single();
  if (error) throw error;
  return data as User;
}

export async function updateProfile(input: UpdateProfileInput): Promise<User> {
  const { data: auth } = await supabase.auth.getUser();
  const userId = auth.user?.id;
  if (!userId) throw new Error('Not authenticated');

  const { data, error } = await supabase.from(TABLE).update(input).eq('id', userId).select().single();
  if (error) throw error;
  return data as User;
}

export async function changePassword(password: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}
