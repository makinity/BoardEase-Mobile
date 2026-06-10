import { useLocalSearchParams } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { EmptyState, LoadingState, Screen } from '@/components/layout';
import { useCancelReservation, useReservation } from '@/features/reservations';

const STATUS_COLOR: Record<string, string> = {
  pending: '#D69E2E', approved: '#38A169', rejected: '#E53E3E',
  cancelled: '#718096', converted: '#3182CE',
};

export default function OccupantReservationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: reservation, isLoading } = useReservation(id);
  const { mutate: cancel, isPending } = useCancelReservation();

  if (isLoading) return <LoadingState />;
  if (!reservation) return <EmptyState title="Reservation not found" />;

  const canCancel = reservation.status === 'pending' || reservation.status === 'approved';

  function handleCancel() {
    Alert.alert('Cancel Reservation', 'Are you sure?', [
      { text: 'No', style: 'cancel' },
      { text: 'Yes', style: 'destructive', onPress: () => cancel(id) },
    ]);
  }

  return (
    <Screen title="Reservation Detail">
      <View style={styles.row}><Text style={styles.label}>Status</Text>
        <Text style={[styles.value, { color: STATUS_COLOR[reservation.status] ?? '#102A43' }]}>{reservation.status}</Text>
      </View>
      <View style={styles.row}><Text style={styles.label}>Start Date</Text><Text style={styles.value}>{reservation.startDate}</Text></View>
      {reservation.notes ? (
        <View style={styles.row}><Text style={styles.label}>Notes</Text><Text style={styles.value}>{reservation.notes}</Text></View>
      ) : null}
      {canCancel ? (
        <TouchableOpacity style={styles.cancelBtn} onPress={handleCancel} disabled={isPending}>
          <Text style={styles.cancelText}>{isPending ? 'Cancelling…' : 'Cancel Reservation'}</Text>
        </TouchableOpacity>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  label: { fontSize: 15, color: '#627D98' },
  value: { fontSize: 15, fontWeight: '600', color: '#102A43', textTransform: 'capitalize', flexShrink: 1, textAlign: 'right' },
  cancelBtn: { marginTop: 16, padding: 14, borderRadius: 8, borderWidth: 1, borderColor: '#E53E3E', alignItems: 'center' },
  cancelText: { color: '#E53E3E', fontWeight: '600', fontSize: 15 },
});
