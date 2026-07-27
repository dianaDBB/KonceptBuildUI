import { WorkType } from './work-type';
import { WorkerType } from './worker-type';

export interface MonthlyTimesheetType {
  year: number;
  month: number;
  workersTimesheet: WorkerTimesheetType[];
}

export interface WorkerTimesheetType {
  worker: WorkerType;
  hourCost: number;
  totalHours: number | undefined;
  totalExtraHours: number | undefined;
  totalPaidAbsenceHours: number | undefined;
  totalUnpaidAbsenceHours: number | undefined;
  totalCost: number | undefined;
  totalCostExtraHours: number | undefined;
  totalCostPaidAbsenceHours: number | undefined;
  totalCostUnpaidAbsenceHours: number | undefined;
  worksTimesheet: WorkTimesheetType[];
}

export interface WorkTimesheetType {
  type: 'WORK' | 'ATTENDANCE_CODE';
  work?: WorkType;
  attendanceCode?: string;

  days: DayEntryType[];
}

export interface DayEntryType {
  date: string;
  hours: number | null;
}
