import { Status } from '@/types/status';
import { WorkerContractType } from '@/types/worker';
import { UUID } from 'node:crypto';

export type WorkerPayload = {
  id?: UUID;
  name: string;
  nif: string;
  status: Status;
  phoneCountryCode: string;
  phone: string;
  email: string;
  function: string;
  defaultHours: number;
  contractType: WorkerContractType;
  hourRate?: number;
  monthlySalary?: number;
  tsu?: number;
  mealAllowance?: number;
  accidentInsurance?: number;
  startDate: string;
  endDate?: string;
};
