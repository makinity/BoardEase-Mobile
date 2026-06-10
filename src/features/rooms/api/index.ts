import { supabase } from '@/lib/supabase';

import type { CreateRoomInput, Room, UpdateRoomInput } from '../types';

const TABLE = 'rooms';

export async function listRooms(): Promise<Room[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []) as Room[];
}

export async function listRoomsByProperty(propertyId: string): Promise<Room[]> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('propertyId', propertyId);
  if (error) throw error;
  return (data ?? []) as Room[];
}

export async function getRoom(id: string): Promise<Room> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return data as Room;
}

export async function createRoom(input: CreateRoomInput): Promise<Room> {
  const { data, error } = await supabase.from(TABLE).insert(input).select().single();
  if (error) throw error;
  return data as Room;
}

export async function updateRoom(id: string, input: UpdateRoomInput): Promise<Room> {
  const { data, error } = await supabase.from(TABLE).update(input).eq('id', id).select().single();
  if (error) throw error;
  return data as Room;
}

export async function deleteRoom(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
