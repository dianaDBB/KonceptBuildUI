import { UUID } from 'node:crypto';

export type WorkerPayload = {
  id?: UUID;
  name: string;
  nif: string;
  status: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
  function: string;
  defaultHours: number;
  workerContractType: string;
  hourRate?: number;
  monthlySalary?: number;
  tsu?: number;
  mealAllowance?: number;
  accidentInsurance?: number;
  startDate: string;
  endDate?: string;
};
