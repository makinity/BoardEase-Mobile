import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import * as api from '../api';
import type { UpdateProfileInput } from '../types';

export function useProfile() {
  return useQuery({ queryKey: queryKeys.profile.me(), queryFn: api.getMyProfile });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateProfileInput) => api.updateProfile(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.profile.me() }),
  });
}

export function useChangePassword() {
  return useMutation({ mutationFn: (password: string) => api.changePassword(password) });
}
