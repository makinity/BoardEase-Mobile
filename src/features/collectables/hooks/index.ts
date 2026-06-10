import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import * as api from '../api';

export function useCollectables() {
  return useQuery({ queryKey: queryKeys.collectables.all(), queryFn: api.listCollectables });
}

export function useCollectable(id: string) {
  return useQuery({
    queryKey: queryKeys.collectables.detail(id),
    queryFn: () => api.getCollectable(id),
    enabled: !!id,
  });
}
