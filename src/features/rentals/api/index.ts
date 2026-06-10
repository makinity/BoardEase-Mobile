import { supabase } from '@/lib/supabase';

import type { Rental, TransferRentalInput } from '../types';

const TABLE = 'rentals';

export async function listRentals(): Promise<Rental[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []) as Rental[];
}

export async function getRental(id: string): Promise<Rental> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return data as Rental;
}

export async function transferRental(id: string, input: TransferRentalInput): Promise<Rental> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ roomId: input.roomId, status: 'transferred', endDate: input.effectiveDate })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Rental;
}

export async function endRental(id: string, endDate?: string): Promise<Rental> {
  const { data, error } = await supabase
    .from(TABLE)
    .update({ status: 'ended', endDate: endDate ?? null })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data as Rental;
}
