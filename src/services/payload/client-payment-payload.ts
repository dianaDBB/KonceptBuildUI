import { UUID } from 'node:crypto';

export type ClientPaymentPayload = {
  id?: UUID;
  type: string;
  clientId: string;
  paymentDate: string;
  paymentMethod: string;
  notes?: string;
  paidInvoices: {
    invoiceId: string;
    paidValue: number;
  }[];
};
