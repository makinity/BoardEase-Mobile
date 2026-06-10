import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { LoadingState } from '@/components/layout';
import { useDeleteRoom, useRoom, useUpdateRoom } from '@/features/rooms';

const STATUSES = ['available', 'occupied', 'maintenance'] as const;

export default function EditRoomScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: room, isLoading } = useRoom(id);
  const { mutate: update, isPending } = useUpdateRoom(id);
  const { mutate: remove } = useDeleteRoom();
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('1');
  const [rate, setRate] = useState('');
  const [status, setStatus] = useState<typeof STATUSES[number]>('available');

  useEffect(() => {
    if (room) {
      setName(room.name);
      setCapacity(String(room.capacity));
      setRate(String(room.monthlyRate / 100));
      setStatus(room.status);
    }
  }, [room]);

  function handleSave() {
    const monthlyRate = Math.round(parseFloat(rate) * 100);
    if (!name.trim() || isNaN(monthlyRate)) return Alert.alert('Error', 'Invalid input.');
    update({ name: name.trim(), capacity: parseInt(capacity) || 1, monthlyRate, status }, {
      onSuccess: () => router.back(),
      onError: (e) => Alert.alert('Error', e.message),
    });
  }

  function handleDelete() {
    Alert.alert('Delete Room', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(id, { onSuccess: () => router.replace('/(owner)/rooms') }) },
    ]);
  }

  if (isLoading) return <LoadingState />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Room</Text>
      <TextInput style={styles.input} placeholder="Room name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Capacity" value={capacity} onChangeText={setCapacity} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Monthly rate (PHP)" value={rate} onChangeText={setRate} keyboardType="decimal-pad" />
      <View style={styles.statusRow}>
        {STATUSES.map((s) => (
          <TouchableOpacity
            key={s}
            style={[styles.statusBtn, status === s && styles.statusBtnActive]}
            onPress={() => setStatus(s)}
          >
            <Text style={[styles.statusText, status === s && styles.statusTextActive]}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={isPending}>
        <Text style={styles.buttonText}>{isPending ? 'Saving…' : 'Save Changes'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete Room</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F7FAFC', gap: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#102A43', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 14, fontSize: 16 },
  statusRow: { flexDirection: 'row', gap: 8 },
  statusBtn: { flex: 1, padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', alignItems: 'center' },
  statusBtnActive: { backgroundColor: '#3182CE', borderColor: '#3182CE' },
  statusText: { fontSize: 13, color: '#627D98', textTransform: 'capitalize' },
  statusTextActive: { color: '#fff', fontWeight: '600' },
  button: { backgroundColor: '#3182CE', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  deleteButton: { padding: 14, alignItems: 'center' },
  deleteText: { color: '#E53E3E', fontSize: 15, fontWeight: '500' },
});
