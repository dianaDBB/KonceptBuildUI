import { ClientType } from './client-type';

export interface SalesDashboardType {
  totalBilled?: number;
  totalReceived?: number;
  totalDue?: number;
  clientsStatistics?: SalesDashboardRowType[];
}

export interface SalesDashboardRowType {
  client?: ClientType;
  totalBilled?: number;
  totalReceived?: number;
  totalDue?: number;
  totalOverdue?: number;
  status?: string;
}
