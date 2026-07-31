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
              <col style="width: 50px" />
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
              :rows="clientInvoices"
              :configs="configs"
              :row-is-active="() => true"
              :is-valid="(clientInvoice) => ClientInvoice.isValid(clientInvoice, configs)"
              :is-editing="isEditing"
              @row-edit="startEditing"
              @row-delete="askDelete"
              @row-save="save"
              @row-discard="discard"
            />
          </table>
        </div>

        <div class="actions">
          <button class="btn" :disabled="isEditing || apiStatus.isLoading" @click="add">
            <Plus :size="18" /> Adicionar Fatura / Nota Crédito
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
import { StatusType } from '@/types/status-type';
import configsApi from '@/services/configs-api';
import { Client } from '@/entities/client';
import { apiError } from '@/services/api';
import { ClientInvoiceFilters, ClientInvoiceSortField, ClientInvoiceType } from '@/types/client-invoice-type';
import { ClientInvoice } from '@/entities/client-invoice';
import { Work } from '@/entities/work';
import { WorkStatusType } from '@/types/work-status-type';
import { WorkType } from '@/types/work-type';
import workApi from '@/services/work-api';
import clientInvoiceApi from '@/services/client-invoice-api';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });
const tableBody = ref<HTMLTableSectionElement | null>(null);

const status = ref<{ [k: string]: StatusType }>({});

const clients = ref<ClientType[]>([]);
const clientConfigs = computed(() => Client.getConfigs(status.value));

const works = ref<WorkType[]>([]);
const workStatus = ref<{ [k: string]: WorkStatusType }>({});
const workConfigsConfigs = computed(() =>
  Work.getConfigs(status.value, workStatus.value, clients.value, clientConfigs.value),
);

const clientInvoices = ref<ClientInvoiceRow[]>([]);
const configs = computed(() =>
  ClientInvoice.getConfigs(status.value, clients.value, clientConfigs.value, works.value, workConfigsConfigs.value),
);

/*************************************************************************************************************** LOAD */

onMounted(async () => {
  await loadConfigs();
  await fetch();
  await fetchClients();
  await fetchWorks();

  console.log('works', works.value);
});

async function loadConfigs() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotStatusValues = await configsApi.getStatusValues();
    status.value = Object.fromEntries(gotStatusValues.map((e) => [e.code, e]));

    const gotWorkStatusValues = await configsApi.getWorkStatusValues();
    workStatus.value = Object.fromEntries(gotWorkStatusValues.map((e) => [e.code, e]));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load config values.');
  }
}

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

interface ClientInvoiceRow extends TableRow<ClientInvoiceType> {
  entity: ClientInvoiceType;
  _key: string;
  _isNew: boolean;
  _isEdited: boolean;
  _original?: ClientInvoiceType;
}

const isEditing = computed(() => clientInvoices.value.some((row) => row._isNew || row._isEdited));
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
}

/*************************************************************************************************************** EDIT */

function startEditing(row: ClientInvoiceRow) {
  row._isEdited = true;
  row._original = JSON.parse(JSON.stringify(row.entity));
}

/**************************************************************************************************************** ADD */

async function add(): Promise<void> {
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

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client invoice saved successfully.',
    };
  } catch (error: unknown) {
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
    apiStatus.value = apiError(error, 'Failed to delete client invoice.');
  }
}

/************************************************************************************************************ FILTERS */

const clientInvoicesFilter = ref<ClientInvoiceFilters>({});

const hasActiveTableControls = computed(() =>
  Object.values(clientInvoicesFilter.value).some((value) => value !== undefined && value !== null && value !== ''),
);

function setSort(event: { column: ClientInvoiceSortField; direction: SortDirection | undefined }): void {
  clientInvoicesFilter.value = {
    ...clientInvoicesFilter.value,
    sortBy: event.direction ? event.column : undefined,
    sortDirection: event.direction,
  };

  fetch();
}

function applyFilterValues(values: Record<string, unknown>): void {
  clientInvoicesFilter.value = { ...clientInvoicesFilter.value, ...(values as Partial<ClientInvoiceFilters>) };

  fetch();
}

function clearFilterValues(values: Record<string, unknown>): void {
  clientInvoicesFilter.value = { ...clientInvoicesFilter.value, ...(values as Partial<ClientInvoiceFilters>) };

  fetch();
}

function clearAllTableControls(): void {
  clientInvoicesFilter.value = {};

  void fetch();
}
</script>
<style scoped lang="scss"></style>
