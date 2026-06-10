import { router, useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { EmptyState, LoadingState, Screen } from '@/components/layout';
import { useRoom } from '@/features/rooms';

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: room, isLoading } = useRoom(id);

  if (isLoading) return <LoadingState />;
  if (!room) return <EmptyState title="Room not found" />;

  const statusColor = room.status === 'available' ? '#38A169' : room.status === 'maintenance' ? '#DD6B20' : '#E53E3E';

  return (
    <Screen title={room.name}>
      <View style={styles.row}>
        <Text style={styles.label}>Status</Text>
        <Text style={[styles.value, { color: statusColor }]}>{room.status}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Capacity</Text>
        <Text style={styles.value}>{room.capacity} person{room.capacity !== 1 ? 's' : ''}</Text>
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>Monthly Rate</Text>
        <Text style={styles.value}>₱{(room.monthlyRate / 100).toLocaleString()}</Text>
      </View>
      <TouchableOpacity style={styles.editBtn} onPress={() => router.push(`/(owner)/rooms/edit?id=${id}`)}>
        <Text style={styles.editText}>Edit Room</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  label: { fontSize: 15, color: '#627D98' },
  value: { fontSize: 15, fontWeight: '600', color: '#102A43', textTransform: 'capitalize' },
  editBtn: { backgroundColor: '#EBF8FF', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 16 },
  editText: { color: '#3182CE', fontWeight: '600', fontSize: 15 },
});
