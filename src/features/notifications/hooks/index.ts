import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import * as api from '../api';

export function useNotifications() {
  return useQuery({ queryKey: queryKeys.notifications.all(), queryFn: api.listNotifications });
}

export function useUnreadCount() {
  return useQuery({ queryKey: queryKeys.notifications.unreadCount(), queryFn: api.getUnreadCount });
}

function useInvalidateNotifications() {
  const queryClient = useQueryClient();
  return () => {
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.all() });
    queryClient.invalidateQueries({ queryKey: queryKeys.notifications.unreadCount() });
  };
}

export function useMarkRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({ mutationFn: (id: string) => api.markRead(id), onSuccess: invalidate });
}

export function useMarkAllRead() {
  const invalidate = useInvalidateNotifications();
  return useMutation({ mutationFn: () => api.markAllRead(), onSuccess: invalidate });
}
