import { supabase } from '@/lib/supabase';

import type { Collectable } from '../types';

const TABLE = 'collectables';

export async function listCollectables(): Promise<Collectable[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []) as Collectable[];
}

export async function getCollectable(id: string): Promise<Collectable> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return data as Collectable;
}
