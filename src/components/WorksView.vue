<template>
  <div class="main-section">
    <div class="section-header">
      <span><List :size="24" /></span>
      <h3>Obras</h3>

      <div class="page-nav">
        <RouterLink to="/" class="link"> Página Inicial </RouterLink>
        <ChevronRight :size="14" class="separator" />
        <RouterLink :to="{ path: '/', query: { tab: 'works' } }" class="link"> Obras </RouterLink>
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
                      :filters="workFilters"
                      :sort-by="workFilters.sortBy"
                      :sort-direction="workFilters.sortDirection"
                      :disabled="worksTable.isEditing.value"
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
                    :disabled="worksTable.isEditing.value || apiStatus.isLoading"
                    title="Limpar todos os filtros e ordenação"
                    aria-label="Limpar todos os filtros e ordenação"
                    @click="clearAllTableControls"
                  >
                    <FunnelX :size="16" />
                  </button>
                </th>
              </tr>
            </thead>
            <EntityTableBody :rows="worksTable" />
          </table>
        </div>

        <div class="actions">
          <button class="btn" :disabled="worksTable.isEditing.value || apiStatus.isLoading" @click="add">
            <Plus :size="18" /> Adicionar Obra
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
    title="Eliminar obra"
    :message="[`${workToDelete?.entity.name}`, 'Tem a certeza que quer eliminar definitivamente esta obra?']"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { ApiResponseStatus } from '@/types/api-response-status';
import { ChevronRight, List, Plus, LoaderCircle, FunnelX } from 'lucide-vue-next';
import Toast from '@/components/Toast.vue';
import TableColumnFilter from '@/components/TableColumnFilter.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { WorkType, WorkFilters, WorkSortField } from '@/types/work-type';
import workApi from '@/services/work-api';
import { ClientFilters, ClientSortField, ClientType } from '@/types/client-type';
import clientApi from '@/services/client-api';
import { Work } from '@/entities/work';
import EntityTableBody from '@/components/EntityTableBody.vue';
import { EntityTableBodyProps, TableRow } from '@/types/entity-configs';
import { apiError } from '@/services/api';
import { useTableFilters } from '@/composables/useTableFilters';
import { useConfigs } from '@/composables/useConfigs';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });
const tableBody = ref<HTMLTableSectionElement | null>(null);

const status = useConfigs().statusOptions;
const workStatus = useConfigs().workStatusOptions;
const clients = ref<ClientType[]>([]);

const works = ref<WorkRow[]>([]);
const configs = computed(() => Work.getConfigs(clients.value));

const isEditing = ref(false);
const worksTable = computed<EntityTableBodyProps<WorkType, WorkSortField>>(() => ({
  rows: works.value,
  configs: configs.value,
  handlers: {
    edit: startEditing,
    delete: askDelete,
    save,
    discard,
  },
  rowIsActive: isActive,
  isValid: (work) => Work.isValid(work, configs.value),
  isEditing: isEditing,
}));

/*************************************************************************************************************** LOAD */

onMounted(async () => {
  await fetchClients();
  await fetch();
});

async function fetch() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotWorks = await workApi.searchWorks(workFilters.value);

    works.value = gotWorks.map((work) => ({
      entity: {
        ...work,
      },
      _key: work.code ?? nextKey(),
      _isNew: false,
      _isEdited: false,
    }));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load works.');
  }
}

async function fetchClients() {
  const clientFilters: ClientFilters = {
    status: status.value.ACTIVE.code,
    sortBy: ClientSortField.CODE,
  };

  clients.value = await clientApi.searchClients(clientFilters);
}

/******************************************************************************************************** ROW ACTIONS */

interface WorkRow extends TableRow<WorkType> {}

let _keyCounter = 0;
function nextKey(): string {
  return `row-${++_keyCounter}`;
}

function discard(row: WorkRow) {
  if (row._isNew) {
    works.value = works.value.filter((w) => w._key !== row._key);
  } else {
    row.entity = row._original!;
    row._isNew = false;
    row._isEdited = false;
  }

  isEditing.value = false;
}

function isActive(row: WorkRow) {
  return row.entity.status != workStatus.value.DONE.code;
}

/*************************************************************************************************************** EDIT */

function startEditing(row: WorkRow) {
  isEditing.value = true;

  row._isEdited = true;
  row._original = JSON.parse(JSON.stringify(row.entity));
}

/**************************************************************************************************************** ADD */

async function add(): Promise<void> {
  isEditing.value = true;

  works.value.push({
    entity: {
      status: workStatus.value.STARTED.code,
      startDate: new Date().toISOString().split('T')[0],
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

async function save(row: WorkRow): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (row._isNew) {
      await workApi.addWork(row.entity);
    } else if (row._isEdited) {
      await workApi.editWork(row.entity);
    }

    await fetch();
    isEditing.value = false;

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Work saved successfully.',
    };
  } catch (error: unknown) {
    await fetch();
    apiStatus.value = apiError(error, 'Failed to save work.');
  }
}

/************************************************************************************************************* DELETE */

const showDeleteDialog = ref(false);
const workToDelete = ref<WorkRow | null>(null);

function askDelete(row: WorkRow) {
  workToDelete.value = row;
  showDeleteDialog.value = true;
}

async function confirmDelete(): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (!workToDelete.value?.entity.id) {
      return;
    }

    await workApi.deleteWork(workToDelete.value.entity.id);
    await fetch();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Work deleted successfully.',
    };

    showDeleteDialog.value = false;
    workToDelete.value = null;
  } catch (error: unknown) {
    await fetch();
    apiStatus.value = apiError(error, 'Failed to delete work.');
  }
}

/************************************************************************************************************ FILTERS */

const {
  filters: workFilters,
  hasActiveTableControls,
  setSort,
  applyFilterValues,
  clearFilterValues,
  clearAllTableControls,
} = useTableFilters<WorkFilters>(fetch);
</script>
<style scoped lang="scss"></style>
