import { SortDirection } from './sort-direction';
import { EntityType, RangeFilter } from './entity-configs';
import { UUID } from 'node:crypto';

export interface WorkerType extends EntityType {
  name?: string;
  nif?: string;
  status?: string;
  phoneCountryCode?: string;
  phone?: string;
  email?: string;
  function?: string;
  workerContractType?: string;
  startDate?: string;
  endDate?: string;
  currentWorkerCompensation?: WorkerCompensationType;
}

export interface WorkerCompensationType {
  id?: UUID;
  workerId?: string;
  hourCost?: number;
  defaultHours?: number;
  hourRate?: number;
  monthlySalary?: number;
  tsu?: number;
  mealAllowance?: number;
  accidentInsurance?: number;
  validFrom?: string;
  validTo?: string;
}

export enum WorkerSortField {
  CODE = 'CODE',
  NAME = 'NAME',
  NIF = 'NIF',
  STATUS = 'STATUS',
  PHONE = 'PHONE',
  EMAIL = 'EMAIL',
  FUNCTION = 'FUNCTION',
  HOUR_COST = 'HOUR_COST',
  DEFAULT_HOURS = 'DEFAULT_HOURS',
  WORKER_CONTRACT_TYPE = 'CONTRACT_TYPE',
  HOUR_RATE = 'HOUR_RATE',
  MONTHLY_SALARY = 'MONTHLY_SALARY',
  TSU = 'TSU',
  MEAL_ALLOWANCE = 'MEAL_ALLOWANCE',
  ACCIDENT_INSURANCE = 'ACCIDENT_INSURANCE',
  START_DATE = 'START_DATE',
  END_DATE = 'END_DATE',
}

export interface WorkerFilters {
  code?: string;
  name?: string;
  nif?: string;
  status?: string;
  phone?: string;
  email?: string;
  function?: string;
  hourCost?: RangeFilter;
  defaultHours?: RangeFilter;
  workerContractType?: string;
  hourRate?: RangeFilter;
  monthlySalary?: RangeFilter;
  tsu?: RangeFilter;
  mealAllowance?: RangeFilter;
  accidentInsurance?: RangeFilter;
  startDate?: RangeFilter;
  endDate?: RangeFilter;

  sortBy?: WorkerSortField;
  sortDirection?: SortDirection;
}
