<template>
  <BaseDialog v-model="isOpen">
    <h2>Gerar pagamento para a fatura {{ invoice?.docNumber }}</h2>

    <form class="dialog-form" @submit.prevent="handleSave">
      <div class="form-group">
        <label>Tipo</label>
        <SelectInput
          :value="form.type!"
          :is-invalid="!form.type"
          :is-disabled="true"
          :select-options="Object.values(paymentTypes)"
          @update:value="form.type = $event"
        />
      </div>

      <div class="form-group">
        <label>Nº Documento Relacionado</label>
        <TextInput :value="invoice!.docNumber!" :is-disabled="true" :is-invalid="false" />
      </div>

      <div class="form-group">
        <label>Data Transação</label>
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
          :value="form.paidValue"
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
import { computed, ref, watch } from 'vue';
import { Delete, Save } from 'lucide-vue-next';

import BaseDialog from '@/components/BaseDialog.vue';
import DateInput from '@/components/inputs/DateInput.vue';
import MoneyInput from '@/components/inputs/MoneyInput.vue';
import SelectInput from '@/components/inputs/SelectInput.vue';
import TextInput from '@/components/inputs/TextInput.vue';

import { useConfigs } from '@/composables/useConfigs';

import { ClientInvoiceType } from '@/types/client-invoice-type';
import { ClientPaymentType } from '@/types/client-payment-type';

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

const paymentTypes = useConfigs().clientPaymentTypeOptions;
const paymentMethods = useConfigs().paymentMethodOptions;

const form = ref({
  type: undefined as ClientPaymentType['type'] | undefined,
  client: undefined as ClientPaymentType['client'] | undefined,
  paymentDate: '',
  paidValue: undefined as number | undefined,
  paymentMethod: undefined as ClientPaymentType['paymentMethod'] | undefined,
  notes: '',
});

const isFormValid = computed(() => {
  return !!(form.value.type && form.value.paymentDate && form.value.paymentMethod && form.value.paidValue);
});

watch(
  () => props.invoice,
  (invoice) => {
    if (!invoice) {
      resetForm();
      return;
    }

    form.value = {
      type: 'PAYMENT',
      client: invoice.client,
      paymentDate: new Date().toISOString().split('T')[0],
      paidValue: invoice.totalValue,
      paymentMethod: undefined,
      notes: '',
    };
  },
  { immediate: true },
);

function resetForm() {
  form.value = {
    type: undefined,
    client: undefined,
    paymentDate: '',
    paidValue: undefined,
    paymentMethod: undefined,
    notes: '',
  };
}

function handleSave() {
  if (!isFormValid.value || !props.invoice) {
    return;
  }

  const payment: ClientPaymentType = {
    type: form.value.type!,
    client: form.value.client!,
    paymentDate: form.value.paymentDate,
    paymentMethod: form.value.paymentMethod!,
    notes: form.value.notes,
    totalPaidValue: form.value.paidValue!,
    paidInvoices: [
      {
        invoice: props.invoice,
        paidValue: form.value.paidValue!,
      },
    ],
  };

  emit('save', payment);
}
</script>
