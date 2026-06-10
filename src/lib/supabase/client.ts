import { createClient } from '@supabase/supabase-js';

import { supabaseEnv, validateSupabaseEnv } from './env';

validateSupabaseEnv();

export const supabase = createClient(supabaseEnv.url, supabaseEnv.anonKey);
