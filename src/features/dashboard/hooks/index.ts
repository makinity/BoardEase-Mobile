import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import * as api from '../api';

export function useOwnerDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.owner(),
    queryFn: async () => {
      const { data, error } = await api.getOwnerDashboard();
      if (error) throw error;
      return data;
    },
  });
}

export function useOccupantDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.occupant(),
    queryFn: async () => {
      const { data, error } = await api.getOccupantDashboard();
      if (error) throw error;
      return data;
    },
  });
}
