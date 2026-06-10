import { router } from 'expo-router';
import { FlatList, TouchableOpacity } from 'react-native';

import { ReservationCard } from '@/components/cards';
import { EmptyState, LoadingState, Screen } from '@/components/layout';
import { useReservations } from '@/features/reservations';
import { useAuthStore } from '@/store/auth.store';

export default function OccupantReservationsScreen() {
  const userId = useAuthStore((s) => s.userId);
  const { data, isLoading, isError, refetch } = useReservations();
  const mine = data?.filter((r) => r.occupantId === userId);

  return (
    <Screen title="My Reservations" scrollable={false}>
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <EmptyState title="Couldn't load reservations" onRetry={refetch} />
      ) : !mine?.length ? (
        <EmptyState title="No reservations yet" description="Browse properties to reserve a room" />
      ) : (
        <FlatList
          data={mine}
          keyExtractor={(r) => r.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/(occupant)/reservations/${item.id}`)}>
              <ReservationCard title={`Room · ${item.startDate}`} status={item.status} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ gap: 10, padding: 16 }}
        />
      )}
    </Screen>
  );
}
