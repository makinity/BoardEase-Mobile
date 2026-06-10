// Auto-generate this file by running:
// npx supabase gen types typescript --project-id <your-project-ref> > src/types/database.ts

export type Json = string | number | boolean | null | { [key: string]: Json } | Json[];

export type Database = {
  public: {
    Tables: Record<string, never>;
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
};
