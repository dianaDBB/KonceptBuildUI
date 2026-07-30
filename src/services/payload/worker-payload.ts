import { UUID } from 'node:crypto';

export type AddWorkerPayload = {
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

export type UpdateWorkerPayload = {
  id?: UUID;
  name: string;
  nif: string;
  status: string;
  phoneCountryCode: string;
  phone: string;
  email: string;
  function: string;
  workerContractType: string;
  startDate: string;
  endDate?: string;
};

export type UpdateWorkerCompensationPayload = {
  workerId: UUID;
  validFrom: string;
  defaultHours?: number;
  hourRate?: number;
  monthlySalary?: number;
  tsu?: number;
  mealAllowance?: number;
  accidentInsurance?: number;
};
