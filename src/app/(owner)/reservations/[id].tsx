import { useLocalSearchParams } from 'expo-router';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { EmptyState, LoadingState, Screen } from '@/components/layout';
import { useApproveReservation, useRejectReservation, useReservation } from '@/features/reservations';

const STATUS_COLOR: Record<string, string> = {
  pending: '#D69E2E', approved: '#38A169', rejected: '#E53E3E',
  cancelled: '#718096', converted: '#3182CE',
};

export default function OwnerReservationDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: reservation, isLoading } = useReservation(id);
  const { mutate: approve, isPending: approving } = useApproveReservation();
  const { mutate: reject, isPending: rejecting } = useRejectReservation();

  if (isLoading) return <LoadingState />;
  if (!reservation) return <EmptyState title="Reservation not found" />;

  const isPending = reservation.status === 'pending';

  return (
    <Screen title="Reservation Detail">
      <View style={styles.row}>
        <Text style={styles.label}>Status</Text>
        <Text style={[styles.value, { color: STATUS_COLOR[reservation.status] ?? '#102A43' }]}>{reservation.status}</Text>
      </View>
      <View style={styles.row}><Text style={styles.label}>Start Date</Text><Text style={styles.value}>{reservation.startDate}</Text></View>
      <View style={styles.row}><Text style={styles.label}>Room ID</Text><Text style={styles.value}>{reservation.roomId}</Text></View>
      {reservation.notes ? (
        <View style={styles.row}><Text style={styles.label}>Notes</Text><Text style={styles.value}>{reservation.notes}</Text></View>
      ) : null}

      {isPending ? (
        <View style={styles.actions}>
          <TouchableOpacity style={styles.approveBtn} onPress={() => approve(id)} disabled={approving}>
            <Text style={styles.approveTxt}>{approving ? '…' : 'Approve'}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.rejectBtn} onPress={() => reject(id)} disabled={rejecting}>
            <Text style={styles.rejectTxt}>{rejecting ? '…' : 'Reject'}</Text>
          </TouchableOpacity>
        </View>
      ) : null}
    </Screen>
  );
}

const styles = StyleSheet.create({
  row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  label: { fontSize: 15, color: '#627D98' },
  value: { fontSize: 15, fontWeight: '600', color: '#102A43', textTransform: 'capitalize', flexShrink: 1, textAlign: 'right' },
  actions: { flexDirection: 'row', gap: 10, marginTop: 16 },
  approveBtn: { flex: 1, backgroundColor: '#38A169', borderRadius: 8, padding: 14, alignItems: 'center' },
  approveTxt: { color: '#fff', fontWeight: '600', fontSize: 15 },
  rejectBtn: { flex: 1, borderWidth: 1, borderColor: '#E53E3E', borderRadius: 8, padding: 14, alignItems: 'center' },
  rejectTxt: { color: '#E53E3E', fontWeight: '600', fontSize: 15 },
});
