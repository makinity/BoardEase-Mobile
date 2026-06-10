import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useCreateProperty } from '@/features/properties';
import { useAuthStore } from '@/store/auth.store';

export default function CreatePropertyScreen() {
  const userId = useAuthStore((s) => s.userId)!;
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');
  const { mutate, isPending } = useCreateProperty();

  function handleSubmit() {
    if (!name.trim() || !address.trim()) return Alert.alert('Error', 'Name and address are required.');
    mutate(
      { ownerId: userId, name: name.trim(), address: address.trim() },
      {
        onSuccess: () => router.back(),
        onError: (e) => Alert.alert('Error', e.message),
      }
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>New Property</Text>
      <TextInput style={styles.input} placeholder="Property name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={isPending}>
        <Text style={styles.buttonText}>{isPending ? 'Saving…' : 'Create Property'}</Text>
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
