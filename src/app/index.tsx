import { Redirect } from 'expo-router';

import { useAuth } from '@/providers/AuthProvider';
import { useAuthStore } from '@/store/auth.store';

export default function RootIndex() {
  const { session, isLoading } = useAuth();
  const role = useAuthStore((s) => s.role);

  if (isLoading) return null;

  if (!session) return <Redirect href="/(auth)/login" />;

  if (role === 'owner') return <Redirect href="/(owner)/dashboard" />;

  return <Redirect href="/(occupant)/dashboard" />;
}
