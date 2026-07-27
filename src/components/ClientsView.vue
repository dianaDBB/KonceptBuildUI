<template>
  <div class="main-section">
    <div class="section-header">
      <span><Users :size="24" /></span>
      <h3>Clientes</h3>

      <div class="page-nav">
        <RouterLink to="/" class="link">Página Inicial</RouterLink>
      </div>
    </div>

    <div class="section">
      <div v-if="apiStatus.isLoading" class="loading-overlay">
        <div>
          <LoaderCircle :size="18" class="spinner" />
          A carregar clientes...
        </div>
      </div>
      <div class="section-body">
        <div class="table">
          <table>
            <colgroup>
              <col v-for="config in configs" :key="config.label" :style="config.styleConfig.columnStyle" />
              <col style="width: 50px" />
            </colgroup>
            <thead>
              <tr>
                <th v-for="config in Object.values(configs)" :key="config.label">
                  <div class="column-heading">
                    {{ config.label }}

                    <TableColumnFilter
                      :config="config"
                      :filters="clientFilters"
                      :sort-by="clientFilters.sortBy"
                      :sort-direction="clientFilters.sortDirection"
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
              :rows="clients"
              :configs="configs"
              :row-is-active="isActive"
              :is-valid="(client) => Client.isValid(client, configs)"
              :is-editing="isEditing"
              @row-edit="startEditing"
              @row-delete="askDelete"
              @row-save="save"
              @row-discard="discard"
            />
          </table>
        </div>

        <div class="actions">
          <button class="btn" :disabled="isEditing || apiStatus.isLoading" @click="addClient">
            <Plus :size="18" /> Adicionar Cliente
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
    title="Eliminar cliente"
    :message="`Tem a certeza que quer eliminar definitivamente o cliente '${clientToDelete?.entity.companyName}' com o NIF ${clientToDelete?.entity.nif}?`"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { ApiResponseStatus } from '@/types/api-response-status';
import { Users, Plus, LoaderCircle, FunnelX } from 'lucide-vue-next';
import Toast from '@/composables/Toast.vue';
import { SortDirection } from '@/types/sort-direction';
import TableColumnFilter from '@/components/TableColumnFilter.vue';
import ConfirmDialog from '@/composables/ConfirmDialog.vue';
import { ClientType, ClientFilters, ClientSortField } from '@/types/client-type';
import clientApi from '@/services/client-api';
import { Client } from '@/entities/client';
import EntityTableBody from '@/composables/EntityTableBody.vue';
import { TableRow } from '@/types/entity-configs';
import configsApi from '@/services/configs-api';
import { StatusType } from '@/types/status-type';
import { apiError } from '@/services/api';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });
const tableBody = ref<HTMLTableSectionElement | null>(null);

const status = ref<{ [k: string]: StatusType }>({});
const clients = ref<ClientRow[]>([]);

const configs = computed(() => Client.getConfigs(status.value));

/*************************************************************************************************************** LOAD */

onMounted(async () => {
  await loadConfigs();
  await fetchClients();
});

async function loadConfigs() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotValues = await configsApi.getStatusValues();
    status.value = Object.fromEntries(gotValues.map((e) => [e.code, e]));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load config values.');
  }
}

async function fetchClients() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotClients = await clientApi.searchClients(clientFilters.value);

    clients.value = gotClients.map((client) => ({
      entity: { ...client },
      _key: client.code ?? nextKey(),
      _isNew: false,
      _isEdited: false,
      _isDeleted: false,
    }));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load clients.');
  }
}

/******************************************************************************************************** ROW ACTIONS */

interface ClientRow extends TableRow<ClientType> {
  entity: ClientType;
  _key: string;
  _isNew: boolean;
  _isEdited: boolean;
  _original?: ClientType;
}

const isEditing = computed(() => clients.value.some((row) => row._isNew || row._isEdited));
let _keyCounter = 0;

function nextKey(): string {
  return `row-${++_keyCounter}`;
}

function discard(row: ClientRow) {
  if (row._isNew) {
    clients.value = clients.value.filter((w) => w._key !== row._key);
  } else {
    row.entity = row._original!;
    row._isNew = false;
    row._isEdited = false;
  }
}

function isActive(row: ClientRow) {
  return row.entity.status == status.value.ACTIVE.code;
}

/*************************************************************************************************************** EDIT */

function startEditing(row: ClientRow) {
  row._isEdited = true;

  row._original = structuredClone({ ...row.entity });
}

/**************************************************************************************************************** ADD */

async function addClient(): Promise<void> {
  clients.value.push({
    entity: {
      status: status.value.ACTIVE.code,
      phoneCountryCode: '+351',
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

async function save(row: ClientRow): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (row._isNew) {
      await clientApi.addClient(row.entity);
    } else if (row._isEdited) {
      await clientApi.editClient(row.entity);
    }

    await fetchClients();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client saved successfully.',
    };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to save client.');
  }
}

/************************************************************************************************************* DELETE */

const showDeleteDialog = ref(false);
const clientToDelete = ref<ClientRow | null>(null);

function askDelete(row: ClientRow) {
  clientToDelete.value = row;
  showDeleteDialog.value = true;
}

async function confirmDelete(): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (!clientToDelete.value?.entity.id) {
      return;
    }

    await clientApi.deleteClient(clientToDelete.value.entity.id);
    await fetchClients();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client deleted successfully.',
    };

    showDeleteDialog.value = false;
    clientToDelete.value = null;
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to delete client.');
  }
}

/************************************************************************************************************ FILTERS */

const clientFilters = ref<ClientFilters>({});

const hasActiveTableControls = computed(() =>
  Object.values(clientFilters.value).some((value) => value !== undefined && value !== null && value !== ''),
);

function setSort(event: { column: ClientSortField; direction: SortDirection | undefined }): void {
  clientFilters.value = {
    ...clientFilters.value,
    sortBy: event.direction ? event.column : undefined,
    sortDirection: event.direction,
  };

  fetchClients();
}

function applyFilterValues(values: Record<string, unknown>): void {
  clientFilters.value = { ...clientFilters.value, ...(values as Partial<ClientFilters>) };

  fetchClients();
}

function clearFilterValues(values: Record<string, unknown>): void {
  clientFilters.value = { ...clientFilters.value, ...(values as Partial<ClientFilters>) };

  fetchClients();
}

function clearAllTableControls(): void {
  clientFilters.value = {};

  void fetchClients();
}
</script>
<style scoped lang="scss"></style>
