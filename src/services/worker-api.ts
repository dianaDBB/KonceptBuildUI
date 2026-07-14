import { Worker, WorkerFilters } from '@/types/worker';
import client from './api';
import { UUID } from 'crypto';
import { WorkerPayload } from './payload/worker-payload';

class WorkerApi {
  async searchWorkers(filters: WorkerFilters = {}): Promise<Worker[]> {
    const response = await client.post('/worker/search', filters, {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async addWorker(worker: Worker): Promise<void> {
    const payload: WorkerPayload = {
      name: worker.name!,
      nif: worker.nif!,
      status: worker.status!,
      phoneCountryCode: worker.phoneCountryCode!,
      phone: worker.phone!,
      email: worker.email!,
      function: worker.function!,
      defaultHours: worker.defaultHours!,
      contractType: worker.contractType!,
      hourRate: worker.hourRate,
      monthlySalary: worker.monthlySalary,
      tsu: worker.tsu,
      mealAllowance: worker.mealAllowance,
      accidentInsurance: worker.accidentInsurance,
      startDate: worker.startDate!,
      endDate: worker.endDate,
    };

    await client.post('/worker/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async editWorker(worker: Worker): Promise<void> {
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
      contractType: worker.contractType!,
      hourRate: worker.hourRate,
      monthlySalary: worker.monthlySalary,
      tsu: worker.tsu,
      mealAllowance: worker.mealAllowance,
      accidentInsurance: worker.accidentInsurance,
      startDate: worker.startDate!,
      endDate: worker.endDate,
    };

    await client.put('/worker/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async deleteWorker(id: UUID): Promise<void> {
    await client.delete(`/worker/${id}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }
}

export default new WorkerApi();
