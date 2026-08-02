import { StatusEnum } from '@/types/status-enum';
import axiosClient from './api';
import { WorkerContractTypeEnum } from '@/types/worker-contract-type-enum';
import { WorkStatusEnum } from '@/types/work-status-enum';
import { AttendanceCodeEnum } from '@/types/attendance-code-enum';
import { PaymentMethodEnum } from '@/types/payment-method-enum';
import { ClientPaymentTypeEnum } from '@/types/client-payment-type-enum';

class ConfigsApi {
  async getStatusValues(): Promise<StatusEnum[]> {
    const response = await axiosClient.get('/configs/status', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async getWorkerContractTypeValues(): Promise<WorkerContractTypeEnum[]> {
    const response = await axiosClient.get('/configs/worker-contract-type', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async getWorkStatusValues(): Promise<WorkStatusEnum[]> {
    const response = await axiosClient.get('/configs/work-status', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async getAttendanceCodeValues(): Promise<AttendanceCodeEnum[]> {
    const response = await axiosClient.get('/configs/attendance-codes', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async getPaymentMethodValues(): Promise<PaymentMethodEnum[]> {
    const response = await axiosClient.get('/configs/payment-method', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }

  async getClientPaymentTypeValues(): Promise<ClientPaymentTypeEnum[]> {
    const response = await axiosClient.get('/configs/client-payment-type', {
      headers: { Accept: 'application/json' },
    });

    return response.data;
  }
}

export default new ConfigsApi();
