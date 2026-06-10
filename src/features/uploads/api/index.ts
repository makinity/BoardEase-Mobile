import { supabase } from '@/lib/supabase';

import type { UploadBucket } from '../types';

export async function uploadImage(bucket: UploadBucket, path: string, file: ArrayBuffer) {
  return supabase.storage.from(bucket).upload(path, file, { upsert: true });
}

export function getPublicUrl(bucket: UploadBucket, path: string): string {
  return supabase.storage.from(bucket).getPublicUrl(path).data.publicUrl;
}

export async function removeFile(bucket: UploadBucket, path: string) {
  return supabase.storage.from(bucket).remove([path]);
}
