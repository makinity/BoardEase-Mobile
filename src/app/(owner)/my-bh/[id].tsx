import { router, useLocalSearchParams } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { RoomCard } from '@/components/cards';
import { EmptyState, LoadingState, Screen } from '@/components/layout';
import { useProperty } from '@/features/properties';
import { useRoomsByProperty } from '@/features/rooms';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: property, isLoading } = useProperty(id);
  const { data: rooms, isLoading: loadingRooms } = useRoomsByProperty(id);

  if (isLoading) return <LoadingState />;
  if (!property) return <EmptyState title="Property not found" />;

  return (
    <Screen title={property.name}>
      <Text style={styles.address}>{property.address}</Text>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.btn} onPress={() => router.push(`/(owner)/my-bh/edit?id=${id}`)}>
          <Text style={styles.btnText}>Edit</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn} onPress={() => router.push(`/(owner)/rooms/create?propertyId=${id}`)}>
          <Text style={styles.btnText}>Add Room</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.sectionTitle}>Rooms ({rooms?.length ?? 0})</Text>

      {loadingRooms ? (
        <LoadingState />
      ) : !rooms?.length ? (
        <EmptyState title="No rooms yet" />
      ) : (
        <FlatList
          data={rooms}
          keyExtractor={(r) => r.id}
          scrollEnabled={false}
          renderItem={({ item }) => (
            <TouchableOpacity onPress={() => router.push(`/(owner)/rooms/${item.id}`)}>
              <RoomCard title={item.name} status={item.status} />
            </TouchableOpacity>
          )}
          contentContainerStyle={{ gap: 10 }}
        />
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  address: { fontSize: 14, color: '#627D98' },
  actions: { flexDirection: 'row', gap: 10 },
  btn: { flex: 1, backgroundColor: '#EBF8FF', borderRadius: 8, padding: 12, alignItems: 'center' },
  btnText: { color: '#3182CE', fontWeight: '600' },
  sectionTitle: { fontSize: 16, fontWeight: '600', color: '#102A43', marginTop: 8 },
});
