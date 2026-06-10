import { supabase } from '@/lib/supabase';

import type { CreatePropertyInput, Property, UpdatePropertyInput } from '../types';

const TABLE = 'properties';

export async function listProperties(): Promise<Property[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []) as Property[];
}

export async function getProperty(id: string): Promise<Property> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return data as Property;
}

export async function createProperty(input: CreatePropertyInput): Promise<Property> {
  const { data, error } = await supabase.from(TABLE).insert(input).select().single();
  if (error) throw error;
  return data as Property;
}

export async function updateProperty(id: string, input: UpdatePropertyInput): Promise<Property> {
  const { data, error } = await supabase.from(TABLE).update(input).eq('id', id).select().single();
  if (error) throw error;
  return data as Property;
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
