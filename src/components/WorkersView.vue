<template>
  <div class="main-section">
    <div class="section-header">
      <span><Contact :size="24" /></span>
      <h3>Colaboradores</h3>

      <div class="page-nav">
        <RouterLink to="/" class="link"> Página Inicial </RouterLink>
        <ChevronRight :size="14" class="separator" />
        <RouterLink :to="{ path: '/', query: { tab: 'hr' } }" class="link"> Recursos Humanos </RouterLink>
      </div>
    </div>

    <div class="section">
      <div v-if="apiStatus.isLoading" class="loading-overlay">
        <div>
          <LoaderCircle :size="18" class="spinner" />
          A carregar colaboradores...
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

                    <InfoTooltip
                      v-if="config.additionalInfo"
                      :title="config.additionalInfo.tooltipTitle"
                      :items="config.additionalInfo.tooltipItems"
                      :info="config.additionalInfo.tooltipInfo"
                    />

                    <TableColumnFilter
                      :config="config"
                      :filters="workerFilters"
                      :sort-by="workerFilters.sortBy"
                      :sort-direction="workerFilters.sortDirection"
                      :disabled="workersTable.isEditing.value"
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
                    :disabled="workersTable.isEditing.value || apiStatus.isLoading"
                    title="Limpar todos os filtros e ordenação"
                    aria-label="Limpar todos os filtros e ordenação"
                    @click="clearAllTableControls"
                  >
                    <FunnelX :size="16" />
                  </button>
                </th>
              </tr>
            </thead>
            <EntityTableBody :rows="workersTable">
              <template #row-actions="{ row }">
                <button title="Eliminar colaborador" :disabled="workersTable.isEditing.value" @click="askDelete(row)">
                  <Trash2 :size="16" />
                </button>
                <button title="Editar colaborador" :disabled="workersTable.isEditing.value" @click="startEditing(row)">
                  <Pencil :size="16" />
                </button>
                <button
                  title="Editar compensações"
                  :disabled="workersTable.isEditing.value"
                  @click="startEditingCompensation(row)"
                >
                  <HandCoins :size="16" />
                </button>
              </template>
            </EntityTableBody>
          </table>
        </div>

        <div class="actions">
          <button class="btn" :disabled="workersTable.isEditing.value || apiStatus.isLoading" @click="add">
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
    :message="[
      `${workerToDelete?.entity.name}' - NIF ${workerToDelete?.entity.nif}`,
      'Tem a certeza que quer eliminar definitivamente este colaborador?',
    ]"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="confirmDelete"
  />

  <!-- edit compensatio -->
  <EditCompensationDialog v-model="showCompensationDialog" :worker="selectedWorker" @save="saveCompensation" />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick, toRaw } from 'vue';
import workerApi from '@/services/worker-api';
import { WorkerType, WorkerFilters, WorkerSortField } from '@/types/worker-type';
import { ApiResponseStatus } from '@/types/api-response-status';
import { ChevronRight, Contact, Plus, LoaderCircle, FunnelX, Trash2, Pencil, HandCoins } from 'lucide-vue-next';
import Toast from '@/components/Toast.vue';
import TableColumnFilter from '@/components/TableColumnFilter.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { Worker } from '@/entities/worker';
import { EntityTableBodyProps, TableRow } from '@/types/entity-configs';
import EntityTableBody from '@/components/EntityTableBody.vue';
import { apiError } from '@/services/api';
import InfoTooltip from '@/components/InfoTooltip.vue';
import EditCompensationDialog from '@/components/EditCompensationDialog.vue';
import { useTableFilters } from '@/composables/useTableFilters';
import { useConfigs } from '@/composables/useConfigs';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const tableBody = ref<HTMLTableSectionElement | null>(null);

const status = useConfigs().statusOptions;

const workers = ref<WorkerRow[]>([]);
const configs = computed(() => Worker.getConfigs());

const isEditing = ref(false);
const workersTable = computed<EntityTableBodyProps<WorkerType, WorkerSortField>>(() => ({
  rows: workers.value,
  configs: configs.value,
  handlers: {
    edit: startEditing,
    delete: askDelete,
    save,
    discard,
  },
  rowIsActive: isActive,
  isValid: (worker) => Worker.isValid(worker, configs.value),
  isEditing: isEditing,
}));

/*************************************************************************************************************** LOAD */

onMounted(async () => {
  await fetch();
});

async function fetch() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotWorkers = await workerApi.searchWorkers(workerFilters.value);

    workers.value = gotWorkers.map((worker) => ({
      entity: structuredClone(worker),
      _key: worker.code ?? nextKey(),
      _isNew: false,
      _isEdited: false,
      _isDeleted: false,
    }));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load workers.');
  }
}

/******************************************************************************************************** ROW ACTIONS */

interface WorkerRow extends TableRow<WorkerType> {}

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

  isEditing.value = false;
}

function isActive(row: WorkerRow) {
  return row.entity.status == status.value.ACTIVE.code;
}

/*************************************************************************************************************** EDIT */

function startEditing(row: WorkerRow) {
  isEditing.value = true;

  row._isEdited = true;
  row._original = JSON.parse(JSON.stringify(toRaw(row.entity)));
}

/**************************************************************************************************************** ADD */

async function add(): Promise<void> {
  isEditing.value = true;

  workers.value.push({
    entity: {
      status: status.value.ACTIVE.code,
      phoneCountryCode: '+351',
      currentWorkerCompensation: {
        defaultHours: 8,
      },
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
    } else if (row._isEdited) {
      await workerApi.editWorker(row.entity);
    }

    await fetch();
    isEditing.value = false;

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Worker saved successfully.',
    };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to save worker.');
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
    await fetch();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Worker deleted successfully.',
    };

    showDeleteDialog.value = false;
    workerToDelete.value = null;
  } catch (error: unknown) {
    await fetch();
    apiStatus.value = apiError(error, 'Failed to delete worker.');
  }
}

/************************************************************************************************************ FILTERS */

const {
  filters: workerFilters,
  hasActiveTableControls,
  setSort,
  applyFilterValues,
  clearFilterValues,
  clearAllTableControls,
} = useTableFilters<WorkerFilters>(fetch);

/******************************************************************************************************* COMPENSATION */

const showCompensationDialog = ref(false);
const selectedWorker = ref<WorkerType | null>(null);

function startEditingCompensation(row: TableRow<WorkerType>) {
  selectedWorker.value = JSON.parse(JSON.stringify(toRaw(row.entity)));
  showCompensationDialog.value = true;
}

async function saveCompensation(worker: WorkerType) {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const compensation = worker.currentWorkerCompensation;

    if (!compensation) {
      return;
    }

    if (worker.workerContractType === 'CONTRACTOR') {
      compensation.monthlySalary = undefined;
      compensation.tsu = undefined;
      compensation.mealAllowance = undefined;
      compensation.accidentInsurance = undefined;
    } else {
      compensation.hourRate = undefined;
    }

    await workerApi.updateCompensation(worker);
    await fetch();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Compensation updated successfully.',
    };

    showCompensationDialog.value = false;
  } catch (error: unknown) {
    await fetch();
    apiStatus.value = apiError(error, 'Failed to update compensation.');
  }
}
</script>
<style lang="scss"></style>
