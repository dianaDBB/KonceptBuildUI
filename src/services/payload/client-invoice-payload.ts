import { UUID } from 'node:crypto';

export type ClientInvoicePayload = {
  id?: UUID;
  docNumber: string;
  clientId: string;
  workId: string;
  description: string;
  valueWithoutTax: number;
  appliedTax: number;
  registrationDate: string;
  dueDate: string;
};
