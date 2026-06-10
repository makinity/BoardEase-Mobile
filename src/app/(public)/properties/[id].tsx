import { router, useLocalSearchParams } from 'expo-router';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { EmptyState, LoadingState } from '@/components/layout';
import { useProperty } from '@/features/properties';
import { useRoomsByProperty } from '@/features/rooms';
import { useAuth } from '@/providers/AuthProvider';
import { Colors, Radius, Shadow, Spacing, StatusColors } from '@/theme/design';

export default function PropertyDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { data: property, isLoading } = useProperty(id);
  const { data: rooms, isLoading: loadingRooms } = useRoomsByProperty(id);
  const { session } = useAuth();

  const minRate = rooms?.filter(r => r.status === 'available').reduce((min, r) => Math.min(min, r.monthlyRate), Infinity);
  const hasAvailable = rooms?.some(r => r.status === 'available');

  function handleReserve() {
    if (!session) return router.push('/(auth)/login');
    const room = rooms?.find(r => r.status === 'available');
    router.push(`/(occupant)/reservations/create?roomId=${room?.id}&propertyId=${id}`);
  }

  if (isLoading) return <LoadingState />;
  if (!property) return <EmptyState title="Property not found" />;

  return (
    <View style={styles.root}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.imgWrap}>
          <Text style={styles.imgEmoji}>🏢</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backText}>‹ Back</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.body}>
          <Text style={styles.name}>{property.name}</Text>
          <View style={styles.locationRow}>
            <Text style={styles.locationIcon}>📍</Text>
            <Text style={styles.locationText}>{property.address}</Text>
          </View>
          <View style={styles.tags}>
            <View style={styles.tag}><Text style={styles.tagText}>📶 High-speed WiFi</Text></View>
            <View style={styles.tag}><Text style={styles.tagText}>🛡 24/7 Security</Text></View>
          </View>

          <View style={styles.divider} />

          <View style={styles.sectionRow}>
            <Text style={styles.sectionTitle}>Rooms ({rooms?.length ?? 0})</Text>
            <Text style={styles.viewMap}>View Map</Text>
          </View>

          {loadingRooms ? <LoadingState /> : rooms?.map(room => {
            const sc = StatusColors[room.status] ?? StatusColors.available;
            return (
              <TouchableOpacity key={room.id} style={styles.roomCard} onPress={() => router.push(`/(public)/rooms/${room.id}`)}>
                <View style={styles.roomImg}><Text style={styles.roomImgText}>🛏</Text></View>
                <View style={styles.roomInfo}>
                  <View style={styles.roomNameRow}>
                    <Text style={styles.roomName}>{room.name}</Text>
                    <View style={[styles.statusChip, { backgroundColor: sc.bg }]}>
                      <Text style={[styles.statusText, { color: sc.text }]}>{room.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.roomDesc}>Single Occupancy • 2nd Floor</Text>
                  <Text style={[styles.roomPrice, room.status === 'occupied' && styles.strikethrough]}>
                    ₱{(room.monthlyRate / 100).toLocaleString()} / month
                  </Text>
                </View>
              </TouchableOpacity>
            );
          })}

          <View style={styles.divider} />
          <Text style={styles.sectionTitle}>About this property</Text>
          <Text style={styles.about}>
            {property.name} offers comfortable living spaces for students and young professionals. Located in {property.address}.
          </Text>
        </View>
      </ScrollView>

      {hasAvailable && (
        <View style={styles.bottomBar}>
          <View>
            <Text style={styles.startingFrom}>STARTING FROM</Text>
            <Text style={styles.startingPrice}>₱{minRate !== Infinity ? (minRate / 100).toLocaleString() : '—'} /mo</Text>
          </View>
          <TouchableOpacity style={styles.reserveBtn} onPress={handleReserve}>
            <Text style={styles.reserveBtnText}>Reserve a Room</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  scroll: { paddingBottom: 100 },
  imgWrap: { height: 240, backgroundColor: Colors.surfaceContainer, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  imgEmoji: { fontSize: 64 },
  backBtn: { position: 'absolute', top: 52, left: 16, backgroundColor: 'rgba(255,255,255,0.9)', paddingHorizontal: 12, paddingVertical: 6, borderRadius: Radius.full },
  backText: { fontSize: 14, fontWeight: '600', color: Colors.onSurface },
  body: { padding: Spacing.md },
  name: { fontSize: 22, fontWeight: '700', color: Colors.onSurface, marginBottom: 6 },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 10 },
  locationIcon: { fontSize: 13, marginRight: 4 },
  locationText: { fontSize: 13, color: Colors.onSurfaceVariant },
  tags: { flexDirection: 'row', gap: 8, marginBottom: Spacing.md },
  tag: { paddingHorizontal: 10, paddingVertical: 5, backgroundColor: Colors.surfaceLow, borderRadius: Radius.full },
  tagText: { fontSize: 12, color: Colors.onSurfaceVariant },
  divider: { height: 1, backgroundColor: Colors.outlineVariant, marginVertical: Spacing.md },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.onSurface },
  viewMap: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  roomCard: { flexDirection: 'row', borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: Radius.lg, marginBottom: 10, overflow: 'hidden', backgroundColor: Colors.surface },
  roomImg: { width: 80, backgroundColor: Colors.surfaceContainer, justifyContent: 'center', alignItems: 'center' },
  roomImgText: { fontSize: 28 },
  roomInfo: { flex: 1, padding: 12 },
  roomNameRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 2 },
  roomName: { fontSize: 15, fontWeight: '600', color: Colors.onSurface },
  statusChip: { paddingHorizontal: 8, paddingVertical: 3, borderRadius: Radius.full },
  statusText: { fontSize: 11, fontWeight: '600' },
  roomDesc: { fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: 4 },
  roomPrice: { fontSize: 16, fontWeight: '700', color: Colors.primary },
  strikethrough: { textDecorationLine: 'line-through', color: Colors.outline },
  about: { fontSize: 14, color: Colors.onSurfaceVariant, lineHeight: 22 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: Spacing.md, backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.outlineVariant },
  startingFrom: { fontSize: 10, color: Colors.outline, fontWeight: '600', letterSpacing: 0.5 },
  startingPrice: { fontSize: 16, fontWeight: '700', color: Colors.onSurface },
  reserveBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, paddingHorizontal: 24, paddingVertical: 14 },
  reserveBtnText: { color: '#fff', fontWeight: '700', fontSize: 15 },
});
