import { supabase } from '@/lib/supabase';

import type { Rental, TransferRentalInput } from '../types';

const TABLE = 'rentals';

function toRental(row: Record<string, unknown>): Rental {
  return {
    id: row.id as string,
    occupantId: row.occupant_id as string,
    propertyId: row.property_id as string,
    roomId: row.room_id as string,
    startDate: row.start_date as string,
    endDate: row.end_date as string | undefined,
    status: row.status as Rental['status'],
  };
}

export async function listRentals(): Promise<Rental[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []).map(toRental);
}

export async function getRental(id: string): Promise<Rental> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return toRental(data);
}

export async function transferRental(id: string, input: TransferRentalInput): Promise<Rental> {
  const { data, error } = await supabase.from(TABLE).update({
    room_id: input.roomId,
    status: 'transferred',
    end_date: input.effectiveDate,
  }).eq('id', id).select().single();
  if (error) throw error;
  return toRental(data);
}

export async function endRental(id: string, endDate?: string): Promise<Rental> {
  const { data, error } = await supabase.from(TABLE).update({
    status: 'ended',
    end_date: endDate ?? null,
  }).eq('id', id).select().single();
  if (error) throw error;
  return toRental(data);
}
