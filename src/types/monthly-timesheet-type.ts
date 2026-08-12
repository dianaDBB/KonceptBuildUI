import { UUID } from 'node:crypto';
import { WorkType } from './work-type';
import { WorkerType } from './worker-type';

export interface MonthlyTimesheetType {
  year: number;
  month: number;
  workersTimesheet: WorkerTimesheetType[];
}

export interface WorkerTimesheetType {
  timesheetId: UUID;
  worker: WorkerType;
  expectedHours: number;
  totalHours: number | undefined;
  totalExtraHours: number | undefined;
  totalPaidAbsenceHours: number | undefined;
  totalUnpaidAbsenceHours: number | undefined;
  worksTimesheet: WorkTimesheetType[];
}

export interface WorkTimesheetType {
  type: 'WORK' | 'ATTENDANCE_CODE';
  work?: WorkType;
  attendanceCode?: string;

  days: DayEntryType[];
  _isNew?: boolean;
}

export interface DayEntryType {
  date: string;
  hours: number | null;
}
