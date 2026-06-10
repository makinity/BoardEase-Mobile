import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import * as api from '../api';
import type { CreatePaymentInput } from '../types';

export function usePayments() {
  return useQuery({ queryKey: queryKeys.payments.all(), queryFn: api.listPayments });
}

export function usePayment(id: string) {
  return useQuery({
    queryKey: queryKeys.payments.detail(id),
    queryFn: () => api.getPayment(id),
    enabled: !!id,
  });
}

export function useCreatePayment() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePaymentInput) => api.createPayment(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.payments.all() }),
  });
}

function usePaymentStatusMutation(action: (id: string) => Promise<unknown>) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => action(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.payments.all() }),
  });
}

export const useApprovePayment = () => usePaymentStatusMutation(api.approvePayment);
export const useRejectPayment = () => usePaymentStatusMutation(api.rejectPayment);

export function useBills() {
  return useQuery({ queryKey: queryKeys.bills.all(), queryFn: api.listBills });
}

export function useBill(id: string) {
  return useQuery({
    queryKey: queryKeys.bills.detail(id),
    queryFn: () => api.getBill(id),
    enabled: !!id,
  });
}
