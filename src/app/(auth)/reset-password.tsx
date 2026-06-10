import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useResetPassword } from '@/features/auth';
import { Colors, Radius, Spacing } from '@/theme/design';

export default function ResetPasswordScreen() {
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const { mutate: resetPassword, isPending } = useResetPassword();

  const strength = password.length === 0 ? 0 : password.length < 6 ? 1 : password.length < 10 ? 2 : password.length < 14 ? 3 : 4;

  function handleSubmit() {
    if (!password || !confirm) return Alert.alert('Error', 'Please fill in all fields.');
    if (password !== confirm) return Alert.alert('Error', 'Passwords do not match.');
    if (password.length < 6) return Alert.alert('Error', 'Password must be at least 6 characters.');
    resetPassword(password, {
      onSuccess: () => Alert.alert('Password updated', 'You can now sign in.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]),
      onError: (e) => Alert.alert('Error', e.message),
    });
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.title}>New Password</Text>
        <Text style={styles.subtitle}>Please create a secure password that you haven't used before.</Text>
        <View style={styles.field}>
          <Text style={styles.label}>New password</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput style={styles.input} placeholder="Enter your new password" placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry={!showPw} />
            <TouchableOpacity onPress={() => setShowPw(!showPw)}><Text style={styles.eye}>{showPw ? '🙈' : '👁'}</Text></TouchableOpacity>
          </View>
        </View>
        <View style={styles.field}>
          <Text style={styles.label}>Confirm password</Text>
          <View style={styles.inputRow}>
            <Text style={styles.inputIcon}>🔒</Text>
            <TextInput style={styles.input} placeholder="Confirm your new password" placeholderTextColor="#9CA3AF" value={confirm} onChangeText={setConfirm} secureTextEntry={!showConfirm} />
            <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}><Text style={styles.eye}>{showConfirm ? '🙈' : '👁'}</Text></TouchableOpacity>
          </View>
        </View>
        <View style={styles.strengthRow}>
          {[1,2,3,4].map(i => <View key={i} style={[styles.bar, { backgroundColor: i <= strength ? Colors.primary : Colors.outlineVariant }]} />)}
        </View>
        <Text style={styles.hint}>Strong passwords contain at least 8 characters including letters and numbers.</Text>
        <View style={styles.secureCard}>
          <Text style={styles.secureIcon}>🛡</Text>
          <View style={{ flex: 1 }}>
            <Text style={styles.secureTitle}>Secure Session</Text>
            <Text style={styles.secureDesc}>Changing your password will log you out of all other active devices.</Text>
          </View>
        </View>
      </ScrollView>
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.btn} onPress={handleSubmit} disabled={isPending}>
          <Text style={styles.btnText}>{isPending ? 'Updating…' : 'Update Password  ✓'}</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, padding: Spacing.md, paddingTop: 48, paddingBottom: 120 },
  backBtn: { width: 40, height: 40, borderRadius: Radius.full, backgroundColor: Colors.surfaceLow, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.lg },
  backText: { fontSize: 18, color: Colors.onSurface },
  title: { fontSize: 26, fontWeight: '700', color: Colors.onSurface, marginBottom: 8 },
  subtitle: { fontSize: 14, color: Colors.onSurfaceVariant, marginBottom: Spacing.lg, lineHeight: 20 },
  field: { marginBottom: Spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: Colors.onSurface, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: Radius.md, paddingHorizontal: 12, backgroundColor: Colors.surface },
  inputIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 15, color: Colors.onSurface },
  eye: { fontSize: 18, paddingLeft: 8 },
  strengthRow: { flexDirection: 'row', gap: 6, marginBottom: 8 },
  bar: { flex: 1, height: 4, borderRadius: 2 },
  hint: { fontSize: 12, color: Colors.onSurfaceVariant, marginBottom: Spacing.lg },
  secureCard: { flexDirection: 'row', backgroundColor: Colors.surfaceLow, borderRadius: Radius.lg, padding: Spacing.md, alignItems: 'center', gap: Spacing.md },
  secureIcon: { fontSize: 24 },
  secureTitle: { fontSize: 14, fontWeight: '600', color: Colors.onSurface },
  secureDesc: { fontSize: 12, color: Colors.onSurfaceVariant, marginTop: 2 },
  bottomBar: { position: 'absolute', bottom: 0, left: 0, right: 0, padding: Spacing.md, backgroundColor: Colors.background, borderTopWidth: 1, borderTopColor: Colors.outlineVariant },
  btn: { backgroundColor: Colors.primary, borderRadius: Radius.md, height: 52, justifyContent: 'center', alignItems: 'center' },
  btnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
