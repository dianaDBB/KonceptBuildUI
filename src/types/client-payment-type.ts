import { SortDirection } from './sort-direction';
import { ClientType } from './client-type';
import { EntityType, RangeFilter } from './entity-configs';
import { ClientPaymentInvoiceType } from './client-payment-invoice-type';

export interface ClientPaymentType extends EntityType {
  documentId?: string;
  type?: string;
  client?: ClientType;
  paymentDate?: string;
  totalPaidValue?: number;
  paymentMethod?: string;
  notes?: string;
  paidInvoices?: ClientPaymentInvoiceType[];
}

export enum ClientPaymentSortField {
  DOCUMENT_ID = 'DOCUMENT_ID',
  PAYMENT_TYPE = 'PAYMENT_TYPE',
  CLIENT = 'CLIENT',
  PAYMENT_DATE = 'PAYMENT_DATE',
  TOTAL_PAID_VALUE = 'TOTAL_PAID_VALUE',
  PAYMENT_METHOD = 'PAYMENT_METHOD',
  NOTES = 'NOTES',
}

export interface ClientPaymentFilters {
  documentId?: string;
  type?: string;
  client?: string;
  paymentDate?: RangeFilter;
  totalPaidValue?: RangeFilter;
  paymentMethod?: string;
  note?: string;

  sortBy?: ClientPaymentSortField;
  sortDirection?: SortDirection;
}
