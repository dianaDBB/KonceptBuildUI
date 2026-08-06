import { SortDirection } from './sort-direction';
import { ClientType } from './client-type';
import { EntityType, RangeFilter } from './entity-configs';
import { WorkType } from './work-type';
import { ClientCreditNoteType } from './client-credit-note-type';

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
  creditNotes?: ClientCreditNoteType[];
  sumCreditNotesWithoutTax?: number;
  sumCreditNotesWithTax?: number;
  totalValueNet?: number;
  totalValueGross?: number;
  amountReceivedWithoutTax?: number;
  amountReceivedWithTax?: number;
  amountDueWithoutTax?: number;
  amountDueWithTax?: number;
  paymentsCount?: number;
  status?: string;
  daysPastDue?: number;
  aging?: string;
  settlementDate?: string;
  daysToPay?: number;
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
  SUM_CREDIT_NOTES_WITHOUT_TAX = 'SUM_CREDIT_NOTES_WITHOUT_TAX',
  SUM_CREDIT_NOTES_WITH_TAX = 'SUM_CREDIT_NOTES_WITH_TAX',
  TOTAL_VALUE_NET = 'TOTAL_VALUE_NET',
  TOTAL_VALUE_GROSS = 'TOTAL_VALUE_GROSS',
  AMOUNT_RECEIVED_WITHOUT_TAX = 'AMOUNT_RECEIVED_WITHOUT_TAX',
  AMOUNT_RECEIVED_WITH_TAX = 'AMOUNT_RECEIVED_WITH_TAX',
  AMOUNT_DUE_WITHOUT_TAX = 'AMOUNT_DUE_WITHOUT_TAX',
  AMOUNT_DUE_WITH_TAX = 'AMOUNT_DUE_WITH_TAX',
  PAYMENTS_COUNT = 'PAYMENTS_COUNT',
  STATUS = 'STATUS',
  DAYS_PAST_DUE = 'DAYS_PAST_DUE',
  AGING = 'AGING',
  SETTLEMENT_DATE = 'SETTLEMENT_DATE',
  DAYS_TO_PAY = 'DAYS_TO_PAY',
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
