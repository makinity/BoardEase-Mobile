import { supabase } from '@/lib/supabase';

import type { Bill, CreatePaymentInput, Payment } from '../types';

const PAYMENTS = 'payments';
const BILLS = 'bills';

function toPayment(row: Record<string, unknown>): Payment {
  return {
    id: row.id as string,
    rentalId: row.rental_id as string,
    billId: row.bill_id as string | undefined,
    amount: row.amount as number,
    method: row.method as string,
    referenceNumber: row.reference_number as string | undefined,
    proofUrl: row.proof_url as string | undefined,
    status: row.status as Payment['status'],
    createdAt: row.created_at as string,
  };
}

function toBill(row: Record<string, unknown>): Bill {
  return {
    id: row.id as string,
    rentalId: row.rental_id as string,
    occupantId: row.occupant_id as string,
    period: row.period as string,
    totalAmount: row.total_amount as number,
    paidAmount: row.paid_amount as number,
    status: row.status as Bill['status'],
  };
}

export async function listPayments(): Promise<Payment[]> {
  const { data, error } = await supabase.from(PAYMENTS).select('*').order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []).map(toPayment);
}

export async function getPayment(id: string): Promise<Payment> {
  const { data, error } = await supabase.from(PAYMENTS).select('*').eq('id', id).single();
  if (error) throw error;
  return toPayment(data);
}

export async function createPayment(input: CreatePaymentInput): Promise<Payment> {
  const { data, error } = await supabase.from(PAYMENTS).insert({
    rental_id: input.rentalId,
    bill_id: input.billId,
    occupant_id: input.occupantId,
    amount: input.amount,
    method: input.method,
    reference_number: input.referenceNumber,
    proof_url: input.proofUrl,
    status: 'pending',
  }).select().single();
  if (error) throw error;
  return toPayment(data);
}

async function setPaymentStatus(id: string, status: Payment['status']): Promise<Payment> {
  const { data, error } = await supabase.from(PAYMENTS).update({ status }).eq('id', id).select().single();
  if (error) throw error;
  return toPayment(data);
}

export const approvePayment = (id: string) => setPaymentStatus(id, 'approved');
export const rejectPayment = (id: string) => setPaymentStatus(id, 'rejected');

export async function listBills(): Promise<Bill[]> {
  const { data, error } = await supabase.from(BILLS).select('*');
  if (error) throw error;
  return (data ?? []).map(toBill);
}

export async function getBill(id: string): Promise<Bill> {
  const { data, error } = await supabase.from(BILLS).select('*').eq('id', id).single();
  if (error) throw error;
  return toBill(data);
}
