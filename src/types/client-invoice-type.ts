import { SortDirection } from './sort-direction';
import { ClientType } from './client-type';
import { EntityType, RangeFilter } from './entity-configs';
import { WorkType } from './work-type';

export interface ClientInvoiceType extends EntityType {
  docNumber?: string;
  client?: ClientType;
  work?: WorkType;
  description?: string;
  valueWithoutTax?: number;
  appliedTax?: number;
  taxValue?: number;
  totalValue?: number;
  registrationDate?: string;
  dueDate?: string;
}

export enum ClientInvoiceSortField {
  DOCUMENT_NUMBER = 'DOCUMENT_NUMBER',
  CLIENT = 'CLIENT',
  WORK = 'WORK',
  DESCRIPTION = 'DESCRIPTION',
  VALUE_WITHOUT_TAX = 'VALUE_WITHOUT_TAX',
  APPLIED_TAX = 'APPLIED_TAX',
  TAX_VALUE = 'TAX_VALUE',
  TOTAL_VALUE = 'TOTAL_VALUE',
  REGISTRATION_DATE = 'REGISTRATION_DATE',
  DUE_DATE = 'DUE_DATE',
}

export interface ClientInvoiceFilters {
  docNumber?: string;
  client?: string;
  workName?: string;
  description?: string;
  valueWithoutTax?: RangeFilter;
  appliedTax?: RangeFilter;
  taxValue?: RangeFilter;
  totalValue?: RangeFilter;
  registrationDate?: RangeFilter;
  dueDate?: RangeFilter;

  sortBy?: ClientInvoiceSortField;
  sortDirection?: SortDirection;
}
