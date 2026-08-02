import { SortDirection } from './sort-direction';
import { ClientType } from './client-type';
import { EntityType } from './entity-configs';
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
  CLIENT_NAME = 'CLIENT_NAME',
  PAYMENT_DATE = 'PAYMENT_DATE',
  PAID_VALUE = 'PAID_VALUE',
  PAYMENT_METHOD = 'PAYMENT_METHOD',
  NOTES = 'NOTES',
}

export interface ClientPaymentFilters {
  documentId?: string;
  type?: string;
  clientName?: string;
  paymentDateMin?: number;
  paymentDateMax?: number;
  paidValueMin?: number;
  paidValueMax?: number;
  paymentMethod?: string;
  note?: string;

  sortBy?: ClientPaymentSortField;
  sortDirection?: SortDirection;
}
