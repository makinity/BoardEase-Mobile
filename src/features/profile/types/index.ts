import type { User } from '@/types';

export type { User };

export type UpdateProfileInput = Partial<Pick<User, 'displayName' | 'avatarUrl'>>;
