import { SortDirection } from './sort-direction';
import { ClientType } from './client-type';
import { EntityType, RangeFilter } from './entity-configs';
import { ClientInvoiceType } from './client-invoice-type';

export interface ClientPaymentType extends EntityType {
  type?: string;
  documentId?: string;
  invoices?: ClientInvoiceType[];
  client?: ClientType;
  paymentDate?: string;
  paidValue?: number;
  paymentMethod?: string;
  notes?: string;
}

export enum ClientPaymentSortField {
  DOCUMENT_ID = 'DOCUMENT_ID',
  PAYMENT_TYPE = 'PAYMENT_TYPE',
  CLIENT = 'CLIENT',
  PAYMENT_DATE = 'PAYMENT_DATE',
  PAID_VALUE = 'PAID_VALUE',
  PAYMENT_METHOD = 'PAYMENT_METHOD',
  NOTES = 'NOTES',
}

export interface ClientPaymentFilters {
  documentId?: string;
  type?: string;
  client?: string;
  paymentDate?: RangeFilter;
  paidValue?: RangeFilter;
  paymentMethod?: string;
  note?: string;

  sortBy?: ClientPaymentSortField;
  sortDirection?: SortDirection;
}
