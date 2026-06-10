import type { Reservation } from '@/types';

export type { Reservation };

export type ReservationStatus = Reservation['status'];
export type CreateReservationInput = Omit<Reservation, 'id' | 'status'>;
