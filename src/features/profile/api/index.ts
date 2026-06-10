import { supabase } from '@/lib/supabase';

import type { UpdateProfileInput, User } from '../types';

const TABLE = 'profiles';

export async function getMyProfile(): Promise<User> {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) throw new Error('Not authenticated');

  const { data, error } = await supabase.from(TABLE).select('*').eq('id', authUser.id).single();
  if (error) throw error;
  return {
    id: data.id,
    email: authUser.email ?? '',
    role: data.role,
    displayName: data.display_name,
    avatarUrl: data.avatar_url ?? undefined,
  };
}

export async function updateProfile(input: UpdateProfileInput): Promise<User> {
  const { data: { user: authUser } } = await supabase.auth.getUser();
  if (!authUser) throw new Error('Not authenticated');

  const dbInput: Record<string, unknown> = {};
  if (input.displayName) dbInput.display_name = input.displayName;
  if (input.avatarUrl !== undefined) dbInput.avatar_url = input.avatarUrl;

  const { data, error } = await supabase.from(TABLE).update(dbInput).eq('id', authUser.id).select().single();
  if (error) throw error;
  return {
    id: data.id,
    email: authUser.email ?? '',
    role: data.role,
    displayName: data.display_name,
    avatarUrl: data.avatar_url ?? undefined,
  };
}

export async function changePassword(password: string): Promise<void> {
  const { error } = await supabase.auth.updateUser({ password });
  if (error) throw error;
}
