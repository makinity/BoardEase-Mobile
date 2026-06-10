import type { Property } from '@/types';

export type { Property };

export type CreatePropertyInput = Omit<Property, 'id'>;
export type UpdatePropertyInput = Partial<CreatePropertyInput>;
