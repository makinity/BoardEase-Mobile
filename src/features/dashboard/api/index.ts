import { supabase } from '@/lib/supabase';

import type { OccupantDashboardData, OwnerDashboardData } from '../types';

export async function getOwnerDashboard(): Promise<OwnerDashboardData> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const { data: props } = await supabase.from('properties').select('id').eq('owner_id', user.id);
  const propertyIds = (props ?? []).map((p) => p.id);

  const [rentals, reservations, payments] = await Promise.all([
    propertyIds.length
      ? supabase.from('rentals').select('id', { count: 'exact' }).eq('status', 'active').in('property_id', propertyIds)
      : Promise.resolve({ count: 0 }),
    propertyIds.length
      ? supabase.from('reservations').select('id', { count: 'exact' }).eq('status', 'pending').in('property_id', propertyIds)
      : Promise.resolve({ count: 0 }),
    propertyIds.length
      ? supabase.from('rentals').select('id').in('property_id', propertyIds).then(async ({ data: r }) => {
          const rentalIds = (r ?? []).map((x) => x.id);
          if (!rentalIds.length) return { data: [] };
          return supabase.from('payments').select('amount').eq('status', 'approved').in('rental_id', rentalIds);
        })
      : Promise.resolve({ data: [] }),
  ]);

  const totalIncome = ((payments as { data: { amount: number }[] }).data ?? [])
    .reduce((sum, p) => sum + (p.amount ?? 0), 0);

  return {
    propertyCount: propertyIds.length,
    activeRentals: (rentals as { count: number }).count ?? 0,
    pendingReservations: (reservations as { count: number }).count ?? 0,
    totalIncome,
  };
}

export async function getOccupantDashboard(): Promise<OccupantDashboardData> {
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) throw new Error('Not authenticated');

  const [rental, bills, reservations] = await Promise.all([
    supabase.from('rentals').select('*').eq('occupant_id', user.id).eq('status', 'active').maybeSingle(),
    supabase.from('bills').select('id', { count: 'exact' }).eq('occupant_id', user.id).in('status', ['unpaid', 'partial']),
    supabase.from('reservations').select('id', { count: 'exact' }).eq('occupant_id', user.id).in('status', ['pending', 'approved']),
  ]);

  return {
    activeRental: rental.data ?? null,
    pendingBills: bills.count ?? 0,
    pendingReservations: reservations.count ?? 0,
  };
}
