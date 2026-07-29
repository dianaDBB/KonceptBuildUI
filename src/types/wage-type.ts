import { SortDirection } from './sort-direction';
import { EntityType } from './entity-configs';
import { PaymentMethodType } from './payment-method-type';
import { UUID } from 'node:crypto';

export interface WageType extends EntityType {
  year?: number;
  month?: number;
  workerId?: UUID;
  workerCode?: string;
  workerName?: string;
  expectedWage?: number;
  expectedExtraHours?: number;
  expectedDeductions?: number;
  expectedInternalCost?: number;
  paidValue?: number;
  paidDate?: string;
  paymentMethod?: PaymentMethodType;
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
  yearMin?: number;
  yearMax?: number;
  monthMin?: number;
  monthMax?: number;
  workerCode?: string;
  workerName?: string;
  expectedWageMin?: number;
  expectedWageMax?: number;
  expectedExtraHoursMin?: number;
  expectedExtraHoursMax?: number;
  expectedDeductionsMin?: number;
  expectedDeductionsMax?: number;
  expectedInternalCostMin?: number;
  expectedInternalCostMax?: number;
  paidValueMin?: number;
  paidValueMax?: number;
  paidDateMin?: string;
  paidDateMax?: string;
  paymentMethod?: PaymentMethodType;
  notes?: string;

  sortBy?: WageSortField;
  sortDirection?: SortDirection;
}
