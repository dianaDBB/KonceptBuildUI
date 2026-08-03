import { SortDirection } from './sort-direction';
import { ClientType } from './client-type';
import { EntityType, RangeFilter } from './entity-configs';

export interface WorkType extends EntityType {
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
  CLIENT = 'CLIENT',
}

export interface WorkFilters {
  code?: string;
  name?: string;
  status?: string;
  contractedBudget?: RangeFilter;
  estimatedCost?: RangeFilter;
  estimatedCostMaterials?: RangeFilter;
  estimatedCostLabor?: RangeFilter;
  estimatedMarginEur?: RangeFilter;
  estimatedMarginPercentual?: RangeFilter;
  startDate?: RangeFilter;
  estimatedEndDate?: RangeFilter;
  endDate?: RangeFilter;
  client?: string;

  sortBy?: WorkSortField;
  sortDirection?: SortDirection;
}
