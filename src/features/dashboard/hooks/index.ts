import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import * as api from '../api';

export function useOwnerDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.owner(),
    queryFn: api.getOwnerDashboard,
  });
}

export function useOccupantDashboard() {
  return useQuery({
    queryKey: queryKeys.dashboard.occupant(),
    queryFn: api.getOccupantDashboard,
  });
}
