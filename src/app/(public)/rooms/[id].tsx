import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { EmptyState, LoadingState } from '@/components/layout';
import { useRoom } from '@/features/rooms';
import { useAuth } from '@/providers/AuthProvider';
import { Colors, Radius, Shadow, Spacing, StatusColors } from '@/theme/design';

export default function RoomDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: room, isLoading } = useRoom(id);
  const { session } = useAuth();

  if (isLoading) return <LoadingState />;
  if (!room) return <EmptyState title="Room not found" />;

  const sc = StatusColors[room.status] ?? StatusColors.available;

  function handleReserve() {
    if (!session) return router.push('/(auth)/login');
    router.push(`/(occupant)/reservations/create?roomId=${id}&propertyId=${room?.propertyId}`);
  }

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        {/* Header nav */}
        <View style={styles.nav}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <Text style={styles.navTitle}>BoardEase</Text>
          <View style={styles.avatar}><Text style={styles.avatarTxt}>B</Text></View>
        </View>

        {/* Room image */}
        <View style={styles.imgWrap}>
          <Text style={styles.imgEmoji}>🛏</Text>
          <View style={[styles.availBadge, { backgroundColor: sc.bg }]}>
            <Text style={[styles.availText, { color: sc.text }]}>✓ {room.status.charAt(0).toUpperCase() + room.status.slice(1)}</Text>
          </View>
        </View>

        <View style={styles.body}>
          <Text style={styles.name}>{room.name}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>Property · Room {room.name}</Text>
          </View>

          {/* Details card */}
          <View style={styles.detailsCard}>
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Text style={styles.detailIcon}>ℹ</Text>
                <Text style={styles.detailLabel}>Status</Text>
              </View>
              <Text style={[styles.detailValue, { color: sc.text }]}>
                {room.status.charAt(0).toUpperCase() + room.status.slice(1)}
              </Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Text style={styles.detailIcon}>👥</Text>
                <Text style={styles.detailLabel}>Capacity</Text>
              </View>
              <Text style={styles.detailValue}>{room.capacity} person{room.capacity !== 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.detailDivider} />
            <View style={styles.detailRow}>
              <View style={styles.detailLeft}>
                <Text style={styles.detailIcon}>💰</Text>
                <Text style={styles.detailLabel}>Monthly Rate</Text>
              </View>
              <Text style={[styles.detailValue, { color: Colors.primary }]}>₱{(room.monthlyRate / 100).toLocaleString()}.00</Text>
            </View>
          </View>

          {/* Amenity chips */}
          <View style={styles.amenityGrid}>
            <View style={styles.amenityCard}>
              <Text style={styles.amenityIcon}>📶</Text>
              <Text style={styles.amenityTitle}>High-speed WiFi</Text>
              <Text style={styles.amenityDesc}>Fiber connectivity included in the monthly rent.</Text>
            </View>
            <View style={styles.amenityCard}>
              <Text style={styles.amenityIcon}>❄</Text>
              <Text style={styles.amenityTitle}>Air Conditioned</Text>
              <Text style={styles.amenityDesc}>Individual inverter units for energy efficiency.</Text>
            </View>
          </View>

          {/* Map placeholder */}
          <View style={styles.mapPlaceholder}>
            <View style={styles.mapPin}><Text style={styles.mapPinText}>📍</Text></View>
            <Text style={styles.mapLabel}>View on Map</Text>
          </View>
        </View>
      </ScrollView>

      {room.status === 'available' && (
        <View style={styles.bottomBar}>
          <TouchableOpacity style={styles.reserveBtn} onPress={handleReserve}>
            <Text style={styles.reserveBtnText}>📱  Reserve This Room</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingTop: 52, paddingBottom: 12, backgroundColor: Colors.surface },
  backBtn: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceLow, justifyContent: 'center', alignItems: 'center' },
  backText: { fontSize: 20, color: Colors.onSurface },
  navTitle: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceContainer, justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { fontSize: 13, fontWeight: '700', color: Colors.primary },
  imgWrap: { height: 220, backgroundColor: Colors.surfaceContainer, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  imgEmoji: { fontSize: 64 },
  availBadge: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 12, paddingVertical: 5, borderRadius: Radius.full },
  availText: { fontSize: 13, fontWeight: '600' },
  body: { padding: Spacing.md },
  name: { fontSize: 22, fontWeight: '700', color: Colors.onSurface, marginBottom: 4 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  locationIcon: { fontSize: 13, marginRight: 4 },
  locationText: { fontSize: 13, color: Colors.onSurfaceVariant },
  detailsCard: { backgroundColor: Colors.surface, borderRadius: Radius.lg, borderWidth: 1, borderColor: Colors.outlineVariant, marginBottom: Spacing.md, ...Shadow.card },
  detailRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 14 },
  detailLeft: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  detailIcon: { fontSize: 18 },
  detailLabel: { fontSize: 15, color: Colors.onSurfaceVariant },
  detailValue: { fontSize: 15, fontWeight: '600', color: Colors.onSurface },
  detailDivider: { height: 1, backgroundColor: Colors.outlineVariant },
  amenityGrid: { flexDirection: 'row', gap: 10, marginBottom: Spacing.md },
  amenityCard: { flex: 1, backgroundColor: Colors.surfaceLow, borderRadius: Radius.lg, padding: 12 },
  amenityIcon: { fontSize: 22, marginBottom: 6 },
  amenityTitle: { fontSize: 13, fontWeight: '700', color: Colors.onSurface, marginBottom: 4 },
  amenityDesc: { fontSize: 12, color: Colors.onSurfaceVariant, lineHeight: 16 },
  mapPlaceholder: { height: 120, backgroundColor: '#1E3A5F', borderRadius: Radius.lg, justifyContent: 'center', alignItems: 'center', gap: 8 },
  mapPin: { width: 44, height: 44, backgroundColor: Colors.surface, borderRadius: 22, justifyContent: 'center', alignItems: 'center' },
  mapPinText: { fontSize: 22 },
  mapLabel: { fontSize: 14, color: '#fff', fontWeight: '600' },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.md, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.outlineVariant },
  reserveBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, height: 52, justifyContent: 'center', alignItems: 'center' },
  reserveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
