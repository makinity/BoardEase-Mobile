import { useMutation } from '@tanstack/react-query';

import * as api from '../api';
import type { UploadBucket } from '../types';

type UploadArgs = { bucket: UploadBucket; path: string; file: ArrayBuffer };

export function useUploadImage() {
  return useMutation({
    mutationFn: ({ bucket, path, file }: UploadArgs) => api.uploadImage(bucket, path, file),
  });
}
