import { router, useLocalSearchParams } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { LoadingState } from '@/components/layout';
import { useDeleteProperty, useProperty, useUpdateProperty } from '@/features/properties';

export default function EditPropertyScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: property, isLoading } = useProperty(id);
  const { mutate: update, isPending } = useUpdateProperty(id);
  const { mutate: remove } = useDeleteProperty();
  const [name, setName] = useState('');
  const [address, setAddress] = useState('');

  useEffect(() => {
    if (property) { setName(property.name); setAddress(property.address); }
  }, [property]);

  function handleSave() {
    if (!name.trim() || !address.trim()) return Alert.alert('Error', 'Name and address are required.');
    update({ name: name.trim(), address: address.trim() }, {
      onSuccess: () => router.back(),
      onError: (e) => Alert.alert('Error', e.message),
    });
  }

  function handleDelete() {
    Alert.alert('Delete Property', 'This will delete the property and all its rooms.', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => remove(id, { onSuccess: () => router.replace('/(owner)/my-bh') }) },
    ]);
  }

  if (isLoading) return <LoadingState />;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Property</Text>
      <TextInput style={styles.input} placeholder="Property name" value={name} onChangeText={setName} />
      <TextInput style={styles.input} placeholder="Address" value={address} onChangeText={setAddress} />
      <TouchableOpacity style={styles.button} onPress={handleSave} disabled={isPending}>
        <Text style={styles.buttonText}>{isPending ? 'Saving…' : 'Save Changes'}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
        <Text style={styles.deleteText}>Delete Property</Text>
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
  deleteButton: { padding: 14, alignItems: 'center' },
  deleteText: { color: '#E53E3E', fontSize: 15, fontWeight: '500' },
});
