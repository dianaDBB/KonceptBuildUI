<template>
  <div class="main-section">
    <div class="section-header">
      <span><FileInput :size="24" /></span>
      <h3>Faturas e Notas de Crédito - Clientes</h3>

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
          A carregar faturas e notas de crédito...
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
              <col style="width: 80px" />
            </colgroup>
            <thead>
              <tr>
                <th v-for="config in Object.values(configs)" :key="config.label">
                  <div class="column-heading">
                    {{ config.label }}

                    <TableColumnFilter
                      :config="config"
                      :filters="clientInvoicesFilter"
                      :sort-by="clientInvoicesFilter.sortBy"
                      :sort-direction="clientInvoicesFilter.sortDirection"
                      :disabled="clientInvoicesTable.isEditing.value"
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
                    :disabled="clientInvoicesTable.isEditing.value || apiStatus.isLoading"
                    title="Limpar todos os filtros e ordenação"
                    aria-label="Limpar todos os filtros e ordenação"
                    @click="clearAllTableControls"
                  >
                    <FunnelX :size="16" />
                  </button>
                </th>
              </tr>
            </thead>
            <EntityTableBody :rows="clientInvoicesTable">
              <template #row-actions="{ row }">
                <button title="Eliminar fatura" :disabled="clientInvoicesTable.isEditing.value" @click="askDelete(row)">
                  <Trash2 :size="16" />
                </button>
                <button
                  title="Editar fatura"
                  :disabled="clientInvoicesTable.isEditing.value"
                  @click="startEditing(row)"
                >
                  <Pencil :size="16" />
                </button>
                <button
                  title="Efectuar pagamento"
                  :disabled="clientInvoicesTable.isEditing.value"
                  @click="startAddingClientPayment(row)"
                >
                  <FileInput :size="16" />
                </button>
              </template>
            </EntityTableBody>
          </table>
        </div>

        <div class="actions">
          <button class="btn" :disabled="clientInvoicesTable.isEditing.value || apiStatus.isLoading" @click="add">
            <Plus :size="18" /> Adicionar Fatura
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
    title="Eliminar fatura / nota crédito"
    :message="[
      `${clientInvoiceToDelete?.entity.docNumber}`,
      'Tem a certeza que quer eliminar definitivamente esta fatura / nota de crédito?',
    ]"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="confirmDelete"
  />

  <!-- add payment -->
  <AddClientPaymentDialog
    v-model="showAddClientPaymentDialog"
    :invoice="selectedClientInvoice"
    @save="saveClientPayment"
  />

  <!-- go to payments (after adding payment)-->
  <ConfirmDialog
    v-model="showWClientPaymentsPageDialog"
    title="Pagamento efectuado"
    :message="['O pagamento foi efetuado com sucesso.', 'Pretende abrir a página de Pagamentos?']"
    confirm-text="Ir para Pagamentos"
    cancel-text="Ficar nesta página"
    @confirm="goToClientPayment"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, toRaw } from 'vue';
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
import { ClientInvoiceFilters, ClientInvoiceSortField, ClientInvoiceType } from '@/types/client-invoice-type';
import { ClientInvoice } from '@/entities/client-invoice';
import { WorkType } from '@/types/work-type';
import workApi from '@/services/work-api';
import clientInvoiceApi from '@/services/client-invoice-api';
import { ClientPaymentType } from '@/types/client-payment-type';
import clientPaymentApi from '@/services/client-payment-api';
import AddClientPaymentDialog from '@/components/AddClientPaymentDialog.vue';
import router from '@/router';
import { useTableFilters } from '@/composables/useTableFilters';
import { useConfigs } from '@/composables/useConfigs';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });
const tableBody = ref<HTMLTableSectionElement | null>(null);

const status = useConfigs().statusOptions;
const clients = ref<ClientType[]>([]);
const works = ref<WorkType[]>([]);

const clientInvoices = ref<ClientInvoiceRow[]>([]);
const configs = computed(() => ClientInvoice.getConfigs(clients.value, works.value));

