import { SortDirection } from './sort-direction';
import { EntityType } from './entity-configs';

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
  hourCost?: number;
  defaultHours?: number;
  hourRate?: number;
  monthlySalary?: number;
  tsu?: number;
  mealAllowance?: number;
  accidentInsurance?: number;
}

export interface WorkerCompensationType {
  worker?: WorkerType;
  validFrom?: string;
  defaultHours?: number;
  hourRate?: number;
  monthlySalary?: number;
  tsu?: number;
  mealAllowance?: number;
  accidentInsurance?: number;
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
  hourCostMin?: number;
  hourCostMax?: number;
  defaultHoursMin?: number;
  defaultHoursMax?: number;
  workerContractType?: string;
  hourRateMin?: number;
  hourRateMax?: number;
  monthlySalaryMin?: number;
  monthlySalaryMax?: number;
  tsuMin?: number;
  tsuMax?: number;
  mealAllowanceMin?: number;
  mealAllowanceMax?: number;
  accidentInsuranceMin?: number;
  accidentInsuranceMax?: number;
  startDateMin?: string;
  startDateMax?: string;
  endDateMin?: string;
  endDateMax?: string;

  sortBy?: WorkerSortField;
  sortDirection?: SortDirection;
}
