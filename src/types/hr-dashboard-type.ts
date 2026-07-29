import { WorkType } from './work-type';
import { WorkerType } from './worker-type';

export interface HrDashboardType {
  dashboard?: HrDashboardRowType[];
}

export interface HrDashboardRowType {
  workDto?: WorkType;
  totalHours?: number;
  totalCost: number;
  workerDtoList: HrDashboardWorkerType[];
}

export interface HrDashboardWorkerType {
  workerDto: WorkerType;
  totalHours: number;
  totalCost: number;
}
