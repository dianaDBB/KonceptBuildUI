<template>
  <div class="main-section">
    <div class="section-header">
      <span><List :size="24" /></span>
      <h3>Obras</h3>

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
              <col
                v-for="config in Object.values(Work.configs)"
                :key="config.label"
                :style="config.styleConfig.columnStyle"
              />
              <col style="width: 50px" />
            </colgroup>
            <thead>
              <tr>
                <th v-for="config in Object.values(Work.configs)" :key="config.label">
                  <div class="column-heading">
                    {{ config.label }}

                    <TableColumnFilter
                      :config="config"
                      :filters="workFilters"
                      :sort-by="workFilters.sortBy"
                      :sort-direction="workFilters.sortDirection"
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
              :rows="works"
              :configs="Work.configs"
              :search-select-options="clients"
              :row-is-active="isActive"
              :is-valid="Work.isValid"
              :is-editing="isEditing"
              @row-edit="startEditing"
              @row-delete="askDelete"
              @row-save="save"
              @row-discard="discard"
            />
          </table>
        </div>

        <div class="actions">
          <button :disabled="isEditing || apiStatus.isLoading" @click="addWork">
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
    title="Eliminar obra"
    :message="`Tem a certeza que quer eliminar definitivamente a obra '${workToDelete?.entity.name}'?`"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { ApiResponseStatus } from '@/types/api-response-status';
import { List, Plus, LoaderCircle, FunnelX } from 'lucide-vue-next';
import Toast from '@/composables/Toast.vue';
import { SortDirection } from '@/types/sort-direction';
import TableColumnFilter from '@/components/TableColumnFilter.vue';
import ConfirmDialog from '@/composables/ConfirmDialog.vue';
import axios from 'axios';
import { WorkType, WorkFilters, WorkSortField } from '@/types/work-type';
import { WorkStatus } from '@/types/work-status';
import workApi from '@/services/work-api';
import { ClientFilters, ClientSortField, ClientType } from '@/types/client-type';
import clientApi from '@/services/client-api';
import { Work } from '@/entities/work';
import EntityTableBody from '@/composables/EntityTableBody.vue';
import { TableRow } from '@/types/entity-configs';
import { Status } from '@/types/status';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const tableBody = ref<HTMLTableSectionElement | null>(null);

/******************************************************************************************************** ROW ACTIONS */

interface WorkRow extends TableRow<WorkType> {
  entity: WorkType;
  _key: string;
  _isNew: boolean;
  _isEdited: boolean;
  _original?: WorkType;
}

const clients = ref<ClientType[]>([]);
const works = ref<WorkRow[]>([]);
const isEditing = computed(() => works.value.some((row) => row._isNew || row._isEdited));
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
}

function isActive(row: WorkRow) {
  return row.entity.status != WorkStatus.DONE;
}

/**************************************************************************************************************** GET */

async function fetchWorks() {
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
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Could not load works.',
    };
  }
}

async function fetchClients() {
  const clientFilters: ClientFilters = {
    status: Status.ACTIVE,
    sortBy: ClientSortField.CODE,
  };

  clients.value = await clientApi.searchClients(clientFilters);
}

/*************************************************************************************************************** EDIT */

function startEditing(row: WorkRow) {
  row._isEdited = true;
  row._original = JSON.parse(JSON.stringify(row.entity));
}

/**************************************************************************************************************** ADD */

async function addWork(): Promise<void> {
  works.value.push({
    entity: {
      status: WorkStatus.STARTED,
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
    }

    if (row._isEdited) {
      await workApi.editWork(row.entity);
    }

    await fetchWorks();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Work saved successfully.',
    };
  } catch (error: unknown) {
    let message = 'Failed to save work.';

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message ?? error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: message,
    };
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
    await fetchWorks();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Work deleted successfully.',
    };

    showDeleteDialog.value = false;
    workToDelete.value = null;
  } catch (error: unknown) {
    let message = 'Failed to delete work.';

    if (axios.isAxiosError(error)) {
      message = error.response?.data?.message ?? error.message;
    } else if (error instanceof Error) {
      message = error.message;
    }
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: message,
    };
  }
}

/************************************************************************************************************ FILTERS */

const workFilters = ref<WorkFilters>({});

const hasActiveTableControls = computed(() =>
  Object.values(workFilters.value).some((value) => value !== undefined && value !== null && value !== ''),
);

function setSort(event: { column: WorkSortField; direction: SortDirection | undefined }): void {
  workFilters.value = {
    ...workFilters.value,
    sortBy: event.direction ? event.column : undefined,
    sortDirection: event.direction,
  };

  fetchWorks();
}

function applyFilterValues(values: Record<string, unknown>): void {
  workFilters.value = { ...workFilters.value, ...(values as Partial<WorkFilters>) };

  fetchWorks();
}

function clearFilterValues(values: Record<string, unknown>): void {
  workFilters.value = { ...workFilters.value, ...(values as Partial<WorkFilters>) };

  fetchWorks();
}

function clearAllTableControls(): void {
  workFilters.value = {};

  void fetchWorks();
}

onMounted(() => {
  fetchWorks();
  fetchClients();
});
</script>
<style scoped lang="scss"></style>
