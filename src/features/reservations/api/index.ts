import { supabase } from '@/lib/supabase';

import type { CreateReservationInput, Reservation, ReservationStatus } from '../types';

const TABLE = 'reservations';

function toReservation(row: Record<string, unknown>): Reservation {
  return {
    id: row.id as string,
    occupantId: row.occupant_id as string,
    propertyId: row.property_id as string,
    roomId: row.room_id as string,
    startDate: row.start_date as string,
    notes: row.notes as string | undefined,
    status: row.status as Reservation['status'],
  };
}

export async function listReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []).map(toReservation);
}

export async function getReservation(id: string): Promise<Reservation> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return toReservation(data);
}

export async function createReservation(input: CreateReservationInput): Promise<Reservation> {
  const { data, error } = await supabase.from(TABLE).insert({
    occupant_id: input.occupantId,
    property_id: input.propertyId,
    room_id: input.roomId,
    start_date: input.startDate,
    notes: input.notes,
    status: 'pending',
  }).select().single();
  if (error) throw error;
  return toReservation(data);
}

async function setStatus(id: string, status: ReservationStatus): Promise<Reservation> {
  const { data, error } = await supabase.from(TABLE).update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return toReservation(data);
}

export const cancelReservation = (id: string) => setStatus(id, 'cancelled');
export const approveReservation = (id: string) => setStatus(id, 'approved');
export const rejectReservation = (id: string) => setStatus(id, 'rejected');
