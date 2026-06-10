export const supabaseEnv = {
  url: process.env.EXPO_PUBLIC_SUPABASE_URL ?? '',
  anonKey: process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY ?? '',
};

export function validateSupabaseEnv() {
  const missing = Object.entries(supabaseEnv)
    .filter(([, value]) => !value)
    .map(([key]) => key);

  if (missing.length > 0) {
    throw new Error(`Missing Supabase env values: ${missing.join(', ')}`);
  }
}
