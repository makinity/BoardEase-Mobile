import { supabase } from '@/lib/supabase';

import type { Collectable } from '../types';

const TABLE = 'collectables';

function toCollectable(row: Record<string, unknown>): Collectable {
  return {
    id: row.id as string,
    ownerId: row.owner_id as string,
    propertyId: row.property_id as string,
    rentalId: row.rental_id as string,
    amount: row.amount as number,
    dueDate: row.due_date as string,
    isPaid: row.is_paid as boolean,
  };
}

export async function listCollectables(): Promise<Collectable[]> {
  const { data, error } = await supabase.from(TABLE).select('*');
  if (error) throw error;
  return (data ?? []).map(toCollectable);
}

export async function getCollectable(id: string): Promise<Collectable> {
  const { data, error } = await supabase.from(TABLE).select('*').eq('id', id).single();
  if (error) throw error;
  return toCollectable(data);
}
