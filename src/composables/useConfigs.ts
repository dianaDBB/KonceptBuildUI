import { ref } from 'vue';
import configsApi from '@/services/configs-api';
import { PaymentMethodEnum } from '@/types/payment-method-enum';
import { WorkStatusEnum } from '@/types/work-status-enum';
import { WorkerContractTypeEnum } from '@/types/worker-contract-type-enum';
import { StatusEnum } from '@/types/status-enum';

const workerContractTypeOptions = ref<Record<string, WorkerContractTypeEnum>>({});
const workStatusOptions = ref<Record<string, WorkStatusEnum>>({});
const statusOptions = ref<Record<string, StatusEnum>>({});
const paymentMethodOptions = ref<Record<string, PaymentMethodEnum>>({});
const clientPaymentTypeOptions = ref<Record<string, WorkerContractTypeEnum>>({});
const attendecCodeOptions = ref<Record<string, WorkerContractTypeEnum>>({});

const loaded = ref(false);

export async function loadConfigs() {
  if (loaded.value) return;

  const workerContractTypesValues = await configsApi.getWorkerContractTypeValues();
  workerContractTypeOptions.value = Object.fromEntries(workerContractTypesValues.map((e) => [e.code, e]));

  const statususValues = await configsApi.getStatusValues();
  statusOptions.value = Object.fromEntries(statususValues.map((e) => [e.code, e]));

  const workStatususValues = await configsApi.getWorkStatusValues();
  workStatusOptions.value = Object.fromEntries(workStatususValues.map((e) => [e.code, e]));

  const paymentMethodsValues = await configsApi.getPaymentMethodValues();
  paymentMethodOptions.value = Object.fromEntries(paymentMethodsValues.map((e) => [e.code, e]));

  const clientPaymentTypesValues = await configsApi.getClientPaymentTypeValues();
  clientPaymentTypeOptions.value = Object.fromEntries(clientPaymentTypesValues.map((e) => [e.code, e]));

  const attendecCodesValues = await configsApi.getAttendanceCodeValues();
  attendecCodeOptions.value = Object.fromEntries(attendecCodesValues.map((e) => [e.code, e]));

  loaded.value = true;
}

export function useConfigs() {
  return {
    workerContractTypeOptions,
    workStatusOptions,
    statusOptions,
    paymentMethodOptions,
    clientPaymentTypeOptions,
    attendecCodeOptions,
    loadConfigs,
  };
}
