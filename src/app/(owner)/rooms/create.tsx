import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useCreateRoom } from '@/features/rooms';

export default function CreateRoomScreen() {
  const { propertyId } = useLocalSearchParams<{ propertyId: string }>();
  const [name, setName] = useState('');
  const [capacity, setCapacity] = useState('1');
  const [rate, setRate] = useState('');
  const { mutate, isPending } = useCreateRoom();

  function handleSubmit() {
    if (!name.trim() || !rate.trim()) return Alert.alert('Error', 'Name and monthly rate are required.');
    const monthlyRate = Math.round(parseFloat(rate) * 100);
    if (isNaN(monthlyRate)) return Alert.alert('Error', 'Invalid rate.');
    mutate(
      { propertyId, name: name.trim(), capacity: parseInt(capacity) || 1, monthlyRate, status: 'available' },
      {
        onSuccess: () => router.back(),
        onError: (e) => Alert.alert('Error', e.message),
      }
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Room</Text>
      <TextInput style={styles.input} placeholder="Room name (e.g. Room 101)" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Capacity" value={capacity} onChangeText={setCapacity} keyboardType="numeric" />
      <TextInput style={styles.input} placeholder="Monthly rate (PHP)" value={rate} onChangeText={setRate} keyboardType="decimal-pad" />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isPending}>
        <Text style={styles.buttonText}>{isPending ? 'Saving…' : 'Create Room'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F7FAFC', gap: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#102A43', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 14, fontSize: 16 },
  button: { backgroundColor: '#3182CE', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
