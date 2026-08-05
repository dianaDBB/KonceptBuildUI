<template>
  <BaseDialog v-model="isOpen">
    <h2>Adicionar Pagamento</h2>

    <form class="dialog-form" @submit.prevent="handleSave">
      <div class="form-group">
        <label>{{ configs.type.label }}</label>
        <SelectInput
          :value="clientPayment.type!"
          :is-invalid="configs.type.styleConfig.isInvalid(clientPayment)"
          :is-disabled="configs.type.styleConfig.showDisabled(clientPayment)"
          :select-options="configs.type.selectConfig!.options"
          @update:value="clientPayment.type = $event"
        />
      </div>

      <div class="form-group">
        <label>{{ configs.client.label }}</label>
        <SearchSelectInput
          :value="clientPayment.client as any"
          :search-select-options="clients"
          :config="clientConfig"
          :is-invalid="configs.client.styleConfig.isInvalid(clientPayment)"
          :is-disabled="configs.client.styleConfig.showDisabled(clientPayment)"
          @update:value="onClientChange($event as any)"
        />
      </div>

      <div class="form-group">
        <label>{{ configs.paymentDate.label }}</label>
        <DateInput
          :value="clientPayment.paymentDate!"
          :is-invalid="configs.paymentDate.styleConfig.isInvalid(clientPayment)"
          :is-disabled="configs.paymentDate.styleConfig.showDisabled(clientPayment)"
          @update:value="clientPayment.paymentDate = $event"
        />
      </div>

      <div class="form-group">
        <label>{{ configs.paymentMethod.label }}</label>
        <SelectInput
          :value="clientPayment.paymentMethod!"
          :is-invalid="configs.paymentMethod.styleConfig.isInvalid(clientPayment)"
          :is-disabled="configs.paymentMethod.styleConfig.showDisabled(clientPayment)"
          :select-options="configs.paymentMethod.selectConfig!.options"
          @update:value="clientPayment.paymentMethod = $event"
        />
      </div>

      <div class="form-group">
        <label>{{ configs.notes.label }}</label>
        <TextInput
          :value="clientPayment.notes!"
          :is-invalid="false"
          :is-disabled="configs.notes.styleConfig.showDisabled(clientPayment)"
          @update:value="clientPayment.notes = $event"
        />
      </div>

      <div class="form-section">
        <div class="section-header">
          <h4>{{ configs.paidInvoices.label }}</h4>
        </div>

        <div v-if="clientPayment.paidInvoices?.length" class="invoices-list">
          <div v-for="(invoice, index) in clientPayment.paidInvoices" :key="index" class="invoice-item">
            <div class="invoice-fields">
              <div class="form-group">
                <label>Fatura *</label>
                <SearchSelectInput
                  :value="invoice.invoice as any"
                  :search-select-options="getAvailableInvoices(invoice)"
                  :config="invoiceConfig"
                  :is-invalid="clientPayment.client != undefined && !invoice.invoice"
                  :is-disabled="isLoading || !clientPayment.client"
                  @update:value="invoice.invoice = $event as any"
                />
              </div>

              <div class="form-group">
                <label>Valor Pago *</label>
                <MoneyInput
                  :entity="invoice"
                  :value="invoice.paidValue"
                  field-key="paidValue"
                  :is-invalid="clientPayment.client != undefined && !invoice.paidValue"
                  :is-disabled="isLoading || !clientPayment.client"
                  @update:value="invoice.paidValue = $event"
                />
              </div>

              <button
                type="button"
                title="Remover"
                class="clear-table-controls"
                :disabled="isLoading || !clientPayment.client"
                @click="removeInvoiceItem(index)"
              >
                <Trash2 :size="16" />
              </button>
            </div>
          </div>
        </div>

        <div v-else class="empty-state">Adicione pelo menos uma fatura</div>

        <div class="actions">
          <button type="button" class="btn" @click="addInvoiceItem" :disabled="isLoading || !clientPayment.client">
            <Plus :size="16" /> Adicionar Fatura
          </button>
        </div>
      </div>

      <div class="form-group">
        <label>{{ configs.totalPaidValue.label }}</label>
        <MoneyInput
          :entity="clientPayment"
          :value="totalPaidValue"
          field-key="totalPaidValue"
          :is-invalid="false"
          :is-disabled="true"
        />
      </div>
    </form>

    <div class="actions">
      <button type="button" class="btn" :disabled="isLoading" @click="handleCancel">
        <Delete :size="18" />
        Cancelar
      </button>

      <button type="button" class="btn" :disabled="!isFormValid || isLoading" @click="handleSave">
        <Save :size="18" />
        Guardar
      </button>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { Delete, Save, Plus, Trash2 } from 'lucide-vue-next';

