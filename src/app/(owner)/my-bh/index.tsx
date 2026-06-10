import { router } from 'expo-router';
import { FlatList, TouchableOpacity } from 'react-native';

import { PropertyCard } from '@/components/cards';
import { EmptyState, LoadingState, Screen } from '@/components/layout';
import { useProperties } from '@/features/properties';
import { useAuthStore } from '@/store/auth.store';

export default function MyBHScreen() {
  const userId = useAuthStore((s) => s.userId);
  const { data, isLoading, isError, refetch } = useProperties();
  const owned = data?.filter((p) => p.ownerId === userId);

  return (
    <Screen title="My Properties" scrollable={false}>
      {isLoading ? (
        <LoadingState />
      ) : isError ? (
        <EmptyState title="Couldn't load properties" onRetry={refetch} />
      ) : !owned?.length ? (
        <EmptyState
          title="No properties yet"
          description="Add your first boarding house"
          onRetry={() => router.push('/(owner)/my-bh/create')}
        />
      ) : (
        <FlatList
          data={owned}
          keyExtractor={(p) => p.id}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/(owner)/my-bh/${item.id}`)}>
              <PropertyCard name={item.name} location={item.address} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ gap: 10, padding: 16 }}
        />
      )}
    </Screen>
  );
}
