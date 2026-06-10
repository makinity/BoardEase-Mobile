import { router } from 'expo-router';
import { FlatList, TouchableOpacity } from 'react-native';

import { RoomCard } from '@/components/cards';
import { EmptyState, LoadingState, Screen } from '@/components/layout';
import { useRooms } from '@/features/rooms';

export default function RoomsScreen() {
  const { data, isLoading, isError, refetch } = useRooms();

  return (
    <Screen title="Rooms" scrollable={false}>
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <EmptyState title="Couldn't load rooms" onRetry={refetch} />
      ) : !data?.length ? (
        <EmptyState title="No rooms yet" description="Add rooms from a property's detail page" />
      ) : (
        <FlatList
          data={data}
          keyExtractor={(r) => r.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/(owner)/rooms/${item.id}`)}>
              <RoomCard title={item.name} status={item.status} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ gap: 10, padding: 16 }}
        />
      )}
    </Screen>
  );
}
