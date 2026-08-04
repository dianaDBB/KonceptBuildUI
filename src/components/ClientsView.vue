<template>
  <div class="main-section">
    <div class="section-header">
      <span><Users :size="24" /></span>
      <h3>Clientes</h3>

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
                      :disabled="clientsTable.isEditing.value"
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
                    :disabled="clientsTable.isEditing.value || apiStatus.isLoading"
                    title="Limpar todos os filtros e ordenação"
                    aria-label="Limpar todos os filtros e ordenação"
                    @click="clearAllTableControls"
                  >
                    <FunnelX :size="16" />
                  </button>
                </th>
              </tr>
            </thead>
            <EntityTableBody :rows="clientsTable" />
          </table>
        </div>

        <div class="actions">
          <button class="btn" :disabled="clientsTable.isEditing.value || apiStatus.isLoading" @click="add">
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
    :message="[
      `${clientToDelete?.entity.companyName}' - NIF ${clientToDelete?.entity.nif}`,
      'Tem a certeza que quer eliminar definitivamente este cliente?',
    ]"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { ApiResponseStatus } from '@/types/api-response-status';
import { ChevronRight, Users, Plus, LoaderCircle, FunnelX } from 'lucide-vue-next';
import Toast from '@/components/Toast.vue';
import TableColumnFilter from '@/components/TableColumnFilter.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { ClientType, ClientFilters, ClientSortField } from '@/types/client-type';
import clientApi from '@/services/client-api';
import { Client } from '@/entities/client';
import EntityTableBody from '@/components/EntityTableBody.vue';
import { EntityTableBodyProps, TableRow } from '@/types/entity-configs';
import { apiError } from '@/services/api';
import { useTableFilters } from '@/composables/useTableFilters';
import { useConfigs } from '@/composables/useConfigs';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });
const tableBody = ref<HTMLTableSectionElement | null>(null);

const status = useConfigs().statusOptions;

const clients = ref<ClientRow[]>([]);
const configs = computed(() => Client.getConfigs());

const isEditing = ref(false);
const clientsTable = computed<EntityTableBodyProps<ClientType, ClientSortField>>(() => ({
  rows: clients.value,
  configs: configs.value,
  handlers: {
    edit: startEditing,
    delete: askDelete,
    save,
    discard,
  },
  rowIsActive: isActive,
  isValid: (client) => Client.isValid(client, configs.value),
  isEditing: isEditing,
}));

/*************************************************************************************************************** LOAD */

onMounted(async () => {
  await fetch();
});

async function fetch() {
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

interface ClientRow extends TableRow<ClientType> {}

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

  isEditing.value = false;
}

function isActive(row: ClientRow) {
  return row.entity.status == status.value.ACTIVE.code;
}

/*************************************************************************************************************** EDIT */

function startEditing(row: ClientRow) {
  isEditing.value = true;

  row._isEdited = true;
  row._original = structuredClone({ ...row.entity });
}

/**************************************************************************************************************** ADD */

async function add(): Promise<void> {
  isEditing.value = true;

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

    await fetch();
    isEditing.value = false;

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
    await fetch();

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

const {
  filters: clientFilters,
  hasActiveTableControls,
  setSort,
  applyFilterValues,
  clearFilterValues,
  clearAllTableControls,
} = useTableFilters<ClientFilters>(fetch);
</script>
<style scoped lang="scss"></style>
