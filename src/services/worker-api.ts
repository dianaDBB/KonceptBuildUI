import { WorkerType, WorkerFilters } from '@/types/worker-type';
import axiosClient from './api';
import { UUID } from 'crypto';
import { AddWorkerPayload, UpdateWorkerCompensationPayload, UpdateWorkerPayload } from './payload/worker-payload';

class WorkerApi {
  async searchWorkers(filters: WorkerFilters = {}): Promise<WorkerType[]> {
    const response = await axiosClient.post('/worker/search', filters, {
      headers: { Accept: 'application/json' },
    });

    return response.data;
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
      defaultHours: worker.currentWorkerCompensation!.defaultHours!,
      workerContractType: worker.workerContractType!,
      hourRate: worker.currentWorkerCompensation!.hourRate,
      monthlySalary: worker.currentWorkerCompensation!.monthlySalary,
      tsu: worker.currentWorkerCompensation!.tsu,
      mealAllowance: worker.currentWorkerCompensation!.mealAllowance,
      accidentInsurance: worker.currentWorkerCompensation!.accidentInsurance,
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

  async updateCompensation(worker: WorkerType): Promise<void> {
    const payload: UpdateWorkerCompensationPayload = {
      workerId: worker.id!,
      validFrom: worker.currentWorkerCompensation!.validFrom!,
      defaultHours: worker.currentWorkerCompensation!.defaultHours,
      hourRate: worker.currentWorkerCompensation!.hourRate,
      monthlySalary: worker.currentWorkerCompensation!.monthlySalary,
      tsu: worker.currentWorkerCompensation!.tsu,
      mealAllowance: worker.currentWorkerCompensation!.mealAllowance,
      accidentInsurance: worker.currentWorkerCompensation!.accidentInsurance,
    };

    await axiosClient.put('/worker/compensation', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }
}

export default new WorkerApi();
