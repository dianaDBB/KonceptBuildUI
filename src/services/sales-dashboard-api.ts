import { SalesDashboardType } from '@/types/sales-dashboard-type';
import axiosClient from './api';
import { UUID } from 'node:crypto';
import { SalesClientReportType } from '@/types/sales-client-report-type';

class SalesDashboardApi {
  async getSalesDashboard(): Promise<SalesDashboardType> {
    const response = await axiosClient.get('/sales/', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async getSalesClientReport(clientId: UUID): Promise<SalesClientReportType> {
    const response = await axiosClient.get(`/sales/client-report?clientId=${clientId}`, {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }
}

export default new SalesDashboardApi();
