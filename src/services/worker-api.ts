import { WorkerType, WorkerFilters, WorkerCompensationType } from '@/types/worker-type';
import axiosClient from './api';
import { UUID } from 'crypto';
import { AddWorkerPayload, UpdateWorkerCompensationPayload, UpdateWorkerPayload } from './payload/worker-payload';

class WorkerApi {
  async searchWorkers(filters: WorkerFilters = {}): Promise<WorkerType[]> {
    const response = await axiosClient.post('/worker/search', filters, {
      headers: { Accept: 'application/json' },
    });

    return response.data.map(this.mapWorker);
  }

  private mapWorker(worker: any): WorkerType {
    return {
      id: worker.id,
      code: worker.code,
      name: worker.name,
      nif: worker.nif,
      status: worker.status,
      phoneCountryCode: worker.phoneCountryCode,
      phone: worker.phone,
      email: worker.email,
      function: worker.function,
      workerContractType: worker.workerContractType,
      startDate: worker.startDate,
      endDate: worker.currentWorkerHistoryDto.endDate,
      hourCost: worker.currentWorkerHistoryDto.hourCost,
      defaultHours: worker.currentWorkerHistoryDto.defaultHours,
      hourRate: worker.currentWorkerHistoryDto.hourRate,
      monthlySalary: worker.currentWorkerHistoryDto.monthlySalary,
      tsu: worker.currentWorkerHistoryDto.tsu,
      mealAllowance: worker.currentWorkerHistoryDto.mealAllowance,
      accidentInsurance: worker.currentWorkerHistoryDto.accidentInsurance,
    };
  }

  async addWorker(worker: WorkerType): Promise<void> {
    const payload: AddWorkerPayload = {
      name: worker.name!,
      nif: worker.nif!,
      status: worker.status!,
      phoneCountryCode: worker.phoneCountryCode!,
      phone: worker.phone!,
      email: worker.email!,
      function: worker.function!,
      defaultHours: worker.defaultHours!,
      workerContractType: worker.workerContractType!,
      hourRate: worker.hourRate,
      monthlySalary: worker.monthlySalary,
      tsu: worker.tsu,
      mealAllowance: worker.mealAllowance,
      accidentInsurance: worker.accidentInsurance,
      startDate: worker.startDate!,
      endDate: worker.endDate,
    };

    await axiosClient.post('/worker/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async editWorker(worker: WorkerType): Promise<void> {
    const payload: UpdateWorkerPayload = {
      id: worker.id,
      name: worker.name!,
      nif: worker.nif!,
      status: worker.status!,
      phoneCountryCode: worker.phoneCountryCode!,
      phone: worker.phone!,
      email: worker.email!,
      function: worker.function!,
      workerContractType: worker.workerContractType!,
      startDate: worker.startDate!,
      endDate: worker.endDate,
    };

    await axiosClient.put('/worker/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async deleteWorker(id: UUID): Promise<void> {
    await axiosClient.delete(`/worker/${id}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async updateCompensation(workerCompensationType: WorkerCompensationType): Promise<void> {
    const payload: UpdateWorkerCompensationPayload = {
      workerId: workerCompensationType.worker!.id!,
      validFrom: workerCompensationType.validFrom!,
      defaultHours: workerCompensationType.defaultHours,
      hourRate: workerCompensationType.hourRate,
      monthlySalary: workerCompensationType.monthlySalary,
      tsu: workerCompensationType.tsu,
      mealAllowance: workerCompensationType.mealAllowance,
      accidentInsurance: workerCompensationType.accidentInsurance,
    };

    await axiosClient.put('/worker/compensation', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }
}

export default new WorkerApi();