const isEditing = ref(false);
const clientInvoicesTable = computed<EntityTableBodyProps<ClientPaymentType, ClientInvoiceSortField>>(() => ({
  rows: clientInvoices.value,
  configs: configs.value,
  handlers: {
    edit: startEditing,
    delete: askDelete,
    save,
    discard,
  },
  rowIsActive: () => true,
  isValid: (clientInvoice) => ClientInvoice.isValid(clientInvoice, configs.value),
  isEditing: isEditing,
}));

/*************************************************************************************************************** LOAD */

onMounted(async () => {
  await fetch();
  await fetchClients();
  await fetchWorks();
});

async function fetch() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotClientInvoices = await clientInvoiceApi.search(clientInvoicesFilter.value);

    clientInvoices.value = gotClientInvoices.map((clientInvoice) => ({
      entity: {
        ...clientInvoice,
      },
      _key: clientInvoice.code ?? nextKey(),
      _isNew: false,
      _isEdited: false,
    }));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load client invoices.');
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

/******************************************************************************************************** ROW ACTIONS */

interface ClientInvoiceRow extends TableRow<ClientInvoiceType> {}

let _keyCounter = 0;
function nextKey(): string {
  return `row-${++_keyCounter}`;
}

function discard(row: ClientInvoiceRow) {
  if (row._isNew) {
    clientInvoices.value = clientInvoices.value.filter((w) => w._key !== row._key);
  } else {
    row.entity = row._original!;
    row._isNew = false;
    row._isEdited = false;
  }

  isEditing.value = false;
}

/*************************************************************************************************************** EDIT */

function startEditing(row: ClientInvoiceRow) {
  isEditing.value = true;

  row._isEdited = true;
  row._original = JSON.parse(JSON.stringify(row.entity));
}

/**************************************************************************************************************** ADD */

async function add(): Promise<void> {
  isEditing.value = true;

  clientInvoices.value.push({
    entity: {
      appliedTax: 23,
      registrationDate: new Date().toISOString().split('T')[0],
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

async function save(row: ClientInvoiceRow): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (row._isNew) {
      await clientInvoiceApi.add(row.entity);
    } else if (row._isEdited) {
      await clientInvoiceApi.edit(row.entity);
    }

    await fetch();
    isEditing.value = false;

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client invoice saved successfully.',
    };
  } catch (error: unknown) {
    await fetch();
    apiStatus.value = apiError(error, 'Failed to save client invoice.');
  }
}

/************************************************************************************************************* DELETE */

const showDeleteDialog = ref(false);
const clientInvoiceToDelete = ref<ClientInvoiceRow | null>(null);

function askDelete(row: ClientInvoiceRow) {
  clientInvoiceToDelete.value = row;
  showDeleteDialog.value = true;
}

async function confirmDelete(): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (!clientInvoiceToDelete.value?.entity.id) {
      return;
    }

    await clientInvoiceApi.delete(clientInvoiceToDelete.value.entity.id);
    await fetch();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client invoice deleted successfully.',
    };

    showDeleteDialog.value = false;
    clientInvoiceToDelete.value = null;
  } catch (error: unknown) {
    await fetch();
    apiStatus.value = apiError(error, 'Failed to delete client invoice.');
  }
}

/************************************************************************************************************ FILTERS */

const {
  filters: clientInvoicesFilter,
  hasActiveTableControls,
  setSort,
  applyFilterValues,
  clearFilterValues,
  clearAllTableControls,
} = useTableFilters<ClientInvoiceFilters>(fetch);

/******************************************************************************************************** ADD PAYMENT */

const showAddClientPaymentDialog = ref(false);
const showWClientPaymentsPageDialog = ref(false);
const selectedClientInvoice = ref<ClientInvoiceType | null>(null);

function startAddingClientPayment(row: TableRow<ClientInvoiceType>) {
  selectedClientInvoice.value = JSON.parse(JSON.stringify(toRaw(row.entity)));
  showAddClientPaymentDialog.value = true;
}

async function saveClientPayment(payment: ClientPaymentType): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    await clientPaymentApi.add(payment);
    await fetch();

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false, message: 'Payment added successfully.' };

    showAddClientPaymentDialog.value = false;
    showWClientPaymentsPageDialog.value = true;
  } catch (error: unknown) {
    await fetch();
    apiStatus.value = apiError(error, 'Failed to add payment.');
  }
}

function goToClientPayment() {
  router.push('/sales/client-payments');
}
</script>
<style scoped lang="scss"></style>
