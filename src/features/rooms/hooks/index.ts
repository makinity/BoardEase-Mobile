import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import * as api from '../api';
import type { CreateRoomInput, UpdateRoomInput } from '../types';

export function useRooms() {
  return useQuery({ queryKey: queryKeys.rooms.all(), queryFn: api.listRooms });
}

export function useRoomsByProperty(propertyId: string) {
  return useQuery({
    queryKey: queryKeys.properties.rooms(propertyId),
    queryFn: () => api.listRoomsByProperty(propertyId),
    enabled: !!propertyId,
  });
}

export function useRoom(id: string) {
  return useQuery({
    queryKey: queryKeys.rooms.detail(id),
    queryFn: () => api.getRoom(id),
    enabled: !!id,
  });
}

export function useCreateRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: CreateRoomInput) => api.createRoom(input),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all() }),
  });
}

export function useUpdateRoom(id: string) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (input: UpdateRoomInput) => api.updateRoom(id, input),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all() });
      queryClient.invalidateQueries({ queryKey: queryKeys.rooms.detail(id) });
    },
  });
}

export function useDeleteRoom() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.deleteRoom(id),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: queryKeys.rooms.all() }),
  });
}
