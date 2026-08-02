<template>
  <div class="main-section">
    <div class="section-header">
      <span><FileInput :size="24" /></span>
      <h3>Pagamentos de Clientes</h3>

      <div class="page-nav">
        <RouterLink to="/" class="link"> Página Inicial </RouterLink>
        <ChevronRight :size="14" class="separator" />
        <RouterLink :to="{ path: '/', query: { tab: 'sales' } }" class="link"> Vendas </RouterLink>
      </div>
    </div>

    <div class="section">
      <div v-if="apiStatus.isLoading" class="loading-overlay">
        <div>
          <LoaderCircle :size="18" class="spinner" />
          A carregar pagamentos...
        </div>
      </div>
      <div class="section-body">
        <div class="table">
          <table>
            <colgroup>
              <col
                v-for="config in Object.values(configs)"
                :key="config.label"
                :style="config.styleConfig.columnStyle"
              />
              <col style="width: 50px" />
            </colgroup>
            <thead>
              <tr>
                <th v-for="config in Object.values(configs)" :key="config.label">
                  <div class="column-heading">
                    {{ config.label }}

                    <TableColumnFilter
                      :config="config"
                      :filters="clientPaymentsFilter"
                      :sort-by="clientPaymentsFilter.sortBy"
                      :sort-direction="clientPaymentsFilter.sortDirection"
                      :disabled="isEditing"
                      @sort="setSort"
                      @apply="applyFilterValues"
                      @clear="clearFilterValues"
                    />
                  </div>
                </th>
                <th>
                  <button
                    v-if="hasActiveTableControls"
                    class="clear-table-controls"
                    :disabled="isEditing || apiStatus.isLoading"
                    title="Limpar todos os filtros e ordenação"
                    aria-label="Limpar todos os filtros e ordenação"
                    @click="clearAllTableControls"
                  >
                    <FunnelX :size="16" />
                  </button>
                </th>
              </tr>
            </thead>
            <EntityTableBody
              :rows="clientPayments"
              :configs="configs"
              :row-is-active="() => true"
              :is-valid="(clientPayment) => ClientPayment.isValid(clientPayment, configs)"
              :is-editing="isEditing"
              @row-edit="startEditing"
              @row-delete="askDelete"
              @row-save="save"
              @row-discard="discard"
            >
            </EntityTableBody>
          </table>
        </div>

        <div class="actions">
          <button class="btn" :disabled="isEditing || apiStatus.isLoading" @click="add">
            <Plus :size="18" /> Adicionar Pagamento
          </button>
        </div>

        <Toast
          v-if="apiStatus.message"
          :message="apiStatus.message"
          :type="apiStatus.isSuccess ? 'success' : 'error'"
        />
      </div>
    </div>
  </div>

  <!-- delete dialog-->
  <ConfirmDialog
    v-model="showDeleteDialog"
    title="Eliminar pagamento"
    :message="[
      `${clientPaymentToDelete?.entity.documentId}`,
      'Tem a certeza que quer eliminar definitivamente este pagamento?',
    ]"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { ApiResponseStatus } from '@/types/api-response-status';
import { ChevronRight, FileInput, Plus, LoaderCircle, FunnelX } from 'lucide-vue-next';
import Toast from '@/composables/Toast.vue';
import { SortDirection } from '@/types/sort-direction';
import TableColumnFilter from '@/components/TableColumnFilter.vue';
import ConfirmDialog from '@/composables/ConfirmDialog.vue';
import { ClientFilters, ClientSortField, ClientType } from '@/types/client-type';
import clientApi from '@/services/client-api';
import EntityTableBody from '@/composables/EntityTableBody.vue';
import { TableRow } from '@/types/entity-configs';
import { StatusEnum } from '@/types/status-enum';
import configsApi from '@/services/configs-api';
import { Client } from '@/entities/client';
import { apiError } from '@/services/api';
import { ClientPaymentFilters, ClientPaymentSortField, ClientPaymentType } from '@/types/client-payment-type';
import { ClientPayment } from '@/entities/client-payment';
import { ClientPaymentTypeEnum } from '@/types/client-payment-type-enum';
import { PaymentMethodEnum } from '@/types/payment-method-enum';
import clientPaymentApi from '@/services/client-payment-api';
import { ClientInvoice } from '@/entities/client-invoice';
import { ClientInvoiceType } from '@/types/client-invoice-type';
import { Work } from '@/entities/work';
import { WorkStatusEnum } from '@/types/work-status-enum';
import { WorkType } from '@/types/work-type';
import workApi from '@/services/work-api';
import clientInvoiceApi from '@/services/client-invoice-api';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });
const tableBody = ref<HTMLTableSectionElement | null>(null);

const clientPaymentType = ref<{ [k: string]: ClientPaymentTypeEnum }>({});
const status = ref<{ [k: string]: StatusEnum }>({});
const paymentMethod = ref<{ [k: string]: PaymentMethodEnum }>({});

const clients = ref<ClientType[]>([]);
const clientConfigs = computed(() => Client.getConfigs(status.value));

const works = ref<WorkType[]>([]);
const workStatus = ref<{ [k: string]: WorkStatusEnum }>({});
const workConfigsConfigs = computed(() =>
  Work.getConfigs(status.value, workStatus.value, clients.value, clientConfigs.value),
);

const clientInvoices = ref<ClientInvoiceType[]>([]);
const clientInvoiceConfigs = computed(() =>
  ClientInvoice.getConfigs(status.value, clients.value, clientConfigs.value, works.value, workConfigsConfigs.value),
);

