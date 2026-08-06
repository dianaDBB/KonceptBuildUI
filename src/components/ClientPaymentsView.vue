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
              <col style="width: 120px" />
            </colgroup>
            <thead>
              <tr>
                <th v-for="config in Object.values(configs)" :key="config.label">
                  <div class="column-heading">
                    {{ config.label }}

                    <TableColumnFilter
                      :config="config"
                      :filters="paymentsFilter"
                      :sort-by="paymentsFilter.sortBy"
                      :sort-direction="paymentsFilter.sortDirection"
                      :disabled="paymentsTable.isEditing.value"
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
                    :disabled="paymentsTable.isEditing.value || apiStatus.isLoading"
                    title="Limpar todos os filtros e ordenação"
                    aria-label="Limpar todos os filtros e ordenação"
                    @click="clearAllTableControls"
                  >
                    <FunnelX :size="16" />
                  </button>
                </th>
              </tr>
            </thead>
            <EntityTableBody :rows="paymentsTable" :subrows="paymentInvoicesTable">
              <template #row-actions="{ row, isSubrow }">
                <template v-if="!isSubrow">
                  <button title="Eliminar pagamento" :disabled="paymentsTable.isEditing.value" @click="askDelete(row)">
                    <Trash2 :size="16" />
                  </button>
                  <button title="Editar pagamento" :disabled="paymentsTable.isEditing.value" @click="startEditing(row)">
                    <Pencil :size="16" />
                  </button>
                  <button
                    title="Adicionar pagamento de fatura"
                    :disabled="paymentsTable.isEditing.value"
                    @click="addSubrow(row)"
                  >
                    <Plus :size="16" />
                  </button>
                </template>
                <template v-else>
                  <button
                    title="Eliminar pagamento de fatura"
                    :disabled="paymentsTable.isEditing.value"
                    @click="askDeleteSubrow(row)"
                  >
                    <Trash2 :size="16" />
                  </button>
                  <button
                    title="Editar pagamento de fatura"
                    :disabled="paymentsTable.isEditing.value"
                    @click="startEditingSubrow(row)"
                  >
                    <Pencil :size="16" />
                  </button>
                </template>
              </template>
            </EntityTableBody>
          </table>
        </div>

        <div class="actions">
          <button
            class="btn"
            :disabled="paymentsTable.isEditing.value || apiStatus.isLoading"
            @click="startAddingClientPayment()"
          >
            <Plus :size="18" /> Adicionar Pagamento / Reembolso
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

  <!-- add payment -->
  <AddClientPaymentDialog
    v-model="showAddClientPaymentDialog"
    :configs="configs"
    :clients="clients"
    :invoices="invoices"
    @save="saveClientPayment"
  />

  <!-- delete dialog-->
  <ConfirmDialog
    v-model="showDeleteDialog"
    title="Eliminar pagamento"
    :message="[
      `${paymentToDelete?.entity.documentId}`,
      'Tem a certeza que quer eliminar definitivamente este pagamento?',
    ]"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="confirmDelete"
  />

  <!-- delete dialog subrow-->
  <ConfirmDialog
    v-model="showDeleteDialogSubrow"
    title="Eliminar pagamento"
    :message="[
      `${paymentInvoiceToDelete?.entity.invoice?.docNumber}`,
      'Tem a certeza que quer eliminar definitivamente o pagamento desta fatura?',
    ]"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="confirmDeleteSubrow"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { ApiResponseStatus } from '@/types/api-response-status';
import { ChevronRight, FileInput, Plus, LoaderCircle, FunnelX, Trash2, Pencil } from 'lucide-vue-next';
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
import AddClientPaymentDialog from './AddClientPaymentDialog.vue';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const status = useConfigs().statusOptions;
const clients = ref<ClientType[]>([]);
const invoices = ref<ClientInvoiceType[]>([]);

const payments = ref<ClientPaymentRow[]>([]);
const configs = computed(() => ClientPayment.getConfigs(clients.value));
const paymentInvoiceConfigs = computed(() => ClientPaymentInvoice.getConfigs(invoices.value));

const isEditing = ref(false);

