import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

import { supabaseEnv, validateSupabaseEnv } from './env';

validateSupabaseEnv();

export const supabase = createClient(supabaseEnv.url, supabaseEnv.anonKey, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
