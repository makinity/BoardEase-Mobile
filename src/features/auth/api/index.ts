import { supabase } from '@/lib/supabase';

import type { AuthCredentials, RegisterInput } from '../types';

export function signIn({ email, password }: AuthCredentials) {
  return supabase.auth.signInWithPassword({ email, password });
}

export function signUp({ email, password, displayName }: RegisterInput) {
  return supabase.auth.signUp({
    email,
    password,
    options: { data: { displayName } },
  });
}

export function signOut() {
  return supabase.auth.signOut();
}

export function getSession() {
  return supabase.auth.getSession();
}

export function resetPassword(email: string) {
  return supabase.auth.resetPasswordForEmail(email);
}

export function updatePassword(password: string) {
  return supabase.auth.updateUser({ password });
}
