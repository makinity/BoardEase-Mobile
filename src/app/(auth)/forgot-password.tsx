import { router } from 'expo-router';
import { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';

import { useForgotPassword } from '@/features/auth';
import { Colors, Radius, Spacing } from '@/theme/design';

export default function ForgotPasswordScreen() {
  const [email, setEmail] = useState('');
  const { mutate: forgotPassword, isPending } = useForgotPassword();

  function handleSubmit() {
    if (!email) return Alert.alert('Error', 'Please enter your email.');
    forgotPassword(email, {
      onSuccess: () => Alert.alert('Email sent', 'Check your inbox for a password reset link.', [
        { text: 'OK', onPress: () => router.back() },
      ]),
      onError: (e) => Alert.alert('Error', e.message),
    });
  }

  return (
    <KeyboardAvoidingView style={styles.root} behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
      <ScrollView contentContainerStyle={styles.container} keyboardShouldPersistTaps="handled">
        <View style={styles.logoWrap}>
          <View style={styles.logoBox}><Text style={styles.logoIcon}>⊞</Text></View>
          <Text style={styles.appName}>BoardEase</Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.title}>Reset Password</Text>
          <Text style={styles.subtitle}>Enter your email to receive a reset link.</Text>

          <View style={styles.field}>
            <Text style={styles.label}>Email Address</Text>
            <View style={styles.inputRow}>
              <Text style={styles.inputIcon}>✉</Text>
              <TextInput
                style={styles.input}
                placeholder="name@example.com"
                placeholderTextColor="#9CA3AF"
                value={email}
                onChangeText={setEmail}
                autoCapitalize="none"
                keyboardType="email-address"
              />
            </View>
          </View>

          <TouchableOpacity style={styles.primaryBtn} onPress={handleSubmit} disabled={isPending}>
            <Text style={styles.primaryBtnText}>{isPending ? 'Sending…' : 'Send Reset Link  →'}</Text>
          </TouchableOpacity>

          <TouchableOpacity onPress={() => router.back()} style={styles.backWrap}>
            <Text style={styles.backText}>← Back to login</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.secureNote}>
          Secured by BoardEase Identity Services. If you don't receive an email within 5 minutes, please check your spam folder.
        </Text>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: Colors.background },
  container: { flexGrow: 1, paddingHorizontal: Spacing.md, paddingTop: 60, paddingBottom: 32, alignItems: 'center' },
  logoWrap: { alignItems: 'center', marginBottom: Spacing.xl },
  logoBox: { width: 64, height: 64, backgroundColor: Colors.primary, borderRadius: 16, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  logoIcon: { fontSize: 28, color: '#fff' },
  appName: { fontSize: 26, fontWeight: '700', color: Colors.primary },
  card: { width: '100%', backgroundColor: Colors.surface, borderRadius: Radius.lg, padding: Spacing.lg, borderWidth: 1, borderColor: Colors.outlineVariant, shadowColor: '#011D35', shadowOpacity: 0.08, shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2 },
  title: { fontSize: 20, fontWeight: '700', color: Colors.onSurface, marginBottom: 4 },
  subtitle: { fontSize: 14, color: Colors.onSurfaceVariant, marginBottom: Spacing.lg },
  field: { marginBottom: Spacing.md },
  label: { fontSize: 13, fontWeight: '600', color: Colors.onSurface, marginBottom: 6 },
  inputRow: { flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: Colors.outlineVariant, borderRadius: Radius.md, paddingHorizontal: 12, backgroundColor: Colors.background },
  inputIcon: { fontSize: 16, marginRight: 8 },
  input: { flex: 1, height: 48, fontSize: 15, color: Colors.onSurface },
  primaryBtn: { backgroundColor: Colors.primary, borderRadius: Radius.md, height: 52, justifyContent: 'center', alignItems: 'center', marginBottom: Spacing.md },
  primaryBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  backWrap: { alignItems: 'center', paddingVertical: 4 },
  backText: { fontSize: 14, color: Colors.primary, fontWeight: '600' },
  secureNote: { fontSize: 12, color: Colors.outline, textAlign: 'center', marginTop: Spacing.lg, paddingHorizontal: Spacing.sm },
});
