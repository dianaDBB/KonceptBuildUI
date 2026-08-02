import type { WageType } from '@/types/wage-type';
import axiosClient from './api';
import type { AddWagePayload } from './payload/add-wage-payload';
import type { UpdateWagePayload } from './payload/update-wage-payload';

interface WageApiResponse {
  id?: unknown;
  code?: unknown;
  year?: unknown;
  month?: unknown;
  workerTimesheetDto?: {
    worker?: {
      id?: unknown;
      code?: unknown;
      name?: unknown;
      currentWorkerCompensation?: {
        monthlySalary?: unknown;
        hourRate?: unknown;
      };
    };
  };
  expectedWage?: unknown;
  expectedExtraHours?: unknown;
  expectedDeductions?: unknown;
  expectedInternalCost?: unknown;
  paidValue?: unknown;
  paidDate?: unknown;
  paymentMethod?: unknown;
  notes?: unknown;
}

class WageApi {
  async searchWages(filters = {}): Promise<WageType[]> {
    const response = await axiosClient.post('/wage/search', filters, {
      headers: { Accept: 'application/json' },
    });

    return response.data.map(this.mapWage);
  }

  async addWage(payload: AddWagePayload): Promise<void> {
    await axiosClient.post('/wage/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async editWage(wage: WageType): Promise<void> {
    const payload: UpdateWagePayload = {
      id: wage.id,
      paidValue: wage.paidValue!,
      paidDate: wage.paidDate!,
      paymentMethod: wage.paymentMethod!,
      notes: wage.notes,
    };

    await axiosClient.put('/wage/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  private mapWage(wage: WageApiResponse): WageType {
    const worker = wage.workerTimesheetDto?.worker;
    const compensation = worker?.currentWorkerCompensation;

    return {
      id: typeof wage.id === 'string' ? (wage.id as WageType['id']) : undefined,
      code: typeof wage.code === 'string' ? wage.code : undefined,
      year: typeof wage.year === 'number' ? wage.year : undefined,
      month: typeof wage.month === 'number' ? wage.month : undefined,
      workerId: typeof worker?.id === 'string' ? (worker.id as WageType['workerId']) : undefined,
      workerCode: typeof worker?.code === 'string' ? worker.code : undefined,
      workerName: typeof worker?.name === 'string' ? worker.name : undefined,
      baseSalary:
        typeof compensation?.monthlySalary === 'number'
          ? compensation.monthlySalary
          : typeof compensation?.hourRate === 'number'
          ? compensation.hourRate
          : undefined,
      expectedWage: typeof wage.expectedWage === 'number' ? wage.expectedWage : undefined,
      expectedExtraHours: typeof wage.expectedExtraHours === 'number' ? wage.expectedExtraHours : undefined,
      expectedDeductions: typeof wage.expectedDeductions === 'number' ? wage.expectedDeductions : undefined,
      expectedInternalCost: typeof wage.expectedInternalCost === 'number' ? wage.expectedInternalCost : undefined,
      paidValue: typeof wage.paidValue === 'number' ? wage.paidValue : undefined,
      paidDate: typeof wage.paidDate === 'string' ? wage.paidDate : undefined,
      paymentMethod: wage.paymentMethod as WageType['paymentMethod'],
      notes: typeof wage.notes === 'string' ? wage.notes : undefined,
    };
  }
}

export default new WageApi();
