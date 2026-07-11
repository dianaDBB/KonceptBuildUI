import { SortDirection } from './sort-direction';

export interface Worker {
  id?: string;
  name: string;
  workerType: string;
  hourRate?: number;
  monthlySalary?: number;
  hourCost?: number;
}

export enum WorkerSortField {
  NAME = 'NAME',
  WORKER_TYPE = 'WORKER_TYPE',
  HOUR_RATE = 'HOUR_RATE',
  MONTHLY_SALARY = 'MONTHLY_SALARY',
  HOUR_COST = 'HOUR_COST',
}

export interface WorkerFilters {
  name?: string;
  workerType?: 'CONTRACTOR' | 'INTERNAL' | '';
  minHourRate?: number;
  maxHourRate?: number;
  minMonthlySalary?: number;
  maxMonthlySalary?: number;
  minHourCost?: number;
  maxHourCost?: number;
  sortBy?: WorkerSortField;
  sortDirection?: SortDirection;
}
