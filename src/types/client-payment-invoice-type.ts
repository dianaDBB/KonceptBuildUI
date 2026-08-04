import { EntityType } from './entity-configs';
import { ClientInvoiceType } from './client-invoice-type';
import { ClientType } from './client-type';

export interface ClientPaymentInvoiceType extends EntityType {
  invoice?: ClientInvoiceType;
  paidValue?: number;
  _client?: ClientType;
}
