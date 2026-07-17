import { UUID } from 'node:crypto';

export type WorkPayload = {
  id?: UUID;
  name: string;
  status: string;
  contractedBudget: number;
  estimatedCostMaterials: number;
  estimatedCostLabor: number;
  startDate: string;
  estimatedEndDate: string;
  endDate?: string;
  clientId: UUID;
};
