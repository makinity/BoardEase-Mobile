import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import * as api from '../api';
import type { TransferRentalInput } from '../types';

export function useRentals() {
  return useQuery({ queryKey: queryKeys.rentals.all(), queryFn: api.listRentals });
}

export function useRental(id: string) {
  return useQuery({
    queryKey: queryKeys.rentals.detail(id),
    queryFn: () => api.getRental(id),
    enabled: !!id,
  });
}

export function useTransferRental(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: TransferRentalInput) => api.transferRental(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rentals.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.rentals.detail(id) });
    },
  });
}

export function useEndRental(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (endDate?: string) => api.endRental(id, endDate),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rentals.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.rentals.detail(id) });
    },
  });
}