const paymentsTable = computed<EntityTableBodyProps<ClientPaymentType, ClientPaymentSortField>>(() => ({
  rows: payments.value,
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

const paymentInvoicesTable = computed(() => ({
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
    const gotPayments = await clientPaymentApi.search(paymentsFilter.value);

    payments.value = gotPayments.map((payment) => ({
      entity: {
        ...payment,
        _paidInvoiceRows: fetchClientPaymentInvoiceRows(payment),
      },
      _key: payment.code ?? nextKey(),
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
    ).map((paidInvoice, index) => {
      paidInvoice._client = payment.client;

      return {
        entity: paidInvoice,
        _key: paidInvoice.id ?? `${payment.id}-${index}`,
        _isNew: false,
        _isEdited: false,
        _parentId: payment.id!,
      };
    });
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
  invoices.value = await clientInvoiceApi.search();
}

/******************************************************************************************** ROW ACTIONS - MAIN ROWS */

interface ClientPaymentRow extends TableRow<ClientPaymentType & { _paidInvoiceRows: ClientPaymentInvoiceRow[] }> {}

let _keyCounter = 0;
function nextKey(): string {
  return `row-${++_keyCounter}`;
}

function discard(row: ClientPaymentRow) {
  if (row._isNew) {
    payments.value = payments.value.filter((w) => w._key !== row._key);
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
    const payment = payments.value.find((payment) => payment.entity.id === row._parentId);

    if (!payment) {
      return;
    }

    payment.entity.paidInvoices = (payment.entity.paidInvoices ?? []).filter((invoice) => invoice !== row.entity);

    delete (payment.entity as ClientPaymentType & { _paidInvoiceRows?: ClientPaymentInvoiceRow[] })._paidInvoiceRows;
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

const showAddClientPaymentDialog = ref(false);

function startAddingClientPayment() {
  showAddClientPaymentDialog.value = true;
}

async function saveClientPayment(payment: ClientPaymentType): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    await clientPaymentApi.add(payment);
    await fetch();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client payment saved successfully.',
    };

    showAddClientPaymentDialog.value = false;
  } catch (error: unknown) {
    await fetch();
    apiStatus.value = apiError(error, 'Failed to save client payment.');
  }
}

/********************************************************************************************************* ADD SUBROW */

async function addSubrow(row: ClientPaymentRow): Promise<void> {
  isEditing.value = true;

  const entity: ClientPaymentInvoiceType = {
    _client: row.entity.client,
  };

  row.entity.paidInvoices ??= [];
  row.entity.paidInvoices.push(entity);

  const subrows = fetchClientPaymentInvoiceRows(row.entity);
  subrows.push({
    entity,
    _key: nextKeySubRow(),
    _parentId: row.entity.id!,
    _isNew: true,
    _isEdited: false,
  });

  row._expanded = true;

  await nextTick();
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
    await fetch();
    isEditing.value = false;
    apiStatus.value = apiError(error, 'Failed to save client payment.');
  }
}

async function saveSubrow(row: ClientPaymentInvoiceRow): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const payment = payments.value.find((payment) => payment.entity.id === row._parentId);

    if (!payment) {
      apiStatus.value = apiError(null, 'Failed to save client payment - Payment not found.');
      return;
    }

    await clientPaymentApi.edit(payment.entity);

    await fetch();
    isEditing.value = false;

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client payment saved successfully.',
    };
  } catch (error) {
    await fetch();
    apiStatus.value = apiError(error, 'Failed to save client payment.');
  }
}

/************************************************************************************************************* DELETE */

const showDeleteDialog = ref(false);
const paymentToDelete = ref<ClientPaymentRow | null>(null);

function askDelete(row: ClientPaymentRow) {
  paymentToDelete.value = row;
  showDeleteDialog.value = true;
}

async function confirmDelete(): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (!paymentToDelete.value?.entity.id) {
      return;
    }

    await clientPaymentApi.delete(paymentToDelete.value.entity.id);
    await fetch();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client payment deleted successfully.',
    };

    showDeleteDialog.value = false;
    paymentToDelete.value = null;
  } catch (error: unknown) {
    await fetch();
    apiStatus.value = apiError(error, 'Failed to delete client payment.');
  }
}

const showDeleteDialogSubrow = ref(false);
const paymentInvoiceToDelete = ref<ClientPaymentInvoiceRow | null>(null);

function askDeleteSubrow(row: ClientPaymentInvoiceRow) {
  paymentInvoiceToDelete.value = row;
  showDeleteDialogSubrow.value = true;
}

async function confirmDeleteSubrow(): Promise<void> {
  if (!paymentInvoiceToDelete.value) {
    return;
  }

  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };
  const row = paymentInvoiceToDelete.value;

  try {
    const payment = payments.value.find((payment) => payment.entity.id === row._parentId);

    if (!payment) {
      apiStatus.value = apiError(null, 'Failed to save client payment - Payment not found.');
      return;
    }

    const updatedPayment = {
      ...payment.entity,
      paidInvoices: (payment.entity.paidInvoices ?? []).filter(
        (invoice) => invoice.invoice?.id !== row.entity.invoice?.id,
      ),
    };

    await clientPaymentApi.edit(updatedPayment);
    await fetch();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client payment invoice deleted successfully.',
    };

    showDeleteDialogSubrow.value = false;
    paymentInvoiceToDelete.value = null;
  } catch (error: unknown) {
    await fetch();
    apiStatus.value = apiError(error, 'Failed to delete client payment invoice.');
  }
}

/************************************************************************************************************ FILTERS */

const {
  filters: paymentsFilter,
  hasActiveTableControls,
  setSort,
  applyFilterValues,
  clearFilterValues,
  clearAllTableControls,
} = useTableFilters<ClientPaymentFilters>(fetch);
</script>
<style lang="scss"></style>
