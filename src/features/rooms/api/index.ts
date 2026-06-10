import { supabase } from '@/lib/supabase';

import type { CreateRoomInput, Room, UpdateRoomInput } from '../types';

const TABLE = 'rooms';

function toRoom(row: Record<string, unknown>): Room {
  return {
    id: row.id as string,
    propertyId: row.property_id as string,
    name: row.name as string,
    capacity: row.capacity as number,
    monthlyRate: row.monthly_rate as number,
    status: row.status as Room['status'],
  };
}

function toInsert(input: Partial<CreateRoomInput>) {
  return {
    property_id: input.propertyId,
    name: input.name,
    capacity: input.capacity,
    monthly_rate: input.monthlyRate,
    status: input.status,
  };
}

export async function listRooms(): Promise<Room[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []).map(toRoom);
}

export async function listRoomsByProperty(propertyId: string): Promise<Room[]> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('property_id', propertyId);
  if (error) throw error;
  return (data ?? []).map(toRoom);
}

export async function getRoom(id: string): Promise<Room> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return toRoom(data);
}

export async function createRoom(input: CreateRoomInput): Promise<Room> {
  const { data, error } = await supabase.from(TABLE).insert(toInsert(input)).select().single();
  if (error) throw error;
  return toRoom(data);
}

export async function updateRoom(id: string, input: UpdateRoomInput): Promise<Room> {
  const { data, error } = await supabase.from(TABLE).update(toInsert(input)).eq('id', id).select().single();
  if (error) throw error;
  return toRoom(data);
}

export async function deleteRoom(id: string): Promise<void> {
  const { error } = await supabase.from(TABLE).delete().eq('id', id);
  if (error) throw error;
}
