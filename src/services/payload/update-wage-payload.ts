import { PaymentMethodEnum } from '@/types/payment-method-enum';
import { UUID } from 'node:crypto';

export type UpdateWagePayload = {
  id?: UUID;
  paidValue: number;
  paidDate: string;
  paymentMethod: PaymentMethodEnum;
  notes?: string;
};
