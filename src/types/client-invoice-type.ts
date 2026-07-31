import { SortDirection } from './sort-direction';
import { ClientType } from './client-type';
import { EntityType } from './entity-configs';
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
  CLIENT_NAME = 'CLIENT_NAME',
  WORK_NAME = 'WORK_NAME',
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
  clientName?: string;
  workName?: string;
  description?: string;
  valueWithoutTaxMin?: number;
  valueWithoutTaxMax?: number;
  appliedTaxMin?: number;
  appliedTaxMax?: number;
  taxValueMin?: number;
  taxValueMax?: number;
  totalValueMin?: number;
  totalValueMax?: number;
  registrationDateMin?: string;
  registrationDateMax?: string;
  dueDateMin?: string;
  dueDateMax?: string;

  sortBy?: ClientInvoiceSortField;
  sortDirection?: SortDirection;
}
