import { StatusType } from '@/types/status-type';
import axiosClient from './api';
import { WorkerContractType } from '@/types/worker-contract-type';
import { WorkStatusType } from '@/types/work-status-type';
import { AttendanceCodeType } from '@/types/attendance-code-type';

class ConfigsApi {
  async getStatusValues(): Promise<StatusType[]> {
    const response = await axiosClient.get('/configs/status', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async getWorkerContractTypeValues(): Promise<WorkerContractType[]> {
    const response = await axiosClient.get('/configs/worker-contract-type', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async getWorkStatusValues(): Promise<WorkStatusType[]> {
    const response = await axiosClient.get('/configs/work-status', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async getAttendanceCodeValues(): Promise<AttendanceCodeType[]> {
    const response = await axiosClient.get('/configs/attendance-codes', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }
}

export default new ConfigsApi();
