import { WageType } from '@/types/wage-type';
import axiosClient from './api';
import { AddWagePayload } from './payload/add-wage-payload';
import { UpdateWagePayload } from './payload/update-wage-payload';

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

  private mapWage(wage: any): WageType {
    return {
      id: wage.id,
      code: wage.code,
      year: wage.year,
      month: wage.month,
      workerId: wage.workerTimesheetDto.worker.id,
      workerCode: wage.workerTimesheetDto.worker.code,
      workerName: wage.workerTimesheetDto.worker.name,
      baseSalary:
        wage.workerTimesheetDto.worker.currentWorkerCompensation?.monthlySalary ||
        wage.workerTimesheetDto.worker.currentWorkerCompensation?.hourRate,
      expectedWage: wage.expectedWage,
      expectedExtraHours: wage.expectedExtraHours,
      expectedDeductions: wage.expectedDeductions,
      expectedInternalCost: wage.expectedInternalCost,
      paidValue: wage.paidValue,
      paidDate: wage.paidDate,
      paymentMethod: wage.paymentMethod,
      notes: wage.notes,
    };
  }
}

export default new WageApi();
