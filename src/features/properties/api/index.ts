import { supabase } from '@/lib/supabase';

import type { CreatePropertyInput, Property, UpdatePropertyInput } from '../types';

const TABLE = 'properties';

function toProperty(row: Record<string, unknown>): Property {
  return {
    id: row.id as string,
    ownerId: row.owner_id as string,
    name: row.name as string,
    address: row.address as string,
    latitude: row.latitude as number | undefined,
    longitude: row.longitude as number | undefined,
    imageUrl: row.image_url as string | undefined,
  };
}

function toInsert(input: Partial<CreatePropertyInput>) {
  return {
    owner_id: input.ownerId,
    name: input.name,
    address: input.address,
    latitude: input.latitude,
    longitude: input.longitude,
    image_url: input.imageUrl,
  };
}

export async function listProperties(): Promise<Property[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []).map(toProperty);
}

export async function getProperty(id: string): Promise<Property> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return toProperty(data);
}

export async function createProperty(input: CreatePropertyInput): Promise<Property> {
  const { data, error } = await supabase.from(TABLE).insert(toInsert(input)).select().single();
  if (error) throw error;
  return toProperty(data);
}

export async function updateProperty(id: string, input: UpdatePropertyInput): Promise<Property> {
  const { data, error } = await supabase.from(TABLE).update(toInsert(input)).eq('id', id).select().single();
  if (error) throw error;
  return toProperty(data);
}

export async function deleteProperty(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
