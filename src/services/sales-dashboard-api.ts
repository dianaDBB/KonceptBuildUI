import { SalesDashboardType } from '@/types/sales-dashboard-type';
import axiosClient from './api';

class SalesDashboardApi {
  async getSalesDashboard(): Promise<SalesDashboardType> {
    const response = await axiosClient.get('/sales/', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }
}

export default new SalesDashboardApi();
