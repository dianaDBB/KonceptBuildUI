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
              <col style="width: 130px" />
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
            <EntityTableBody :rows="clientInvoicesTable" :subrows="clientCreditNotesTable">
              <template #row-actions="{ row, isSubrow }">
                <template v-if="!isSubrow">
                  <button
                    title="Eliminar fatura"
                    :disabled="clientInvoicesTable.isEditing.value"
                    @click="askDelete(row)"
                  >
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
                    title="Adicionar nota de crédito"
                    :disabled="clientCreditNotesTable.isEditing.value"
                    @click="addSubrow(row)"
                  >
                    <Plus :size="16" />
                  </button>
                  <button
                    title="Efectuar pagamento"
                    :disabled="clientInvoicesTable.isEditing.value"
                    @click="startAddingClientPayment(row)"
                  >
                    <FileInput :size="16" />
                  </button>
                </template>
                <template v-else>
                  <button
                    title="Eliminar nota de crédito"
                    :disabled="clientCreditNotesTable.isEditing.value"
                    @click="askDeleteSubrow(row)"
                  >
                    <Trash2 :size="16" />
                  </button>
                  <button
                    title="Editar nota de crédito"
                    :disabled="clientCreditNotesTable.isEditing.value"
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
      'Tem a certeza que quer eliminar definitivamente esta fatura?',
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
      `${creditNoteToDelete?.entity.docNumber}`,
      'Tem a certeza que quer eliminar definitivamente esta nota de crédito?',
    ]"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="confirmDeleteSubrow"
  />

  <!-- add payment -->
  <AddClientPaymentInvoiceDialog
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
import router from '@/router';
import { useTableFilters } from '@/composables/useTableFilters';
import { useConfigs } from '@/composables/useConfigs';
import AddClientPaymentInvoiceDialog from './AddClientPaymentInvoiceDialog.vue';
import { ClientCreditNote } from '@/entities/client-credit-note.ts';
import { ClientCreditNoteType } from '@/types/client-credit-note-type.ts';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });
const tableBody = ref<HTMLTableSectionElement | null>(null);

const status = useConfigs().statusOptions;
const clients = ref<ClientType[]>([]);
const works = ref<WorkType[]>([]);

const clientInvoices = ref<ClientInvoiceRow[]>([]);
const configs = computed(() => ClientInvoice.getConfigs(clients.value, works.value));
const creditNotesConfigs = computed(() => ClientCreditNote.getConfigs());

const isEditing = ref(false);

const clientInvoicesTable = computed<EntityTableBodyProps<ClientPaymentType, ClientInvoiceSortField>>(() => ({
  rows: clientInvoices.value,
  configs: configs.value,
  handlers: {
    edit: startEditing,
    delete: askDelete,
    save,
    discard,
    toggle: toggleRow,
  },
  rowIsActive: () => true,
  isValid: (clientInvoice) => ClientInvoice.isValid(clientInvoice, configs.value),
  isEditing: isEditing,
}));

const clientCreditNotesTable = computed(() => ({
  rows: fetchCreditNoteRows,
  configs: creditNotesConfigs.value,
  handlers: {
    edit: startEditingSubrow,
    save: saveSubrow,
    delete: () => {},
    discard: discardSubRow,
  },
  rowIsActive: () => true,
  isValid: (creditNote: ClientCreditNoteType) => ClientCreditNote.isValid(creditNote, creditNotesConfigs.value),
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
        _creditNotesRows: fetchCreditNoteRows(clientInvoice),
      },
      _key: clientInvoice.code ?? nextKey(),
      _isNew: false,
      _isEdited: false,
      _expanded: false,
    }));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load client invoices.');
  }
}

