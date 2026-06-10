import { supabase } from '@/lib/supabase';

import type { Report } from '../types';

const TABLE = 'reports';

export async function listReports(): Promise<Report[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []) as Report[];
}

export async function getReport(id: string): Promise<Report> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return data as Report;
}
