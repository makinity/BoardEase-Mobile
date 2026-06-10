import type { Room } from '@/types';

export type { Room };

export type CreateRoomInput = Omit<Room, 'id'>;
export type UpdateRoomInput = Partial<CreateRoomInput>;
