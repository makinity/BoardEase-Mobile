import type { Bill, Payment } from '@/types';

export type { Bill, Payment };

export type CreatePaymentInput = Omit<Payment, 'id' | 'status' | 'createdAt'>;
