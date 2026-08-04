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
                      :disabled="clientPaymentsTable.isEditing.value"
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
                    :disabled="clientPaymentsTable.isEditing.value || apiStatus.isLoading"
                    title="Limpar todos os filtros e ordenação"
                    aria-label="Limpar todos os filtros e ordenação"
                    @click="clearAllTableControls"
                  >
                    <FunnelX :size="16" />
                  </button>
                </th>
              </tr>
            </thead>
            <EntityTableBody :rows="clientPaymentsTable" :subrows="clientPaymentInvoicesTable" />
          </table>
        </div>

        <div class="actions">
          <button class="btn" :disabled="clientPaymentsTable.isEditing.value || apiStatus.isLoading" @click="add">
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
import Toast from '@/components/Toast.vue';
import TableColumnFilter from '@/components/TableColumnFilter.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { ClientFilters, ClientSortField, ClientType } from '@/types/client-type';
import clientApi from '@/services/client-api';
import EntityTableBody from '@/components/EntityTableBody.vue';
import { EntityTableBodyProps, TableRow } from '@/types/entity-configs';
import { apiError } from '@/services/api';
import { ClientPaymentFilters, ClientPaymentSortField, ClientPaymentType } from '@/types/client-payment-type';
import { ClientPayment } from '@/entities/client-payment';
import clientPaymentApi from '@/services/client-payment-api';
import { ClientInvoiceType } from '@/types/client-invoice-type';
import clientInvoiceApi from '@/services/client-invoice-api';
import { useTableFilters } from '@/composables/useTableFilters';
import { useConfigs } from '@/composables/useConfigs';
import { ClientPaymentInvoice } from '@/entities/client-payment-invoice';
import { ClientPaymentInvoiceType } from '@/types/client-payment-invoice-type';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });
const tableBody = ref<HTMLTableSectionElement | null>(null);

const status = useConfigs().statusOptions;
const clients = ref<ClientType[]>([]);
const clientInvoices = ref<ClientInvoiceType[]>([]);

const clientPayments = ref<ClientPaymentRow[]>([]);
const configs = computed(() => ClientPayment.getConfigs(clients.value));
const paymentInvoiceConfigs = computed(() => ClientPaymentInvoice.getConfigs(clientInvoices.value));

const isEditing = ref(false);

const clientPaymentsTable = computed<EntityTableBodyProps<ClientPaymentType, ClientPaymentSortField>>(() => ({
  rows: clientPayments.value,
  configs: configs.value,
  handlers: {
    edit: startEditing,
    delete: askDelete,
    save,
    discard,
    toggle: toggleRow,
  },
  rowIsActive: () => true,
  isValid: (payment) => ClientPayment.isValid(payment, configs.value),
  isEditing: isEditing,
}));

const clientPaymentInvoicesTable = computed(() => ({
  rows: fetchClientPaymentInvoiceRows,
  configs: paymentInvoiceConfigs.value,
  handlers: {
    edit: startEditingSubrow,
    save: saveSubrow,
    delete: () => {},
    discard: discardSubRow,
  },
  rowIsActive: () => true,
  isValid: (invoice: ClientPaymentInvoiceType) => ClientPaymentInvoice.isValid(invoice, paymentInvoiceConfigs.value),
  isEditing: isEditing,
}));

/*************************************************************************************************************** LOAD */

onMounted(async () => {
  await fetch();
  await fetchClients();
  await fetchClientInvoices();
});

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
      _expanded: false,
    }));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load client payments.');
  }
}

