import { UUID } from 'node:crypto';
import { SortDirection } from './sort-direction';
import { ClientType } from './client-type';

export interface WorkType {
  id?: UUID;
  code?: string;
  name?: string;
  status?: string;
  contractedBudget?: number;
  estimatedCost?: number;
  estimatedCostMaterials?: number;
  estimatedCostLabor?: number;
  estimatedMarginEur?: number;
  estimatedMarginPercentual?: number;
  startDate?: string;
  estimatedEndDate?: string;
  endDate?: string;
  client?: ClientType;
}

export enum WorkSortField {
  CODE = 'CODE',
  NAME = 'NAME',
  STATUS = 'STATUS',
  CONTRACTED_BUDGET = 'CONTRACTED_BUDGET',
  ESTIMATED_COST = 'ESTIMATED_COST',
  ESTIMATED_COST_MATERIALS = 'ESTIMATED_COST_MATERIALS',
  ESTIMATED_COST_LABOR = 'ESTIMATED_COST_LABOR',
  ESTIMATED_MARGIN_EUR = 'ESTIMATED_MARGIN_EUR',
  ESTIMATED_MARGIN_PERCENTUAL = 'ESTIMATED_MARGIN_PERCENTUAL',
  START_DATE = 'START_DATE',
  ESTIMATED_END_DATE = 'ESTIMATED_END_DATE',
  END_DATE = 'END_DATE',
  CLIENT_NAME = 'CLIENT_NAME',
}

export interface WorkFilters {
  code?: string;
  name?: string;
  status?: string;
  contractedBudgetMin?: number;
  contractedBudgetMax?: number;
  estimatedCostMin?: number;
  estimatedCostMax?: number;
  estimatedCostMaterialsMin?: number;
  estimatedCostMaterialsMax?: number;
  estimatedCostLaborMin?: number;
  estimatedCostLaborMax?: number;
  estimatedMarginEurMin?: number;
  estimatedMarginEurMax?: number;
  estimatedMarginPercentualMin?: number;
  estimatedMarginPercentualMax?: number;
  startDateMin?: string;
  startDateMax?: string;
  estimatedEndDateMin?: string;
  estimatedEndDateMax?: string;
  endDateMin?: string;
  endDateMax?: string;
  clientName?: string;

  sortBy?: WorkSortField;
  sortDirection?: SortDirection;
}
