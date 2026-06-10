import { router } from 'expo-router';
import { useState } from 'react';
import { FlatList, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useAuth } from '@/providers/AuthProvider';
import { useAuthStore } from '@/store/auth.store';
import { useProperties } from '@/features/properties';
import { Colors, Radius, Shadow, Spacing } from '@/theme/design';

const SUGGESTIONS = ['Manila', 'Quezon City', 'Budget Friendly', 'Solo Rooms'];

export default function SearchScreen() {
  const [query, setQuery] = useState('');
  const { data } = useProperties();
  const { session } = useAuth();
  const role = useAuthStore((s) => s.role);

  function handleProfilePress() {
    if (!session) return router.push('/(auth)/login');
    if (role === 'owner') return router.push('/(owner)/profile');
    return router.push('/(occupant)/profile');
  }

  const results = query.trim().length < 2 ? [] :
    (data?.filter(p =>
      p.name.toLowerCase().includes(query.toLowerCase()) ||
      p.address.toLowerCase().includes(query.toLowerCase())
    ) ?? []);

  return (
    <View style={styles.root}>
      <View style={styles.nav}>
        <Text style={styles.navTitle}>BoardEase</Text>
        <View style={styles.avatar}><Text style={styles.avatarTxt}>B</Text></View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Search</Text>
        <Text style={styles.subtitle}>Find your perfect home or room in the Philippines.</Text>
        <View style={styles.searchBar}>
          <Text style={styles.searchIcon}>🔍</Text>
          <TextInput
            style={styles.input}
            placeholder="Location, price, or room type..."
            placeholderTextColor={Colors.outline}
            value={query}
            onChangeText={setQuery}
            autoFocus
          />
          <Text style={styles.filterIcon}>⊟</Text>
        </View>
      </View>

      {results.length > 0 ? (
        <FlatList
          data={results}
          keyExtractor={p => p.id}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.card} onPress={() => router.push(`/(public)/properties/${item.id}`)}>
              <View style={styles.imgWrap}><Text style={styles.imgEmoji}>🏠</Text></View>
              <View style={styles.cardBody}>
                <Text style={styles.cardName}>{item.name}</Text>
                <Text style={styles.cardAddress}>📍 {item.address}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ padding: Spacing.md, gap: 12 }}
        />
      ) : (
        <View style={styles.emptyWrap}>
          <View style={styles.emptyCircle}><Text style={styles.emptyIcon}>🔍</Text></View>
          <Text style={styles.emptyTitle}>Start Exploring</Text>
          <Text style={styles.emptySubtitle}>Type at least 2 characters to search</Text>
          <View style={styles.suggestions}>
            {SUGGESTIONS.map(s => (
              <TouchableOpacity key={s} style={styles.suggestionChip} onPress={() => setQuery(s)}>
                <Text style={styles.suggestionText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      )}

      <View style={styles.tabBar}>
        {[['🏠','Home'],['⊞','Properties'],['🔍','Search'],['👤','Profile']].map(([icon, label], i) => (
          <TouchableOpacity key={label} style={styles.tab} onPress={() => {
            if (label === 'Home') router.push('/(public)');
            if (label === 'Properties') router.push('/(public)/properties');
            if (label === 'Profile') handleProfilePress();
          }}>
            <Text style={[styles.tabIcon, i === 2 && styles.activeIcon]}>{icon}</Text>
            <Text style={[styles.tabLabel, i === 2 && styles.activeLabel]}>{label}</Text>
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
  title: { fontSize: 26, fontWeight: '700', color: Colors.onSurface, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.onSurfaceVariant, marginBottom: Spacing.md },
  searchBar: { flexDirection: 'row', alignItems: 'center', borderWidth: 2, borderColor: Colors.primary, borderRadius: Radius.full, paddingHorizontal: 14, height: 50, backgroundColor: Colors.surface },
  searchIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, fontSize: 15, color: Colors.onSurface },
  filterIcon: { fontSize: 18, color: Colors.outline },
  emptyWrap: { flex: 1, alignItems: 'center', justifyContent: 'center', paddingBottom: 80, paddingHorizontal: Spacing.md },
  emptyCircle: { width: 100, height: 100, borderRadius: 50, backgroundColor: Colors.surfaceLow, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  emptyIcon: { fontSize: 40 },
  emptyTitle: { fontSize: 20, fontWeight: '700', color: Colors.onSurface, marginBottom: 6 },
  emptySubtitle: { fontSize: 14, color: Colors.onSurfaceVariant, marginBottom: Spacing.lg },
  suggestions: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, justifyContent: 'center' },
  suggestionChip: { paddingHorizontal: 14, paddingVertical: 8, backgroundColor: Colors.secondaryContainer, borderRadius: Radius.full },
  suggestionText: { fontSize: 13, color: Colors.secondary, fontWeight: '600' },
  card: { flexDirection: 'row', backgroundColor: Colors.surface, borderRadius: Radius.lg, overflow: 'hidden', ...Shadow.card },
  imgWrap: { width: 80, height: 80, backgroundColor: Colors.surfaceContainer, justifyContent: 'center', alignItems: 'center' },
  imgEmoji: { fontSize: 32 },
  cardBody: { flex: 1, padding: 12, justifyContent: 'center' },
  cardName: { fontSize: 15, fontWeight: '600', color: Colors.onSurface, marginBottom: 4 },
  cardAddress: { fontSize: 13, color: Colors.onSurfaceVariant },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', backgroundColor: Colors.surface, borderTopWidth: 1, borderTopColor: Colors.outlineVariant, paddingBottom: 16, paddingTop: 8 },
  tab: { flex: 1, alignItems: 'center', gap: 2 },
  tabIcon: { fontSize: 22 },
  activeIcon: { color: Colors.primary },
  tabLabel: { fontSize: 11, color: Colors.outline },
  activeLabel: { color: Colors.primary, fontWeight: '600' },
});
