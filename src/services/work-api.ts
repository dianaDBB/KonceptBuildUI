import axiosClient from './api';
import { UUID } from 'crypto';
import { Work, WorkFilters } from '@/types/work';
import { WorkPayload } from './payload/work-payload';

class WorkApi {
  async searchWorks(filters: WorkFilters = {}): Promise<Work[]> {
    const response = await axiosClient.post('/work/search', filters, {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async addWork(work: Work): Promise<void> {
    const payload: WorkPayload = {
      name: work.name!,
      status: work.status!,
      contractedBudget: work.contractedBudget!,
      estimatedCostMaterials: work.estimatedCostMaterials!,
      estimatedCostLabor: work.estimatedCostLabor!,
      startDate: work.startDate!,
      estimatedEndDate: work.estimatedEndDate!,
      endDate: work.endDate,
      clientId: work.client!.id!,
    };

    await axiosClient.post('/work/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async editWork(work: Work): Promise<void> {
    const payload: WorkPayload = {
      id: work.id,
      name: work.name!,
      status: work.status!,
      contractedBudget: work.contractedBudget!,
      estimatedCostMaterials: work.estimatedCostMaterials!,
      estimatedCostLabor: work.estimatedCostLabor!,
      startDate: work.startDate!,
      estimatedEndDate: work.estimatedEndDate!,
      endDate: work.endDate,
      clientId: work.client!.id!,
    };

    await axiosClient.put('/work/', payload, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }

  async deleteWork(id: UUID): Promise<void> {
    await axiosClient.delete(`/work/${id}`, {
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    });
  }
}

export default new WorkApi();
