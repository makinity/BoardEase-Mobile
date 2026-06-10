import { router } from 'expo-router';
import { FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { EmptyState, LoadingState } from '@/components/layout';
import { useAuth } from '@/providers/AuthProvider';
import { useAuthStore } from '@/store/auth.store';
import { useProperties } from '@/features/properties';
import { Colors, Radius, Shadow, Spacing } from '@/theme/design';

export default function LandingScreen() {
  const { data, isLoading, isError, refetch, error } = useProperties();
  const { session } = useAuth();
  const role = useAuthStore((s) => s.role);

  function handleProfilePress() {
    if (!session) return router.push('/(auth)/login');
    if (role === 'owner') return router.push('/(owner)/profile');
    return router.push('/(occupant)/profile');
  }

  return (
    <View style={styles.root}>
      {/* Top nav */}
      <View style={styles.nav}>
        <Text style={styles.navTitle}>BoardEase</Text>
        <View style={styles.avatar}><Text style={styles.avatarText}>B</Text></View>
      </View>

      <FlatList
        data={data ?? []}
        keyExtractor={(p) => p.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.headline}>Find your next boarding house</Text>
            <Text style={styles.subheadline}>Affordable and comfortable living spaces for students and professionals in Davao City.</Text>
            <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/(public)/search')}>
              <Text style={styles.searchIcon}>🔍</Text>
              <Text style={styles.searchPlaceholder}>Search boarding houses...</Text>
              <View style={styles.filterBtn}><Text style={styles.filterIcon}>⊟</Text></View>
            </TouchableOpacity>
            <View style={styles.chips}>
              {['All Units', 'Student Housing', 'Work Lodging'].map((c, i) => (
                <View key={c} style={[styles.chip, i === 0 && styles.chipActive]}>
                  <Text style={[styles.chipText, i === 0 && styles.chipTextActive]}>{c}</Text>
                </View>
              ))}
            </View>
            <View style={styles.sectionRow}>
              <Text style={styles.sectionTitle}>Featured Properties</Text>
              <TouchableOpacity onPress={() => router.push('/(public)/properties')}>
                <Text style={styles.seeAll}>See all</Text>
              </TouchableOpacity>
            </View>
            {isLoading && <LoadingState />}
            {isError && <EmptyState title={(error as Error)?.message ?? "Couldn't load properties"} onRetry={refetch} />}
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/(public)/properties/${item.id}`)}>
            <View style={styles.imgWrap}>
              <View style={styles.imgPlaceholder}><Text style={styles.imgPlaceholderText}>🏠</Text></View>
              <View style={[styles.badge, { backgroundColor: '#16A34A' }]}>
                <Text style={styles.badgeText}>Available</Text>
              </View>
              <View style={styles.priceBadge}>
                <Text style={styles.priceText}>₱{(item.monthlyRate ?? 450000 / 100).toLocaleString()}/mo</Text>
              </View>
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardName}>{item.name}</Text>
              <View style={styles.cardLocation}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>{item.address}</Text>
              </View>
              <View style={styles.amenities}>
                <Text style={styles.amenity}>📶 Free Wi-Fi</Text>
                <Text style={styles.amenity}>🍽 Shared Pantry</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        ListFooterComponent={
          <TouchableOpacity style={styles.ctaBanner} onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.ctaIcon}>⊞</Text>
            <Text style={styles.ctaTitle}>Own a Property?</Text>
            <Text style={styles.ctaSubtitle}>List your rooms and manage tenants effortlessly with BoardEase.</Text>
            <View style={styles.ctaBtn}><Text style={styles.ctaBtnText}>Get Started</Text></View>
          </TouchableOpacity>
        }
        contentContainerStyle={styles.list}
      />

      {/* Bottom tabs */}
      <View style={styles.tabBar}>
        {[['🏠', 'Home'], ['⊞', 'Properties'], ['🔍', 'Search'], ['👤', 'Profile']].map(([icon, label], i) => (
          <TouchableOpacity key={label} style={styles.tab} onPress={() => {
            if (label === 'Properties') router.push('/(public)/properties');
            if (label === 'Search') router.push('/(public)/search');
            if (label === 'Profile') handleProfilePress();
          }}>
            <Text style={[styles.tabIcon, i === 0 && styles.tabIconActive]}>{icon}</Text>
            <Text style={[styles.tabLabel, i === 0 && styles.tabLabelActive]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingTop: 52, paddingBottom: 12, backgroundColor: Colors.background },
  navTitle: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceContainer, justifyContent: 'center', alignItems: 'center' },
  avatarText: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  list: { paddingBottom: 80 },
  header: { padding: Spacing.md },
  headline: { fontSize: 26, fontWeight: '700', color: Colors.onSurface, marginBottom: 6, lineHeight: 32 },
  subheadline: { fontSize: 14, color: Colors.onSurfaceVariant, marginBottom: Spacing.md, lineHeight: 20 },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.surface, borderRadius: Radius.full, borderWidth: 1, borderColor: Colors.outlineVariant, paddingHorizontal: 14, height: 48, marginBottom: Spacing.md },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchPlaceholder: { flex: 1, fontSize: 14, color: Colors.outline },
  filterBtn: { width: 32, height: 32, backgroundColor: Colors.primary, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  filterIcon: { fontSize: 16, color: '#fff' },
  chips: { flexDirection: 'row', gap: 8, marginBottom: Spacing.lg },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: Radius.full, backgroundColor: Colors.surfaceContainer },
  chipActive: { backgroundColor: Colors.primary },
  chipText: { fontSize: 13, color: Colors.onSurfaceVariant, fontWeight: '500' },
  chipTextActive: { color: '#fff', fontWeight: '600' },
  sectionRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.onSurface },
  seeAll: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  card: { marginHorizontal: Spacing.md, marginBottom: 16, backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.card },
  imgWrap: { height: 180, backgroundColor: Colors.surfaceContainer, position: 'relative', justifyContent: 'center', alignItems: 'center' },
  imgPlaceholder: { justifyContent: 'center', alignItems: 'center' },
  imgPlaceholderText: { fontSize: 48 },
  badge: { position: 'absolute', top: 12, right: 12, paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  badgeText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  priceBadge: { position: 'absolute', bottom: 12, left: 12, backgroundColor: 'rgba(0,0,0,0.6)', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.md },
  priceText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  cardBody: { padding: Spacing.md },
  cardName: { fontSize: 17, fontWeight: '700', color: Colors.onSurface, marginBottom: 4 },
  cardLocation: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locationIcon: { fontSize: 12, marginRight: 4 },
  locationText: { fontSize: 13, color: Colors.onSurfaceVariant },
  amenities: { flexDirection: 'row', gap: 12, borderTopWidth: 1, borderTopColor: Colors.outlineVariant, paddingTop: 8, marginTop: 4 },
  amenity: { fontSize: 12, color: Colors.onSurfaceVariant },
  ctaBanner: { margin: Spacing.md, backgroundColor: Colors.primary, borderRadius: Radius.xl, padding: Spacing.lg, alignItems: 'center', gap: 8 },
  ctaIcon: { fontSize: 32, color: '#fff' },
  ctaTitle: { fontSize: 18, fontWeight: '700', color: '#fff' },
  ctaSubtitle: { fontSize: 13, color: 'rgba(255,255,255,0.85)', textAlign: 'center', lineHeight: 18 },
  ctaBtn: { marginTop: 4, backgroundColor: '#fff', borderRadius: Radius.full, paddingHorizontal: 24, paddingVertical: 10 },
  ctaBtnText: { color: Colors.primary, fontWeight: '700', fontSize: 15 },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.outlineVariant, paddingBottom: 16, paddingTop: 8 },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  tabIcon: { fontSize: 22 },
  tabIconActive: { color: Colors.primary },
  tabLabel: { fontSize: 11, color: Colors.outline },
  tabLabelActive: { color: Colors.primary, fontWeight: '600' },
});
