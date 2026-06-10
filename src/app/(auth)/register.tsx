import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useSignUp } from '@/features/auth';
import { Colors, Radius, Spacing } from '@/theme/design';

export default function RegisterScreen() {
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signUp, isPending } = useSignUp();

  function handleRegister() {
    if (!displayName || !email || !password) return Alert.alert('Error', 'Please fill in all fields.');
    signUp({ email, password, displayName }, {
      onSuccess: () => Alert.alert('Check your email', 'A confirmation link has been sent.', [
        { text: 'OK', onPress: () => router.replace('/(auth)/login') },
      ]),
      onError: (e) => Alert.alert('Registration failed', e.message),
    });
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <View style={styles.logoBox}><Text style={styles.logoIcon}>⊞</Text></View>
          <Text style={styles.title}>Create Account</Text>
          <Text style={styles.subtitle}>Occupant registration</Text>
        </View>

        <View style={styles.fields}>
          <View style={styles.field}>
            <Text style={styles.label}>Full name</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput style={styles.input} placeholder="Juan Dela Cruz" placeholderTextColor="#9CA3AF" value={displayName} onChangeText={setDisplayName} />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput style={styles.input} placeholder="email@example.com" placeholderTextColor="#9CA3AF" value={email} onChangeText={setEmail} autoCapitalize="none" keyboardType="email-address" />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput style={styles.input} placeholder="••••••••" placeholderTextColor="#9CA3AF" value={password} onChangeText={setPassword} secureTextEntry={!showPassword} />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <Text style={styles.terms}>
            By creating an account, you agree to our{' '}
            <Text style={styles.termsLink}>Terms of Service</Text>
            {' '}and{' '}
            <Text style={styles.termsLink}>Privacy Policy</Text>.
          </Text>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleRegister} disabled={isPending}>
            <Text style={styles.primaryBtnText}>{isPending ? 'Creating account…' : 'Register  →'}</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.footerLink}>Sign in</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, paddingHorizontal: Spacing.md, paddingTop: 48, paddingBottom: 32 },
  logoWrap: { alignItems: 'center', marginBottom: Spacing.xl },
  logoBox: { width: 64, height: 64, backgroundColor: Colors.primary, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  logoIcon: { fontSize: 28, color: '#fff' },
  title: { fontSize: 22, fontWeight: '700', color: Colors.onSurface },
  subtitle: { fontSize: 14, color: Colors.onSurfaceVariant, marginTop: 4 },
  fields: { gap: Spacing.md },
  field: { gap: 6 },
  label: { fontSize: 13, fontWeight: '600', color: Colors.onSurface },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: Radius.md, paddingHorizontal: 12, backgroundColor: Colors.surface },
  inputIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 15, color: Colors.onSurface },
  eyeIcon: { fontSize: 18, paddingLeft: 8 },
  terms: { fontSize: 13, color: Colors.onSurfaceVariant, textAlign: 'center', lineHeight: 20 },
  termsLink: { color: Colors.primary, fontWeight: '600' },
  primaryBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, height: 52, justifyContent: 'center', alignItems: 'center', marginTop: 4 },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  footer: { flexDirection: 'row', justifyContent: 'center', marginTop: Spacing.xl },
  footerText: { fontSize: 14, color: Colors.onSurfaceVariant },
  footerLink: { fontSize: 14, color: Colors.primary, fontWeight: '700' },
});
