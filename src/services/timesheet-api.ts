import axiosClient from './api';
import { MonthlyTimesheetType } from '@/types/monthly-timesheet-type';

class TimesheetApi {
  async getMonthlyTimesheet(year: number, month: number): Promise<MonthlyTimesheetType> {
    const response = await axiosClient.get('/timesheet/monthly', {
      params: {
        year,
        month,
      },
      headers: {
        Accept: 'application/json',
      },
    });

    return response.data;
  }

  async saveMonthlyTimesheet(timesheet: MonthlyTimesheetType): Promise<void> {
    await axiosClient.put('/timesheet/monthly', timesheet, {
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    });
  }
}

export default new TimesheetApi();
