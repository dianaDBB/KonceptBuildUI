import { Worker, WorkerFilters } from '@/types/worker';
import client from './api';

class WorkerApi {
  async searchWorkers(filters: WorkerFilters = {}): Promise<Worker[]> {
    const response = await client.post('/worker/search', filters, {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async addWorker(worker: Worker): Promise<void> {
    await client.post('/worker/', worker, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }
}

export default new WorkerApi();
