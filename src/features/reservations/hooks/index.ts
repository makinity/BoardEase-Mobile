import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import * as api from '../api';
import type { CreateReservationInput } from '../types';

export function useReservations() {
  return useQuery({ queryKey: queryKeys.reservations.all(), queryFn: api.listReservations });
}

export function useReservation(id: string) {
  return useQuery({
    queryKey: queryKeys.reservations.detail(id),
    queryFn: () => api.getReservation(id),
    enabled: !!id,
  });
}

export function useCreateReservation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateReservationInput) => api.createReservation(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.reservations.all() }),
  });
}

function useReservationStatusMutation(action: (id: string) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => action(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.reservations.all() }),
  });
}

export const useCancelReservation = () => useReservationStatusMutation(api.cancelReservation);
export const useApproveReservation = () => useReservationStatusMutation(api.approveReservation);
export const useRejectReservation = () => useReservationStatusMutation(api.rejectReservation);
