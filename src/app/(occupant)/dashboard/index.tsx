import { router } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { StatCard } from '@/components/cards';
import { EmptyState, LoadingState, Screen } from '@/components/layout';
import { useSignOut } from '@/features/auth';
import { useOccupantDashboard } from '@/features/dashboard';
import { useAuthStore } from '@/store/auth.store';
import { useProfileStore } from '@/store/profile.store';

export default function OccupantDashboardScreen() {
  const { data, isLoading, isError, refetch } = useOccupantDashboard();
  const profile = useProfileStore((s) => s.profile);

  if (isLoading) return <LoadingState />;
  if (isError || !data) return <EmptyState title="Couldn't load dashboard" onRetry={refetch} />;

  return (
    <Screen title={`Hello, ${profile?.displayName ?? 'Occupant'}`} description="Here's your overview">
      <View style={styles.grid}>
        <StatCard label="Active Rental" value={data.activeRental ? 'Active' : 'None'} />
        <StatCard label="Pending Bills" value={String(data.pendingBills)} />
        <StatCard label="Reservations" value={String(data.pendingReservations)} />
      </View>

      {!data.activeRental ? (
        <TouchableOpacity style={styles.browseBtn} onPress={() => router.push('/(public)')}>
          <Text style={styles.browseBtnText}>Browse Boarding Houses</Text>
        </TouchableOpacity>
      ) : null}

      <Text style={styles.sectionTitle}>Quick Actions</Text>
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(occupant)/reservations')}>
          <Text style={styles.actionText}>My Reservations</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(occupant)/bills')}>
          <Text style={styles.actionText}>My Bills</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(occupant)/rentals')}>
          <Text style={styles.actionText}>My Rentals</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/(occupant)/profile')}>
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
  browseBtn: { backgroundColor: '#3182CE', borderRadius: 10, padding: 16, alignItems: 'center' },
  browseBtnText: { color: '#fff', fontSize: 15, fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#102A43', marginTop: 8 },
  actions: { gap: 10 },
  actionBtn: { backgroundColor: '#fff', borderRadius: 10, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  actionText: { fontSize: 15, fontWeight: '500', color: '#3182CE' },
  signOutBtn: { marginTop: 8, padding: 16, alignItems: 'center' },
  signOutText: { color: '#E53E3E', fontSize: 15, fontWeight: '600' },
});
