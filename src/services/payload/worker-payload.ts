import { ContractType, WorkerStatus } from '@/types/worker';
import { UUID } from 'node:crypto';

export type WorkerPayload = {
  id?: UUID;
  name: string;
  nif: string;
  status: WorkerStatus;
  phoneCountryCode: string;
  phone: string;
  email: string;
  function: string;
  defaultHours: number;
  contractType: ContractType;
  hourRate?: number;
  monthlySalary?: number;
  tsu?: number;
  mealAllowance?: number;
  accidentInsurance?: number;
  startDate: string;
  endDate?: string;
};
