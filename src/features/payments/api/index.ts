import { supabase } from '@/lib/supabase';

import type { Bill, CreatePaymentInput, Payment } from '../types';

const PAYMENTS = 'payments';
const BILLS = 'bills';

export async function listPayments(): Promise<Payment[]> {
  const { data, error } = await supabase.from(PAYMENTS).select('*');
  if (error) throw error;
  return (data ?? []) as Payment[];
}

export async function getPayment(id: string): Promise<Payment> {
  const { data, error } = await supabase.from(PAYMENTS).select('*').eq('id', id).single();
  if (error) throw error;
  return data as Payment;
}

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  const { data, error } = await supabase
    .from(PAYMENTS)
    .insert({ ...input, status: 'pending' })
    .select()
    .single();
  if (error) throw error;
  return data as Payment;
}

async function setPaymentStatus(id: string, status: Payment['status']): Promise<Payment> {
  const { data, error } = await supabase.from(PAYMENTS).update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return data as Payment;
}

export const approvePayment = (id: string) => setPaymentStatus(id, 'approved');
export const rejectPayment = (id: string) => setPaymentStatus(id, 'rejected');

export async function listBills(): Promise<Bill[]> {
  const { data, error } = await supabase.from(BILLS).select('*');
  if (error) throw error;
  return (data ?? []) as Bill[];
}

export async function getBill(id: string): Promise<Bill> {
  const { data, error } = await supabase.from(BILLS).select('*').eq('id', id).single();
  if (error) throw error;
  return data as Bill;
}
