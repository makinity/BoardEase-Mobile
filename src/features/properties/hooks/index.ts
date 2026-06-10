import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import * as api from '../api';
import type { CreatePropertyInput, UpdatePropertyInput } from '../types';

export function useProperties() {
  return useQuery({ queryKey: queryKeys.properties.all(), queryFn: api.listProperties });
}

export function useProperty(id: string) {
  return useQuery({
    queryKey: queryKeys.properties.detail(id),
    queryFn: () => api.getProperty(id),
    enabled: !!id,
  });
}

export function useCreateProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreatePropertyInput) => api.createProperty(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.properties.all() }),
  });
}

export function useUpdateProperty(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdatePropertyInput) => api.updateProperty(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.properties.detail(id) });
    },
  });
}

export function useDeleteProperty() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteProperty(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.properties.all() }),
  });
}
