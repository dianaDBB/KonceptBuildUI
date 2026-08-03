import { SortDirection } from './sort-direction';
import { EntityType, RangeFilter } from './entity-configs';
import { PaymentMethodEnum } from './payment-method-enum';
import { UUID } from 'node:crypto';

export interface WageType extends EntityType {
  year?: number;
  month?: number;
  workerId?: UUID;
  workerCode?: string;
  workerName?: string;
  baseSalary?: number;
  expectedWage?: number;
  expectedExtraHours?: number;
  expectedDeductions?: number;
  expectedInternalCost?: number;
  paidValue?: number;
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
}

export enum WageSortField {
  CODE = 'CODE',
  YEAR = 'YEAR',
  MONTH = 'MONTH',
  WORKER_CODE = 'WORKER_CODE',
  WORKER_NAME = 'WORKER_NAME',
  EXPECTED_WAGE = 'EXPECTED_WAGE',
  EXPECTED_EXTRA_HOURS = 'EXPECTED_EXTRA_HOURS',
  EXPECTED_DEDUCTIONS = 'EXPECTED_DEDUCTIONS',
  EXPECTED_INTERNAL_COST = 'EXPECTED_INTERNAL_COST',
  PAID_VALUE = 'PAID_VALUE',
  PAID_DATE = 'PAID_DATE',
  PAYMENT_METHOD = 'PAYMENT_METHOD',
  NOTES = 'NOTES',
}

export interface WageFilters {
  code?: string;
  year?: RangeFilter;
  month?: RangeFilter;
  workerName?: string;
  workerCode?: string;
  expectedWage?: RangeFilter;
  expectedExtraHours?: RangeFilter;
  expectedDeductions?: RangeFilter;
  expectedInternalCost?: RangeFilter;
  paidValue?: RangeFilter;
  paidDate?: RangeFilter;
  paymentMethod?: PaymentMethodEnum;
  notes?: string;

  sortBy?: WageSortField;
  sortDirection?: SortDirection;
}
