import { supabase } from '@/lib/supabase';

import type { CreateReservationInput, Reservation, ReservationStatus } from '../types';

const TABLE = 'reservations';

export async function listReservations(): Promise<Reservation[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []) as Reservation[];
}

export async function getReservation(id: string): Promise<Reservation> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return data as Reservation;
}

export async function createReservation(input: CreateReservationInput): Promise<Reservation> {
  const { data, error } = await supabase
    .from(TABLE)
    .insert({ ...input, status: 'pending' })
    .select()
    .single();
  if (error) throw error;
  return data as Reservation;
}

async function setStatus(id: string, status: ReservationStatus): Promise<Reservation> {
  const { data, error } = await supabase.from(TABLE).update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data as Reservation;
}

export const cancelReservation = (id: string) => setStatus(id, 'cancelled');
export const approveReservation = (id: string) => setStatus(id, 'approved');
export const rejectReservation = (id: string) => setStatus(id, 'rejected');
