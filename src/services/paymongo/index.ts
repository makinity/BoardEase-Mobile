// PayMongo integration placeholder
// Docs: https://developers.paymongo.com/
// Install: npm install paymongo (or use fetch against the REST API)

export type PayMongoPaymentMethod = 'gcash' | 'grab_pay' | 'card' | 'paymaya';

export type CreatePaymentLinkParams = {
  amount: number; // in centavos
  description: string;
  remarks?: string;
};

export async function createPaymentLink(_params: CreatePaymentLinkParams): Promise<{ url: string }> {
  // TODO: call PayMongo /v1/links via Supabase Edge Function to keep secret key server-side
  throw new Error('PayMongo integration not yet implemented');
}