function fetchClientPaymentInvoiceRows(payment: ClientPaymentType): ClientPaymentInvoiceRow[] {
  if (!(payment as ClientPaymentType & { _paidInvoiceRows?: ClientPaymentInvoiceRow[] })._paidInvoiceRows) {
    (payment as ClientPaymentType & { _paidInvoiceRows?: ClientPaymentInvoiceRow[] })._paidInvoiceRows = (
      payment.paidInvoices ?? []
    ).map((paidInvoice, index) => ({
      entity: paidInvoice,
      _key: paidInvoice.id ?? `${payment.id}-${index}`,
      _isNew: false,
      _isEdited: false,
      _parentId: payment.id!,
    }));
  }

  return (payment as ClientPaymentType & { _paidInvoiceRows: ClientPaymentInvoiceRow[] })._paidInvoiceRows;
}

async function fetchClients() {
  const clientFilters: ClientFilters = {
    status: status.value.ACTIVE.code,
    sortBy: ClientSortField.CODE,
  };

  clients.value = await clientApi.searchClients(clientFilters);
}

async function fetchClientInvoices() {
  clientInvoices.value = await clientInvoiceApi.search();
}

/******************************************************************************************** ROW ACTIONS - MAIN ROWS */

interface ClientPaymentRow extends TableRow<ClientPaymentType> {}

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

  isEditing.value = false;
}

function toggleRow(row: ClientPaymentRow) {
  if (row._isNew || row._isEdited) {
    return;
  }

  row._expanded = !row._expanded;
}

/********************************************************************************************* ROW ACTIONS - SUB ROWS */

interface ClientPaymentInvoiceRow extends TableRow<ClientPaymentInvoiceType> {}

let _keyCounterSubrow = 0;
function nextKeySubRow(): string {
  return `row-${++_keyCounterSubrow}`;
}

function discardSubRow(row: ClientPaymentInvoiceRow) {
  if (row._isNew) {
    // TODO
  } else {
    row.entity = row._original!;
    row._isNew = false;
    row._isEdited = false;
  }

  isEditing.value = false;
}

/*************************************************************************************************************** EDIT */

function startEditing(row: ClientPaymentRow) {
  isEditing.value = true;

  row._isEdited = true;
  row._original = JSON.parse(JSON.stringify(row.entity));
}

function startEditingSubrow(row: ClientPaymentInvoiceRow) {
  isEditing.value = true;

  row._isEdited = true;
  row._original = JSON.parse(JSON.stringify(row.entity));
}

/**************************************************************************************************************** ADD */

async function add(): Promise<void> {
  isEditing.value = true;

  clientPayments.value.push({
    entity: {
      paymentDate: new Date().toISOString().split('T')[0],
      paidInvoices: [],
      _paidInvoiceRows: [],
    } as ClientPaymentType & { _paidInvoiceRows: ClientPaymentInvoiceRow[] },
    _key: nextKey(),
    _isNew: true,
    _isEdited: false,
    _expanded: true,
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
      await clientPaymentApi.add(row.entity);
    } else if (row._isEdited) {
      await clientPaymentApi.edit(row.entity);
    }

    await fetch();
    isEditing.value = false;

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

async function saveSubrow(row: ClientPaymentInvoiceRow): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const payment = clientPayments.value.find((clientPayment) => clientPayment.entity.id === row._parentId);

    if (!payment) {
      apiStatus.value = apiError(null, 'Failed to save client payment - Payment not found.');
      return;
    }

    const invoices = payment.entity.paidInvoices ?? [];

    if (row._isNew) {
      invoices.push(row.entity);
    } else if (row._isEdited) {
      const index = invoices.findIndex((invoice) => invoice.invoice?.id === row.entity.invoice?.id);

      if (index >= 0) {
        invoices[index] = row.entity;
      }
    }

    payment.entity.paidInvoices = invoices;

    await clientPaymentApi.edit(payment.entity);

    await fetch();
    isEditing.value = false;

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

const {
  filters: clientPaymentsFilter,
  hasActiveTableControls,
  setSort,
  applyFilterValues,
  clearFilterValues,
  clearAllTableControls,
} = useTableFilters<ClientPaymentFilters>(fetch);
</script>
<style scoped lang="scss"></style>
