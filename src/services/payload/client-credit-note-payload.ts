import { UUID } from 'node:crypto';

export type ClientCreditNotePayload = {
  id?: UUID;
  docNumber: string;
  description: string;
  valueWithoutTax: number;
  appliedTax: number;
  registrationDate: string;
  dueDate?: string;
};
