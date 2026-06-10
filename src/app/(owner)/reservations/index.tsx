import { router } from 'expo-router';
import { FlatList, TouchableOpacity } from 'react-native';

import { ReservationCard } from '@/components/cards';
import { EmptyState, LoadingState, Screen } from '@/components/layout';
import { useProperties } from '@/features/properties';
import { useReservations } from '@/features/reservations';
import { useAuthStore } from '@/store/auth.store';

export default function OwnerReservationsScreen() {
  const userId = useAuthStore((s) => s.userId);
  const { data: properties } = useProperties();
  const { data, isLoading, isError, refetch } = useReservations();

  const ownedIds = new Set(properties?.filter((p) => p.ownerId === userId).map((p) => p.id));
  const mine = data?.filter((r) => ownedIds.has(r.propertyId));

  return (
    <Screen title="Reservations" scrollable={false}>
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <EmptyState title="Couldn't load reservations" onRetry={refetch} />
      ) : !mine?.length ? (
        <EmptyState title="No reservations" />
      ) : (
        <FlatList
          data={mine}
          keyExtractor={(r) => r.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/(owner)/reservations/${item.id}`)}>
              <ReservationCard title={item.startDate} status={item.status} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ gap: 10, padding: 16 }}
        />
      )}
    </Screen>
  );
}
