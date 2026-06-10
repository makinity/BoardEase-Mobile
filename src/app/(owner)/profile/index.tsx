import { router } from 'expo-router';
import { Alert, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import { Screen } from '@/components/layout';
import { useSignOut } from '@/features/auth';
import { useAuthStore } from '@/store/auth.store';
import { useProfileStore } from '@/store/profile.store';

export default function OwnerProfileScreen() {
  const profile = useProfileStore((s) => s.profile);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const clearProfile = useProfileStore((s) => s.clear);
  const { mutate: signOut, isPending } = useSignOut();

  function handleSignOut() {
    Alert.alert('Sign Out', 'Are you sure you want to sign out?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Sign Out', style: 'destructive', onPress: () =>
          signOut(undefined, {
            onSuccess: () => { clearAuth(); clearProfile(); router.replace('/(auth)/login'); },
          }),
      },
    ]);
  }

  const initials = profile?.displayName?.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2) ?? 'O';

  return (
    <Screen title="Profile">
      <View style={styles.avatarWrap}>
        <View style={styles.avatar}><Text style={styles.avatarText}>{initials}</Text></View>
        <Text style={styles.name}>{profile?.displayName ?? '—'}</Text>
        <Text style={styles.email}>{profile?.email ?? '—'}</Text>
        <View style={styles.roleBadge}><Text style={styles.roleText}>Owner</Text></View>
      </View>

      <View style={styles.divider} />

      <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut} disabled={isPending}>
        <Text style={styles.signOutText}>{isPending ? 'Signing out…' : '→  Sign Out'}</Text>
      </TouchableOpacity>
    </Screen>
  );
}

const styles = StyleSheet.create({
  avatarWrap: { alignItems: 'center', paddingVertical: 24, gap: 6 },
  avatar: { width: 72, height: 72, borderRadius: 36, backgroundColor: '#DBEAFE', justifyContent: 'center', alignItems: 'center', marginBottom: 4 },
  avatarText: { fontSize: 26, fontWeight: '700', color: '#1D4ED8' },
  name: { fontSize: 20, fontWeight: '700', color: '#102A43' },
  email: { fontSize: 14, color: '#627D98' },
  roleBadge: { marginTop: 4, paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#EEF4FF', borderRadius: 999 },
  roleText: { fontSize: 12, fontWeight: '600', color: '#1D4ED8' },
  divider: { height: 1, backgroundColor: '#E2E8F0', marginVertical: 8 },
  signOutBtn: { padding: 16, alignItems: 'center', borderWidth: 1, borderColor: '#FCA5A5', borderRadius: 10, backgroundColor: '#FEF2F2' },
  signOutText: { color: '#DC2626', fontSize: 15, fontWeight: '600' },
});
