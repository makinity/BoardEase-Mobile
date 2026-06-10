import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { StatCard } from '@/components/cards';
import { EmptyState, LoadingState, Screen } from '@/components/layout';
import { useSignOut } from '@/features/auth';
import { useOwnerDashboard } from '@/features/dashboard';
import { useAuthStore } from '@/store/auth.store';
import { useProfileStore } from '@/store/profile.store';

export default function OwnerDashboardScreen() {
  const { data, isLoading, isError, refetch } = useOwnerDashboard();
  const profile = useProfileStore((s) => s.profile);

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <EmptyState title="Couldn't load dashboard" onRetry={refetch} />;

  return (
    <Screen title={`Hello, ${profile?.displayName ?? 'Owner'}`} description="Here's your overview">
      <View style={styles.grid}>
        <StatCard label="Properties" value={String(data.propertyCount)} />
        <StatCard label="Active Rentals" value={String(data.activeRentals)} />
        <StatCard label="Pending Reservations" value={String(data.pendingReservations)} />
        <StatCard label="Total Income" value={`₱${(data.totalIncome / 100).toLocaleString()}`} />
      </View>

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(owner)/my-bh')}>
          <Text style={styles.actionText}>My Properties</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(owner)/reservations')}>
          <Text style={styles.actionText}>Reservations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(owner)/payments')}>
          <Text style={styles.actionText}>Payments</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(owner)/profile')}>
          <Text style={styles.actionText}>👤  Profile & Sign Out</Text>
        </TouchableOpacity>
      </View>

      <SignOutButton />
    </Screen>
  );
}

function SignOutButton() {
  const { mutate: signOut } = useSignOut();
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const clearProfile = useProfileStore((s) => s.clear);

  function handleSignOut() {
    signOut(undefined, {
      onSuccess: () => {
        clearAuth();
        clearProfile();
        router.replace('/(auth)/login');
      },
    });
  }

  return (
    <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
      <Text style={styles.signOutText}>Sign Out</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#102A43', marginTop: 8 },
  actions: { gap: 10 },
  actionBtn: { backgroundColor: '#fff', borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  actionText: { fontSize: 15, fontWeight: '500', color: '#3182CE' },
  signOutBtn: { marginTop: 8, padding: 16, alignItems: 'center' },
  signOutText: { color: '#E53E3E', fontSize: 15, fontWeight: '600' },
});
