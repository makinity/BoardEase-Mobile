import { useQuery } from '@tanstack/react-query';

import { queryKeys } from '@/lib/query-keys';

import * as api from '../api';

export function useReports() {
  return useQuery({ queryKey: queryKeys.reports.all(), queryFn: api.listReports });
}

export function useReport(id: string) {
  return useQuery({
    queryKey: queryKeys.reports.detail(id),
    queryFn: () => api.getReport(id),
    enabled: !!id,
  });
}
