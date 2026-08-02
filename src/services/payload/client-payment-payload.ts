import { UUID } from 'node:crypto';

export type ClientPaymentPayload = {
  id?: UUID;
  type: string;
  clientId: string;
  paymentDate: string;
  paidValue: number;
  paymentMethod: string;
  notes?: string;
  invoices: {
    invoiceId: string;
  }[];
};
