import { Session } from '@supabase/supabase-js';
import { createContext, PropsWithChildren, useContext, useEffect, useState } from 'react';

import { supabase } from '@/lib/supabase';
import { useAuthStore } from '@/store/auth.store';
import { useProfileStore } from '@/store/profile.store';
import type { UserRole } from '@/types';

type AuthContextValue = {
  session: Session | null;
  isLoading: boolean;
};

const AuthContext = createContext<AuthContextValue>({ session: null, isLoading: true });

export function useAuth() {
  return useContext(AuthContext);
}

async function loadProfile(userId: string) {
  const { data } = await supabase
    .from('profiles')
    .select('id, role, display_name, avatar_url')
    .eq('id', userId)
    .single();
  return data;
}

export function AuthProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const setAuth = useAuthStore((s) => s.setAuth);
  const clearAuth = useAuthStore((s) => s.clearAuth);
  const setProfile = useProfileStore((s) => s.setProfile);
  const clearProfile = useProfileStore((s) => s.clear);

  async function handleSession(s: Session | null) {
    setSession(s);
    if (s?.user) {
      const profile = await loadProfile(s.user.id);
      if (profile) {
        setAuth(s.user.id, profile.role as UserRole);
        setProfile({
          id: s.user.id,
          email: s.user.email ?? '',
          role: profile.role as UserRole,
          displayName: profile.display_name,
          avatarUrl: profile.avatar_url ?? undefined,
        });
      }
    } else {
      clearAuth();
      clearProfile();
    }
  }

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data }) => {
      await handleSession(data.session);
      setIsLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      handleSession(session);
    });

    return () => listener.subscription.unsubscribe();
  }, []);

  return <AuthContext.Provider value={{ isLoading, session }}>{children}</AuthContext.Provider>;
}

export default AuthProvider;
