import { useMutation, useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import * as api from '../api';
import type { AuthCredentials, RegisterInput } from '../types';

export function useSession() {
  return useQuery({
    queryKey: queryKeys.auth.session(),
    queryFn: async () => {
      const { data, error } = await api.getSession();
      if (error) throw error;
      return data.session;
    },
  });
}

export function useSignIn() {
  return useMutation({
    mutationFn: async (credentials: AuthCredentials) => {
      const { data, error } = await api.signIn(credentials);
      if (error) throw error;
      return data;
    },
  });
}

export function useSignUp() {
  return useMutation({
    mutationFn: async (input: RegisterInput) => {
      const { data, error } = await api.signUp(input);
      if (error) throw error;
      return data;
    },
  });
}

export function useSignOut() {
  return useMutation({
    mutationFn: async () => {
      const { error } = await api.signOut();
      if (error) throw error;
    },
  });
}
