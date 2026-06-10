import { router, useLocalSearchParams } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useCreateReservation } from '@/features/reservations';
import { useAuthStore } from '@/store/auth.store';

export default function CreateReservationScreen() {
  const { roomId, propertyId } = useLocalSearchParams<{ roomId: string; propertyId: string }>();
  const userId = useAuthStore((s) => s.userId)!;
  const [startDate, setStartDate] = useState('');
  const [notes, setNotes] = useState('');
  const { mutate, isPending } = useCreateReservation();

  function handleSubmit() {
    if (!startDate.trim()) return Alert.alert('Error', 'Please enter a start date (YYYY-MM-DD).');
    mutate(
      { occupantId: userId, roomId, propertyId, startDate: startDate.trim(), notes: notes.trim() || undefined },
      {
        onSuccess: () => {
          Alert.alert('Success', 'Reservation submitted. Waiting for owner approval.', [
            { text: 'OK', onPress: () => router.replace('/(occupant)/reservations') },
          ]);
        },
        onError: (e) => Alert.alert('Error', e.message),
      }
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Reserve Room</Text>
      <TextInput
        style={styles.input}
        placeholder="Start date (YYYY-MM-DD)"
        value={startDate}
        onChangeText={setStartDate}
      />
      <TextInput
        style={[styles.input, styles.textarea]}
        placeholder="Notes (optional)"
        value={notes}
        onChangeText={setNotes}
        multiline
        numberOfLines={4}
      />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isPending}>
        <Text style={styles.buttonText}>{isPending ? 'Submitting…' : 'Submit Reservation'}</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 24, backgroundColor: '#F7FAFC', gap: 12 },
  title: { fontSize: 24, fontWeight: '700', color: '#102A43', marginBottom: 8 },
  input: { backgroundColor: '#fff', borderWidth: 1, borderColor: '#E2E8F0', borderRadius: 8, padding: 14, fontSize: 16 },
  textarea: { height: 100, textAlignVertical: 'top' },
  button: { backgroundColor: '#3182CE', borderRadius: 8, padding: 14, alignItems: 'center', marginTop: 4 },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
});
