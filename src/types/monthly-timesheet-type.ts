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
  totalCost: number | undefined;
  worksTimesheet: WorkTimesheetType[];
}

export interface WorkTimesheetType {
  type: 'WORK' | 'ATTENDANCE_CODE';
  work?: WorkType;
  attendanceCode?: AttendanceCode;

  days: DayEntryType[];
}

export interface DayEntryType {
  date: string;
  hours: number | null;
}

export class AttendanceCode {
  static readonly WK = 'WK';
  static readonly SL = 'SL';
  static readonly UA = 'UA';
  static readonly JA = 'JA';
  static readonly VAC = 'VAC';
  static readonly HOL = 'HOL';

  static readonly OPTIONS = [
    { value: 'WK', label: 'Trabalho' },
    { value: 'SL', label: 'Baixa Médica' },
    { value: 'UA', label: 'Falta Injustificada' },
    { value: 'JA', label: 'Falta Justificada' },
    { value: 'VAC', label: 'Férias' },
    { value: 'HOL', label: 'Feriado' },
  ];

  static getLabel(value?: string): string {
    return AttendanceCode.OPTIONS.find((option) => option.value === value)?.label ?? '';
  }
}