const clientPayments = ref<ClientPaymentRow[]>([]);
const configs = computed(() =>
  ClientPayment.getConfigs(
    clientPaymentType.value,
    status.value,
    clients.value,
    clientConfigs.value,
    clientInvoices.value,
    clientInvoiceConfigs.value,
    paymentMethod.value,
  ),
);

/*************************************************************************************************************** LOAD */

onMounted(async () => {
  await loadConfigs();
  await fetch();
  await fetchClients();
  await fetchWorks();
  await fetchClientInvoices();
});

async function loadConfigs() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotClientPaymentType = await configsApi.getClientPaymentTypeValues();
    clientPaymentType.value = Object.fromEntries(gotClientPaymentType.map((e) => [e.code, e]));

    const gotStatusValues = await configsApi.getStatusValues();
    status.value = Object.fromEntries(gotStatusValues.map((e) => [e.code, e]));

    const gotPaymentMethodValues = await configsApi.getPaymentMethodValues();
    paymentMethod.value = Object.fromEntries(gotPaymentMethodValues.map((e) => [e.code, e]));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load config values.');
  }
}

async function fetch() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotClientPayments = await clientPaymentApi.search(clientPaymentsFilter.value);

    clientPayments.value = gotClientPayments.map((clientPayment) => ({
      entity: {
        ...clientPayment,
      },
      _key: clientPayment.code ?? nextKey(),
      _isNew: false,
      _isEdited: false,
    }));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load client payments.');
  }
}

async function fetchClients() {
  const clientFilters: ClientFilters = {
    status: status.value.ACTIVE.code,
    sortBy: ClientSortField.CODE,
  };

  clients.value = await clientApi.searchClients(clientFilters);
}

async function fetchWorks() {
  works.value = await workApi.searchWorks();
}

async function fetchClientInvoices() {
  clientInvoices.value = await clientInvoiceApi.search();
}

/******************************************************************************************************** ROW ACTIONS */

interface ClientPaymentRow extends TableRow<ClientPaymentType> {
  entity: ClientPaymentType;
  _key: string;
  _isNew: boolean;
  _isEdited: boolean;
  _original?: ClientPaymentType;
}

const isEditing = computed(() => clientPayments.value.some((row) => row._isNew || row._isEdited));
let _keyCounter = 0;

function nextKey(): string {
  return `row-${++_keyCounter}`;
}

function discard(row: ClientPaymentRow) {
  if (row._isNew) {
    clientPayments.value = clientPayments.value.filter((w) => w._key !== row._key);
  } else {
    row.entity = row._original!;
    row._isNew = false;
    row._isEdited = false;
  }
}

/*************************************************************************************************************** EDIT */

function startEditing(row: ClientPaymentRow) {
  row._isEdited = true;
  row._original = JSON.parse(JSON.stringify(row.entity));
}

/**************************************************************************************************************** ADD */

async function add(): Promise<void> {
  clientPayments.value.push({
    entity: {
      paymentDate: new Date().toISOString().split('T')[0],
    },
    _key: nextKey(),
    _isNew: true,
    _isEdited: false,
  });

  await nextTick();

  const lastRow = tableBody.value?.querySelector('tr:last-child');
  lastRow?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
  });

  (lastRow?.querySelector('input') as HTMLInputElement)?.focus();
}

/*************************************************************************************************************** SAVE */

async function save(row: ClientPaymentRow): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (row._isNew) {
      console.log('Adding new client payment:', JSON.stringify(row.entity));
      await clientPaymentApi.add(row.entity);
    } else if (row._isEdited) {
      await clientPaymentApi.edit(row.entity);
    }

    await fetch();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client payment saved successfully.',
    };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to save client payment.');
  }
}

/************************************************************************************************************* DELETE */

const showDeleteDialog = ref(false);
const clientPaymentToDelete = ref<ClientPaymentRow | null>(null);

function askDelete(row: ClientPaymentRow) {
  clientPaymentToDelete.value = row;
  showDeleteDialog.value = true;
}

async function confirmDelete(): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (!clientPaymentToDelete.value?.entity.id) {
      return;
    }

    await clientPaymentApi.delete(clientPaymentToDelete.value.entity.id);
    await fetch();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client payment deleted successfully.',
    };

    showDeleteDialog.value = false;
    clientPaymentToDelete.value = null;
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to delete client payment.');
  }
}

/************************************************************************************************************ FILTERS */

const clientPaymentsFilter = ref<ClientPaymentFilters>({});

const hasActiveTableControls = computed(() =>
  Object.values(clientPaymentsFilter.value).some((value) => value !== undefined && value !== null && value !== ''),
);

function setSort(event: { column: ClientPaymentSortField; direction: SortDirection | undefined }): void {
  clientPaymentsFilter.value = {
    ...clientPaymentsFilter.value,
    sortBy: event.direction ? event.column : undefined,
    sortDirection: event.direction,
  };

  fetch();
}

function applyFilterValues(values: Record<string, unknown>): void {
  clientPaymentsFilter.value = { ...clientPaymentsFilter.value, ...(values as Partial<ClientPaymentFilters>) };

  fetch();
}

function clearFilterValues(values: Record<string, unknown>): void {
  clientPaymentsFilter.value = { ...clientPaymentsFilter.value, ...(values as Partial<ClientPaymentFilters>) };

  fetch();
}

function clearAllTableControls(): void {
  clientPaymentsFilter.value = {};

  void fetch();
}
</script>
<style scoped lang="scss"></style>
