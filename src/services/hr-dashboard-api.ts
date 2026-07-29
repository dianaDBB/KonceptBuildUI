import axiosClient from './api';
import { HrDashboardType } from '@/types/hr-dashboard-type';

class HrDashboardApi {
  async getHrDashboard(year?: number, month?: number): Promise<HrDashboardType> {
    const response = await axiosClient.get('/hr/', {
      params: { year, month },
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }
}

export default new HrDashboardApi();