function fetchCreditNoteRows(invoice: ClientInvoiceType): ClientCreditNoteTypeRow[] {
  if (!(invoice as ClientInvoiceType & { _creditNotesRows?: ClientCreditNoteTypeRow[] })._creditNotesRows) {
    (invoice as ClientInvoiceType & { _creditNotesRows?: ClientCreditNoteTypeRow[] })._creditNotesRows = (
      invoice.creditNotes ?? []
    ).map((creditNote, index) => {
      return {
        entity: creditNote,
        _key: creditNote.id ?? `${invoice.id}-${index}`,
        _isNew: false,
        _isEdited: false,
        _parentId: invoice.id!,
      };
    });
  }

  return (invoice as ClientInvoiceType & { _creditNotesRows: ClientCreditNoteTypeRow[] })._creditNotesRows;
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

/******************************************************************************************** ROW ACTIONS - MAIN ROWS */

interface ClientInvoiceRow extends TableRow<ClientInvoiceType & { _creditNotesRows: ClientCreditNoteTypeRow[] }> {}

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

function toggleRow(row: ClientInvoiceRow) {
  if (row._isNew || row._isEdited) {
    return;
  }

  row._expanded = !row._expanded;
}

/********************************************************************************************* ROW ACTIONS - SUB ROWS */

interface ClientCreditNoteTypeRow extends TableRow<ClientCreditNoteType> {}

let _keyCounterSubrow = 0;
function nextKeySubRow(): string {
  return `row-${++_keyCounterSubrow}`;
}

function discardSubRow(row: ClientCreditNoteTypeRow) {
  if (row._isNew) {
    const invoice = clientInvoices.value.find((clientInvoice) => clientInvoice.entity.id === row._parentId);

    if (!invoice) {
      return;
    }

    invoice.entity.creditNotes = (invoice.entity.creditNotes ?? []).filter((creditNote) => creditNote !== row.entity);

    delete (invoice.entity as ClientInvoiceType & { _creditNotesRows?: ClientCreditNoteType[] })._creditNotesRows;
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

function startEditingSubrow(row: ClientCreditNoteTypeRow) {
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
      _creditNotesRows: [],
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

/********************************************************************************************************* ADD SUBROW */

async function addSubrow(row: ClientInvoiceRow): Promise<void> {
  isEditing.value = true;

  const entity: ClientCreditNoteType = {
    appliedTax: row.entity.appliedTax,
  };

  row.entity.creditNotes ??= [];
  row.entity.creditNotes.push(entity);

  const subrows = fetchCreditNoteRows(row.entity);
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
    isEditing.value = false;
    apiStatus.value = apiError(error, 'Failed to save client invoice.');
  }
}

async function saveSubrow(row: ClientCreditNoteTypeRow): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const invoice = clientInvoices.value.find((clientInvoice) => clientInvoice.entity.id === row._parentId);

    if (!invoice) {
      apiStatus.value = apiError(null, 'Failed to save client credit note - Invoice not found.');
      return;
    }

    if (row._isNew) {
      await clientInvoiceApi.createCreditNote(invoice.entity.id!, row.entity);
    } else {
      await clientInvoiceApi.updateCreditNote(invoice.entity.id!, row.entity);
    }

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
    isEditing.value = false;
    apiStatus.value = apiError(error, 'Failed to save client payment.');
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

const showDeleteDialogSubrow = ref(false);
const creditNoteToDelete = ref<ClientCreditNoteTypeRow | null>(null);

function askDeleteSubrow(row: ClientCreditNoteTypeRow) {
  creditNoteToDelete.value = row;
  showDeleteDialogSubrow.value = true;
}

async function confirmDeleteSubrow(): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (!creditNoteToDelete.value?.entity.id) {
      return;
    }

    await clientInvoiceApi.deleteCreditNote(creditNoteToDelete.value._parentId!, creditNoteToDelete.value.entity.id);
    await fetch();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client invoice deleted successfully.',
    };

    showDeleteDialogSubrow.value = false;
    creditNoteToDelete.value = null;
  } catch (error: unknown) {
    await fetch();
    apiStatus.value = apiError(error, 'Failed to delete credit note.');
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
<style lang="scss">
.table {
  td {
    &.aging-zero-thirty {
      color: rgb(251, 230, 169);

      &::before {
        content: '🟡';
      }
    }

    &.aging-thirty-sixty {
      color: rgb(247, 202, 175);

      &::before {
        content: '🟠';
      }
    }

    &.aging-sixty-ninty {
      color: rgb(109, 59, 17);

      &::before {
        content: '🟤';
      }
    }

    &.aging-ninty-plus {
      color: rgb(162, 33, 22);

      &::before {
        content: '🔴';
      }
    }

    &.aging-not-yet-due {
      color: rgb(198, 224, 224);

      &::before {
        content: '🔵';
      }
    }

    &.aging-paid {
      color: rgb(53, 113, 78);

      &::before {
        content: '✅';
      }
    }

    &.aging-na {
      color: rgb(233, 232, 232);

      &::before {
        content: '⚫';
      }
    }

    &[class*='aging-']::before {
      margin-right: 6px;
    }

    &.editing[class*='aging-']::before {
      content: none;
    }

    &.invoice-status-paid {
      color: rgb(53, 113, 78);

      &::before {
        content: '✅';
      }
    }

    &.invoice-status-partial {
      color: rgb(247, 202, 175);

      &::before {
        content: '⚡';
      }
    }

    &.invoice-status-delay {
      color: rgb(162, 33, 22);

      &::before {
        content: '🔴';
      }
    }

    &.invoice-status-pending {
      color: rgb(251, 230, 169);

      &::before {
        content: '⚠️';
      }
    }

    &[class*='invoice-status-']::before {
      margin-right: 6px;
    }

    &.editing[class*='invoice-status-']::before {
      content: none;
    }
  }
}
</style>
