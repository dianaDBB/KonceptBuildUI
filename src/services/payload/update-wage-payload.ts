import { PaymentMethodType } from '@/types/payment-method-type';
import { UUID } from 'node:crypto';

export type UpdateWagePayload = {
  id?: UUID;
  paidValue: number;
  paidDate: string;
  paymentMethod: PaymentMethodType;
  notes?: string;
};
