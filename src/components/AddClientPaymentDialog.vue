<template>
  <BaseDialog v-model="isOpen">
    <h2>Adicionar pagamento para a fatura {{ invoice?.docNumber }}</h2>

    <form class="dialog-form" @submit.prevent="handleSave">
      <div class="form-group">
        <label>Tipo</label>
        <SelectInput
          :value="form.type!"
          :is-invalid="!form.type"
          :is-disabled="false"
          :select-options="Object.values(paymentTypes)"
          @update:value="form.type = $event"
        />
      </div>

      <div class="form-group">
        <label>Nº Documento Relacionado</label>
        <TextInput :value="invoice!.docNumber!" :is-disabled="true" :is-invalid="false" />
      </div>

      <div class="form-group">
        <label>Data Pagamento</label>
        <DateInput
          :value="form.paymentDate!"
          :is-invalid="!form.paymentDate"
          :is-disabled="isLoading"
          @update:value="form.paymentDate = $event"
        />
      </div>

      <div class="form-group">
        <label>Valor Pago (€)</label>
        <MoneyInput
          :entity="form"
          :value="form.paidValue!"
          :is-invalid="!form.paidValue"
          :is-disabled="isLoading"
          field-key="paidValue"
        />
      </div>

      <div class="form-group">
        <label>Método Pagamento</label>
        <SelectInput
          :value="form.paymentMethod!"
          :is-invalid="!form.paymentMethod"
          :select-options="Object.values(paymentMethods)"
          :is-disabled="isLoading"
          @update:value="form.paymentMethod = $event"
        />
      </div>

      <div class="form-group">
        <label>Notas</label>
        <TextInput
          :value="form.notes!"
          :is-disabled="isLoading"
          :is-invalid="false"
          @update:value="form.notes = $event"
        />
      </div>
    </form>

    <div class="actions">
      <button class="btn" :disabled="isLoading" @click="isOpen = false">
        <Delete :size="18" />
        Cancelar
      </button>

      <button class="btn" :disabled="!isFormValid || isLoading" @click="handleSave">
        <Save :size="18" />
        Guardar
      </button>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from 'vue';
import { Delete, Save } from 'lucide-vue-next';

import BaseDialog from '@/components/BaseDialog.vue';
import TextInput from '@/components/inputs/TextInput.vue';
import DateInput from '@/components/inputs/DateInput.vue';
import MoneyInput from '@/components/inputs/MoneyInput.vue';
import SelectInput from '@/components/inputs/SelectInput.vue';

import { ClientInvoiceType } from '@/types/client-invoice-type';
import { ClientPaymentType } from '@/types/client-payment-type';
import { ClientPaymentTypeEnum } from '@/types/client-payment-type-enum';
import { PaymentMethodEnum } from '@/types/payment-method-enum';

import configsApi from '@/services/configs-api';
import { ApiResponseStatus } from '@/types/api-response-status.ts';
import { apiError } from '@/services/api';

const props = defineProps<{
  modelValue: boolean;
  invoice: ClientInvoiceType | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [boolean];
  save: [ClientPaymentType];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isLoading = ref(false);
const paymentTypes = ref<Record<string, ClientPaymentTypeEnum>>({});
const paymentMethods = ref<Record<string, PaymentMethodEnum>>({});

const form = ref<Partial<ClientPaymentType>>({});

const isFormValid = computed(() => {
  const { type, paymentDate, paidValue, paymentMethod } = form.value;
  return !!(type && paymentDate && paidValue && paymentMethod);
});

watch(
  () => props.invoice,
  (newInvoice) => {
    resetForm();
    if (!newInvoice) {
      return;
    }

    form.value = {
      type: undefined,
      invoices: [newInvoice],
      client: newInvoice.client,
      paymentDate: new Date().toISOString().split('T')[0],
      paidValue: newInvoice.totalValue,
      paymentMethod: undefined,
      notes: undefined,
    };
  },
  { deep: true },
);

onMounted(async () => {
  await loadConfigs();
});

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

async function loadConfigs() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };
  try {
    const gotClientPaymentType = await configsApi.getClientPaymentTypeValues();
    paymentTypes.value = Object.fromEntries(gotClientPaymentType.map((e) => [e.code, e]));

    const gotPaymentMethods = await configsApi.getPaymentMethodValues();
    paymentMethods.value = Object.fromEntries(gotPaymentMethods.map((e) => [e.code, e]));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load config values.');
  }
}

function resetForm() {
  form.value = {};
}

function handleSave() {
  if (!isFormValid.value) return;

  emit('save', form.value as ClientPaymentType);
}
</script>
