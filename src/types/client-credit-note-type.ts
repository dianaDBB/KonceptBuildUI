import { EntityType } from './entity-configs';
import { ClientInvoiceType } from './client-invoice-type';

export interface ClientCreditNoteType extends EntityType {
  docNumber?: string;
  description?: string;
  valueWithoutTax?: number;
  appliedTax?: number;
  taxValue?: number;
  totalValue?: number;
  registrationDate?: string;
  dueDate?: string;
  _invoice?: ClientInvoiceType;
}
