import { router } from 'expo-router';
import { FlatList, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { EmptyState, LoadingState } from '@/components/layout';
import { useAuth } from '@/providers/AuthProvider';
import { useAuthStore } from '@/store/auth.store';
import { useProperties } from '@/features/properties';
import { Colors, Radius, Shadow, Spacing } from '@/theme/design';

export default function PropertiesScreen() {
  const { data, isLoading, isError, refetch } = useProperties();
  const { session } = useAuth();
  const role = useAuthStore((s) => s.role);

  function handleProfilePress() {
    if (!session) return router.push('/(auth)/login');
    if (role === 'owner') return router.push('/(owner)/profile');
    return router.push('/(occupant)/profile');
  }

  return (
    <View style={styles.root}>
      <View style={styles.nav}>
        <Text style={styles.navTitle}>BoardEase</Text>
        <View style={styles.avatar}><Text style={styles.avatarTxt}>B</Text></View>
      </View>
      <FlatList
        data={data ?? []}
        keyExtractor={p => p.id}
        ListHeaderComponent={
          <View style={styles.header}>
            <Text style={styles.title}>Properties</Text>
            <TouchableOpacity style={styles.searchBar} onPress={() => router.push('/(public)/search')}>
              <Text style={styles.searchIcon}>🔍</Text>
              <Text style={styles.searchPlaceholder}>Search properties, areas, or prices...</Text>
              <Text style={styles.filterIcon}>⊟</Text>
            </TouchableOpacity>
            {isLoading && <LoadingState />}
            {isError && <EmptyState title="Couldn't load properties" onRetry={refetch} />}
          </View>
        }
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.card} onPress={() => router.push(`/(public)/properties/${item.id}`)}>
            <View style={styles.imgWrap}>
              <Text style={styles.imgEmoji}>🏠</Text>
              <View style={styles.availBadge}><Text style={styles.availText}>✓ Available</Text></View>
            </View>
            <View style={styles.cardBody}>
              <View style={styles.cardRow}>
                <Text style={styles.cardName}>{item.name}</Text>
              </View>
              <View style={styles.locationRow}>
                <Text style={styles.locationIcon}>📍</Text>
                <Text style={styles.locationText}>{item.address}</Text>
              </View>
              <View style={styles.amenities}>
                <Text style={styles.amenity}>🛏 2 Beds</Text>
                <Text style={styles.amenity}>📶 Free WiFi</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.list}
      />
      <View style={styles.tabBar}>
        {[['🏠','Home'],['⊞','Properties'],['🔍','Search'],['👤','Profile']].map(([icon, label], i) => (
          <TouchableOpacity key={label} style={styles.tab} onPress={() => {
            if (label === 'Home') router.push('/(public)');
            if (label === 'Search') router.push('/(public)/search');
            if (label === 'Profile') handleProfilePress();
          }}>
            <Text style={[styles.tabIcon, i === 1 && styles.activeIcon]}>{icon}</Text>
            <Text style={[styles.tabLabel, i === 1 && styles.activeLabel]}>{label}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  nav: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: Spacing.md, paddingTop: 52, paddingBottom: 12, backgroundColor: Colors.surface, borderBottomWidth: 1, borderBottomColor: Colors.outlineVariant },
  navTitle: { fontSize: 18, fontWeight: '700', color: Colors.primary },
  avatar: { width: 36, height: 36, borderRadius: 18, backgroundColor: Colors.surfaceContainer, justifyContent: 'center', alignItems: 'center' },
  avatarTxt: { fontSize: 14, fontWeight: '700', color: Colors.primary },
  header: { padding: Spacing.md },
  title: { fontSize: 26, fontWeight: '700', color: Colors.onSurface, marginBottom: Spacing.md },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: Radius.full, paddingHorizontal: 14, height: 46, backgroundColor: Colors.surface },
  searchIcon: { fontSize: 16, marginRight: 8 },
  searchPlaceholder: { flex: 1, fontSize: 13, color: Colors.outline },
  filterIcon: { fontSize: 18, color: Colors.outline },
  list: { paddingBottom: 80 },
  card: { marginHorizontal: Spacing.md, marginBottom: 16, backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.card },
  imgWrap: { height: 180, backgroundColor: Colors.surfaceContainer, justifyContent: 'center', alignItems: 'center', position: 'relative' },
  imgEmoji: { fontSize: 48 },
  availBadge: { position: 'absolute', top: 12, right: 12, backgroundColor: '#16A34A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: Radius.full },
  availText: { color: '#fff', fontSize: 12, fontWeight: '600' },
  cardBody: { padding: Spacing.md },
  cardRow: { marginBottom: 4 },
  cardName: { fontSize: 16, fontWeight: '700', color: Colors.onSurface },
  locationRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 8 },
  locationIcon: { fontSize: 12, marginRight: 4 },
  locationText: { fontSize: 13, color: Colors.onSurfaceVariant },
  amenities: { flexDirection: 'row', gap: 10 },
  amenity: { fontSize: 12, color: Colors.onSurfaceVariant },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.outlineVariant, paddingBottom: 16, paddingTop: 8 },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  tabIcon: { fontSize: 22 },
  activeIcon: { color: Colors.primary },
  tabLabel: { fontSize: 11, color: Colors.outline },
  activeLabel: { color: Colors.primary, fontWeight: '600' },
});
