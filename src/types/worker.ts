import { SortDirection } from './sort-direction';

export interface Worker {
  code?: string;
  name?: string;
  status?: string;
  contact?: string;
  email?: string;
  function?: string;
  defaultHours?: number;
  contractType?: string;
  hourRate?: number;
  monthlySalary?: number;
  tsu?: number;
  mealAllowance?: number;
  accidentInsurance?: number;
  startDate?: string;
  endDate?: string;
}

export enum WorkerSortField {
  CODE = 'CODE',
  NAME = 'NAME',
  STATUS = 'STATUS',
  CONTACT = 'CONTACT',
  EMAIL = 'EMAIL',
  FUNCTION = 'FUNCTION',
  DEFAULT_HOURS = 'DEFAULT_HOURS',
  CONTRACT_TYPE = 'CONTRACT_TYPE',
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
  status?: string;
  contact?: string;
  email?: string;
  function?: string;
  defaultHoursMin?: number;
  defaultHoursMax?: number;
  contractType?: string;
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

export class WorkerStatus {
  static readonly ACTIVE = 'ACTIVE';
  static readonly INACTIVE = 'INACTIVE';

  static readonly OPTIONS = [
    { value: 'ACTIVE', label: 'Activo' },
    { value: 'INACTIVE', label: 'Inactivo' },
  ];

  static getLabel(value?: string): string {
    return WorkerStatus.OPTIONS.find((option) => option.value === value)?.label ?? '';
  }
}

export class ContractType {
  static readonly INTERNAL = 'INTERNAL';
  static readonly CONTRACTOR = 'CONTRACTOR';

  static readonly OPTIONS = [
    { value: ContractType.INTERNAL, label: 'Contracto' },
    { value: ContractType.CONTRACTOR, label: 'Hora' },
  ];

  static getLabel(value?: string): string {
    return ContractType.OPTIONS.find((option) => option.value === value)?.label ?? '';
  }
}
