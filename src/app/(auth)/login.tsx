import { router } from 'expo-router';
import { useState } from 'react';
import {
  Alert, KeyboardAvoidingView, Platform, ScrollView,
  StyleSheet, Text, TextInput, TouchableOpacity, View,
} from 'react-native';

import { useSignIn } from '@/features/auth';
import { Colors, Radius, Spacing } from '@/theme/design';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: signIn, isPending } = useSignIn();

  function handleLogin() {
    if (!email || !password) return Alert.alert('Error', 'Please fill in all fields.');
    signIn({ email, password }, {
      onSuccess: () => router.replace('/'),
      onError: (e) => Alert.alert('Sign in failed', e.message),
    });
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        {/* Logo */}
        <View style={styles.logoWrap}>
          <View style={styles.logoBox}>
            <Text style={styles.logoIcon}>⊞</Text>
          </View>
          <Text style={styles.appName}>BoardEase</Text>
          <Text style={styles.appSubtitle}>Sign in to your account</Text>
        </View>

        {/* Form card */}
        <View style={styles.card}>
          <View style={styles.field}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                style={styles.input}
                placeholder="your@email.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <View style={styles.field}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="••••••••"
                placeholderTextColor="#9CA3AF"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? '🙈' : '👁'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity onPress={() => router.push('/(auth)/forgot-password')} style={styles.forgotWrap}>
            <Text style={styles.forgotText}>Forgot password?</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleLogin} disabled={isPending}>
            <Text style={styles.primaryBtnText}>{isPending ? 'Signing in…' : 'Sign In  →'}</Text>
          </TouchableOpacity>

          <View style={styles.dividerRow}>
            <View style={styles.divider} />
            <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.socialRow}>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialText}>⊙  Google</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialBtn}>
              <Text style={styles.socialText}>⊞  Apple</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Don't have an account? </Text>
          <TouchableOpacity onPress={() => router.push('/(auth)/register')}>
            <Text style={styles.footerLink}>Register</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.legal}>
          <Text style={styles.legalText}>Privacy Policy  •  Terms of Service</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, paddingHorizontal: Spacing.md, paddingTop: 60, paddingBottom: 32, alignItems: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: Spacing.xl },
  logoBox: { width: 72, height: 72, backgroundColor: Colors.primary, borderRadius: 18, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  logoIcon: { fontSize: 32, color: '#fff' },
  appName: { fontSize: 32, fontWeight: '700', color: Colors.primary, letterSpacing: -0.5 },
  appSubtitle: { fontSize: 15, color: Colors.onSurfaceVariant, marginTop: 4 },
  card: { width: '100%', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.outlineVariant, shadowColor: '#011D35', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  field: { marginBottom: Spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: Colors.onSurface, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: Radius.md, paddingHorizontal: 12, backgroundColor: Colors.background },
  inputIcon: { fontSize: 16, marginRight: 8, color: Colors.outline },
  input: { flex: 1, height: 48, fontSize: 15, color: Colors.onSurface },
  eyeIcon: { fontSize: 18, paddingLeft: 8 },
  forgotWrap: { alignItems: 'flex-end', marginBottom: Spacing.md },
  forgotText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  primaryBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, height: 52, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  dividerRow: { flexDirection: 'row', alignItems: 'center', marginBottom: Spacing.md },
  divider: { flex: 1, height: 1, backgroundColor: Colors.outlineVariant },
  dividerText: { fontSize: 11, color: Colors.outline, marginHorizontal: 8, fontWeight: '600', letterSpacing: 0.5 },
  socialRow: { flexDirection: 'row', gap: 10 },
  socialBtn: { flex: 1, height: 48, borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: Radius.md, justifyContent: 'center', alignItems: 'center' },
  socialText: { fontSize: 14, fontWeight: '600', color: Colors.onSurface },
  footer: { flexDirection: 'row', alignItems: 'center', marginTop: Spacing.lg },
  footerText: { fontSize: 14, color: Colors.onSurfaceVariant },
  footerLink: { fontSize: 15, color: Colors.primary, fontWeight: '700' },
  legal: { marginTop: 12 },
  legalText: { fontSize: 12, color: Colors.outline },
});
