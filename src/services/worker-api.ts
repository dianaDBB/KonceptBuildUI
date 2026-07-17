import { WorkerType, WorkerFilters } from '@/types/worker-type';
import axiosClient from './api';
import { UUID } from 'crypto';
import { WorkerPayload } from './payload/worker-payload';

class WorkerApi {
  async searchWorkers(filters: WorkerFilters = {}): Promise<WorkerType[]> {
    const response = await axiosClient.post('/worker/search', filters, {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async addWorker(worker: WorkerType): Promise<void> {
    const payload: WorkerPayload = {
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
    const payload: WorkerPayload = {
      id: worker.id,
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

    await axiosClient.put('/worker/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async deleteWorker(id: UUID): Promise<void> {
    await axiosClient.delete(`/worker/${id}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }
}

export default new WorkerApi();
