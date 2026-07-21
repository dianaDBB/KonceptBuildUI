<template>
  <div class="main-section">
    <div class="section-header">
      <span><Contact :size="24" /></span>
      <h3>Colaboradores</h3>

      <div class="page-nav">
        <RouterLink to="/" class="link">Página Inicial</RouterLink>
      </div>
    </div>

    <div class="section">
      <div class="section-body">
        <div class="table">
          <table>
            <colgroup>
              <col v-for="config in Object.values(Worker.configs)" :key="config.label" :style="config.columnStyle" />
              <col style="width: 50px" />
            </colgroup>
            <thead>
              <tr>
                <th v-for="config in Object.values(Worker.configs)" :key="config.label">
                  <div class="column-heading">
                    {{ config.label }}

                    <TableColumnFilter
                      :config="config"
                      :filters="workerFilters"
                      :sort-by="workerFilters.sortBy"
                      :sort-direction="workerFilters.sortDirection"
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
              :rows="workers"
              :configs="Worker.configs"
              :row-is-active="isActive"
              :is-valid="Worker.isValid"
              :is-editing="isEditing"
              @row-edit="startEditing"
              @row-delete="askDelete"
              @row-save="save"
              @row-discard="discard"
            />
          </table>
          <div v-if="apiStatus.isLoading" class="table-loading-overlay">
            <div>
              <LoaderCircle :size="18" class="spinner" />
              A carregar colaboradores...
            </div>
          </div>
        </div>

        <div class="actions">
          <button :disabled="isEditing || apiStatus.isLoading" @click="addWorker">
            <Plus :size="18" /> Adicionar Colaborador
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
    title="Eliminar colaborador"
    :message="`Tem a certeza que quer eliminar definitivamente o colaborador '${workerToDelete?.entity.name}' com o NIF ${workerToDelete?.entity.nif}?`"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import workerApi from '@/services/worker-api';
import { WorkerType, WorkerFilters, WorkerSortField } from '@/types/worker-type';
import { ApiResponseStatus } from '@/types/api-response-status';
import { Contact, Plus, LoaderCircle, FunnelX } from 'lucide-vue-next';
import Toast from '@/composables/Toast.vue';
import { SortDirection } from '@/types/sort-direction';
import TableColumnFilter from '@/components/TableColumnFilter.vue';
import ConfirmDialog from '@/composables/ConfirmDialog.vue';
import axios from 'axios';
import { Status } from '@/types/status';
import { Worker } from '@/entities/worker';
import { TableRow } from '@/types/entity-configs';
import EntityTableBody from '@/composables/EntityTableBody.vue';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const tableBody = ref<HTMLTableSectionElement | null>(null);

/******************************************************************************************************** ROW ACTIONS */

interface WorkerRow extends TableRow<WorkerType> {
  entity: WorkerType;
  _key: string;
  _isNew: boolean;
  _isEdited: boolean;
  _original?: WorkerType;
}

const workers = ref<WorkerRow[]>([]);
const isEditing = computed(() => workers.value.some((row) => row._isNew || row._isEdited));
let _keyCounter = 0;

function nextKey(): string {
  return `row-${++_keyCounter}`;
}

function discard(row: WorkerRow) {
  if (row._isNew) {
    workers.value = workers.value.filter((w) => w._key !== row._key);
  } else {
    row.entity = row._original!;
    row._isNew = false;
    row._isEdited = false;
  }
}

function isActive(row: WorkerRow) {
  return row.entity.status == Status.ACTIVE;
}

/**************************************************************************************************************** GET */

async function fetchWorkers() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotWorkers = await workerApi.searchWorkers(workerFilters.value);

    workers.value = gotWorkers.map((worker) => ({
      entity: {
        ...worker,
      },
      _key: worker.code ?? nextKey(),
      _isNew: false,
      _isEdited: false,
      _isDeleted: false,
    }));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Could not load workers.',
    };
  }
}

/*************************************************************************************************************** EDIT */

function startEditing(row: WorkerRow) {
  row._isEdited = true;

  row._original = structuredClone({ ...row.entity });
}

/**************************************************************************************************************** ADD */

async function addWorker(): Promise<void> {
  workers.value.push({
    entity: {
      status: Status.ACTIVE,
      phoneCountryCode: '+351',
      defaultHours: 8,
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

async function save(row: WorkerRow): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (row._isNew) {
      await workerApi.addWorker(row.entity);
    }

    if (row._isEdited) {
      await workerApi.editWorker(row.entity);
    }

    await fetchWorkers();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Worker saved successfully.',
    };
  } catch (error: unknown) {
    let message = 'Failed to save worker.';

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
const workerToDelete = ref<WorkerRow | null>(null);

function askDelete(row: WorkerRow) {
  workerToDelete.value = row;
  showDeleteDialog.value = true;
}

async function confirmDelete(): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (!workerToDelete.value?.entity.id) {
      return;
    }

    await workerApi.deleteWorker(workerToDelete.value.entity.id);
    await fetchWorkers();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Worker deleted successfully.',
    };

    showDeleteDialog.value = false;
    workerToDelete.value = null;
  } catch (error: unknown) {
    let message = 'Failed to delete worker.';

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

const workerFilters = ref<WorkerFilters>({});

const hasActiveTableControls = computed(() =>
  Object.values(workerFilters.value).some((value) => value !== undefined && value !== null && value !== ''),
);

function setSort(event: { column: WorkerSortField; direction: SortDirection | undefined }): void {
  workerFilters.value = {
    ...workerFilters.value,
    sortBy: event.direction ? event.column : undefined,
    sortDirection: event.direction,
  };

  fetchWorkers();
}

function applyFilterValues(values: Record<string, unknown>): void {
  workerFilters.value = { ...workerFilters.value, ...(values as Partial<WorkerFilters>) };

  fetchWorkers();
}

function clearFilterValues(values: Record<string, unknown>): void {
  workerFilters.value = { ...workerFilters.value, ...(values as Partial<WorkerFilters>) };

  fetchWorkers();
}

function clearAllTableControls(): void {
  workerFilters.value = {};

  void fetchWorkers();
}

onMounted(fetchWorkers);
</script>
<style scoped lang="scss">
.phone-input {
  display: flex;
}

.country-code {
  width: 40px;
  border-right: none;
  border-radius: 4px 0 0 4px;
}

.phone-number {
  border-radius: 0 4px 4px 0;
}
</style>
