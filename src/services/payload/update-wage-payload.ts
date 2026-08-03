import { UUID } from 'node:crypto';

export type UpdateWagePayload = {
  id?: UUID;
  paidValue: number;
  paidDate: string;
  paymentMethod: string;
  notes?: string;
};