import BaseDialog from '@/components/BaseDialog.vue';
import DateInput from '@/components/inputs/DateInput.vue';
import MoneyInput from '@/components/inputs/MoneyInput.vue';
import SelectInput from '@/components/inputs/SelectInput.vue';
import SearchSelectInput from '@/components/inputs/SearchSelectInput.vue';
import TextInput from '@/components/inputs/TextInput.vue';

import { ClientPaymentSortField, ClientPaymentType } from '@/types/client-payment-type';
import { ClientType } from '@/types/client-type';
import { ClientInvoiceType } from '@/types/client-invoice-type';
import { Configs } from '@/types/entity-configs';
import { ClientPaymentInvoiceType } from '@/types/client-payment-invoice-type';

const props = defineProps<{
  modelValue: boolean;
  configs: Configs<ClientPaymentSortField, ClientPaymentType>;
  clients: ClientType[];
  clientInvoices: ClientInvoiceType[];
}>();

const invoiceConfig = {
  searchSelectConfig: {
    selected: (invoice: ClientInvoiceType) => `${invoice.docNumber}`,
    options: () => [],
    optionLines: (invoice: ClientInvoiceType) => [invoice.docNumber!, invoice.description || ''],
    filter: (invoice: ClientInvoiceType) => `${invoice.docNumber} ${invoice.description}`,
  },
} as any;

const clientConfig = {
  searchSelectConfig: {
    selected: (client: ClientType) => `${client.code!}\n${client.companyName!}`,
    options: () => props.clients,
    optionLines: (client: ClientType) => [client.code!, client.companyName!, client.nif!],
    filter: (client: ClientType) => `${client.companyName} ${client.nif} ${client.code}`,
  },
} as any;

/*************************************************************************************************************** OPEN */

const emit = defineEmits<{
  'update:modelValue': [boolean];
  save: [ClientPaymentType];
}>();

const isOpen = computed({
  get: () => props.modelValue,
  set: (value) => emit('update:modelValue', value),
});

const isLoading = ref(false);

watch(isOpen, (open) => {
  if (!open) {
    resetForm();
  }
});

const clientPayment = ref<ClientPaymentType>({
  type: 'PAYMENT',
  paymentDate: new Date().toISOString().split('T')[0],
  paidInvoices: [{}],
});

/******************************************************************************************************* CALCULATIONS */

const isFormValid = computed(() => {
  return clientPayment;
});

const totalPaidValue = computed(() => {
  return clientPayment.value.paidInvoices?.reduce((sum, inv) => sum + (inv.paidValue || 0), 0) || 0;
});

function onClientChange(client: ClientType) {
  clientPayment.value.client = client;
  clientPayment.value.paidInvoices = [{}];
}

function getAvailableInvoices(currentInvoice?: ClientPaymentInvoiceType) {
  if (!clientPayment.value.client?.id) {
    return [];
  }

  const selectedInvoiceIds = new Set(
    clientPayment.value.paidInvoices
      ?.filter((inv) => inv !== currentInvoice)
      .map((inv) => inv.invoice?.id)
      .filter(Boolean),
  );

  return props.clientInvoices.filter(
    (invoice) => invoice.client?.id === clientPayment.value.client?.id && !selectedInvoiceIds.has(invoice.id),
  );
}

function addInvoiceItem() {
  if (!clientPayment.value.paidInvoices) {
    clientPayment.value.paidInvoices = [];
  }
  clientPayment.value.paidInvoices.push({});
}

function removeInvoiceItem(index: number) {
  clientPayment.value.paidInvoices?.splice(index, 1);
}

/*************************************************************************************************************** SAVE */

function handleSave() {
  if (!isFormValid.value) {
    return;
  }

  const payment: ClientPaymentType = {
    type: clientPayment.value.type!,
    client: clientPayment.value.client!,
    paymentDate: clientPayment.value.paymentDate,
    paymentMethod: clientPayment.value.paymentMethod!,
    notes: clientPayment.value.notes,
    totalPaidValue: totalPaidValue.value,
    paidInvoices: clientPayment.value.paidInvoices,
  };

  emit('save', payment);

  resetForm();
  isOpen.value = false;
}

function resetForm() {
  clientPayment.value = {
    type: 'PAYMENT',
    paymentDate: new Date().toISOString().split('T')[0],
    paidInvoices: [{}],
  };
}

/************************************************************************************************************* CANCEL */

function handleCancel() {
  resetForm();
  isOpen.value = false;
}
</script>

<style scoped lang="scss">
.invoices-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.invoice-fields {
  display: grid;
  grid-template-columns: 1fr 150px 40px;
  gap: 12px;
  align-items: flex-end;
}
</style>
