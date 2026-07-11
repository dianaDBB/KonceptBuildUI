<template>
  <div class="main-section">
    <div class="section-header">
      <span><User :size="24" /></span>
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
              <col style="width: 34%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 6%" />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <div class="column-heading">
                    Nome
                    <TableColumnFilter
                      :config="workerFilterConfigs.name"
                      :filters="workerFilters"
                      :sort-by="workerFilters.sortBy"
                      :sort-direction="workerFilters.sortDirection"
                      :disabled="isEditing"
                      @sort="toggleSort(WorkerSortField.NAME)"
                      @apply="applyFilterValues"
                      @clear="clearFilterValues"
                    />
                  </div>
                </th>
                <th>
                  <div class="column-heading">
                    Tipo
                    <TableColumnFilter
                      :config="workerFilterConfigs.workerType"
                      :filters="workerFilters"
                      :sort-by="workerFilters.sortBy"
                      :sort-direction="workerFilters.sortDirection"
                      :disabled="isEditing"
                      @sort="toggleSort(WorkerSortField.WORKER_TYPE)"
                      @apply="applyFilterValues"
                      @clear="clearFilterValues"
                    />
                  </div>
                </th>
                <th>
                  <div class="column-heading">
                    Custo Hora
                    <TableColumnFilter
                      :config="workerFilterConfigs.hourCost"
                      :filters="workerFilters"
                      :sort-by="workerFilters.sortBy"
                      :sort-direction="workerFilters.sortDirection"
                      :disabled="isEditing"
                      @sort="toggleSort(WorkerSortField.HOUR_COST)"
                      @apply="applyFilterValues"
                      @clear="clearFilterValues"
                    />
                  </div>
                </th>
                <th>
                  <div class="column-heading">
                    Salário Mensal
                    <TableColumnFilter
                      :config="workerFilterConfigs.monthlySalary"
                      :filters="workerFilters"
                      :sort-by="workerFilters.sortBy"
                      :sort-direction="workerFilters.sortDirection"
                      :disabled="isEditing"
                      @sort="toggleSort(WorkerSortField.MONTHLY_SALARY)"
                      @apply="applyFilterValues"
                      @clear="clearFilterValues"
                    />
                  </div>
                </th>
                <th>
                  <div class="column-heading">
                    Rate Hora
                    <TableColumnFilter
                      :config="workerFilterConfigs.hourRate"
                      :filters="workerFilters"
                      :sort-by="workerFilters.sortBy"
                      :sort-direction="workerFilters.sortDirection"
                      :disabled="isEditing"
                      @sort="toggleSort(WorkerSortField.HOUR_RATE)"
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
            <tbody ref="tableBody">
              <tr v-for="row in workers" :key="row._key" :class="{ deleted: row._isDeleted }">
                <!-- NAME -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.worker.name"
                      type="text"
                      :class="{ required: !row.worker.name }"
                      @change="row._isEdited = true"
                    />
                  </template>
                  <template v-else>
                    {{ row.worker.name }}
                  </template>
                </td>

                <!-- WORKER TYPE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <select
                      v-model="row.worker.workerType"
                      :class="{ required: !row.worker.workerType }"
                      @change="row._isEdited = true"
                    >
                      <option v-for="type in ['CONTRACTOR', 'INTERNAL']" :key="type" :value="type">
                        {{ type }}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    {{ row.worker.workerType }}
                  </template>
                </td>

                <!-- HOUR COST -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="row.worker.hourCost?.toFixed(2)"
                      :disabled="true"
                      type="text"
                      inputmode="decimal"
                      :class="{ required: false }"
                    />
                  </template>
                  <template v-else> {{ row.worker.hourCost?.toFixed(2) }} € </template>
                </td>

                <!-- MONTLHY SALARY -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="row.worker.monthlySalary?.toFixed(2)"
                      :disabled="row.worker.workerType?.trim() == '' || row.worker.workerType == 'CONTRACTOR'"
                      type="text"
                      inputmode="decimal"
                      :class="{ required: row.worker.workerType == 'INTERNAL' && !row.worker.monthlySalary }"
                      @input="handleMoneyInput($event, row, 'monthlySalary')"
                      @change="row._isEdited = true"
                    />
                  </template>
                  <template v-else>
                    {{ row.worker.monthlySalary ? `${row.worker.monthlySalary.toFixed(2)} €` : '-' }}
                  </template>
                </td>

                <!-- HOUR RATE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="row.worker.hourRate?.toFixed(2)"
                      :disabled="
                        !rowHasChanges(row) ||
                        row.worker.workerType?.trim() == '' ||
                        row.worker.workerType == 'INTERNAL'
                      "
                      type="text"
                      inputmode="decimal"
                      :class="{ required: row.worker.workerType == 'CONTRACTOR' && !row.worker.hourRate }"
                      @input="handleMoneyInput($event, row, 'hourRate')"
                      @change="row._isEdited = true"
                    />
                  </template>
                  <template v-else>
                    {{ row.worker.hourRate ? `${row.worker.hourRate.toFixed(2)} €` : '-' }}
                  </template>
                </td>

                <!-- ACTIONS -->
                <td>
                  <div v-if="!rowHasChanges(row)" class="action-buttons">
                    <button :disabled="isEditing"><Trash2 :size="16" /></button>
                    <button :disabled="isEditing" @click="editWorker(row)">
                      <Pencil :size="16" />
                    </button>
                  </div>
                  <div v-if="rowHasChanges(row)" class="action-buttons editing">
                    <button @click="discardRow(row)"><Undo2 :size="16" /></button>
                    <button :disabled="!isRowValid(row)" @click="saveWorker(row)">
                      <Check :size="16" />
                    </button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div v-if="apiStatus.isLoading" class="table-loading-overlay">
            <div>
              <LoaderCircle :size="18" class="spinner" />
              A carregar colaboradores...
            </div>
          </div>
        </div>

        <div class="actions">
          <button :disabled="isEditing" @click="addWorker"><Plus :size="18" /> Adicionar Colaborador</button>
        </div>

        <Toast
          v-if="apiStatus.message"
          :message="apiStatus.message"
          :type="apiStatus.isSuccess ? 'success' : 'error'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import api from '@/services/api';
import { Worker, WorkerFilters, WorkerSortField } from '@/types/worker';
import { ApiResponseStatus } from '@/types/api-response-status';
import { User, Pencil, Trash2, Check, Undo2, Plus, LoaderCircle, FunnelX } from 'lucide-vue-next';
import Toast from '@/composables/Toast.vue';
import { SortDirection } from '@/types/sort-direction';
import TableColumnFilter from '@/components/TableColumnFilter.vue';
import { TableFilterKind, type TableColumnFilterConfig } from '@/types/table-filter';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const isEditing = computed(() => workers.value.some((row) => row._isNew || row._isEdited));

const tableBody = ref<HTMLTableSectionElement | null>(null);

function editWorker(row: WorkerRow) {
  row._isEdited = true;

  row._original = structuredClone({ ...row.worker });
}

function discardRow(row: WorkerRow) {
  if (row._isNew) {
    workers.value = workers.value.filter((w) => w._key !== row._key);
  } else {
    row.worker = row._original!;
    row._isNew = false;
    row._isEdited = false;
    row._isDeleted = false;
  }
}

function rowHasChanges(row: WorkerRow) {
  return row._isNew || row._isEdited || row._isDeleted;
}

interface WorkerRow {
  worker: Worker;
  _key: string;
  _isNew: boolean;
  _isEdited: boolean;
  _isDeleted: boolean;
  _original?: Worker;
}

const workers = ref<WorkerRow[]>([]);

let _keyCounter = 0;
function nextKey(): string {
  return `row-${++_keyCounter}`;
}

function isRowValid(row: WorkerRow) {
  return (
    row.worker.name?.trim() &&
    row.worker.workerType?.trim() &&
    ((row.worker.workerType === 'CONTRACTOR' && row.worker.hourRate != null && row.worker.hourRate > 0) ||
      (row.worker.workerType === 'INTERNAL' && row.worker.monthlySalary != null && row.worker.monthlySalary > 0))
  );
}

function handleMoneyInput(event: Event, row: WorkerRow, field: keyof Pick<Worker, 'monthlySalary' | 'hourRate'>) {
  const input = event.target as HTMLInputElement;
  const digits = input.value.replace(/\D/g, '');
  const value = Number(digits) / 100;

  row.worker[field] = value;
  input.value = value.toFixed(2);
}

async function addWorker(): Promise<void> {
  workers.value.push({
    worker: {
      id: '',
      name: '',
      workerType: '',
      hourRate: undefined,
      monthlySalary: undefined,
      hourCost: undefined,
    },
    _key: nextKey(),
    _isNew: true,
    _isEdited: false,
    _isDeleted: false,
  });

  await nextTick();

  const lastRow = tableBody.value?.querySelector('tr:last-child');
  lastRow?.scrollIntoView({
    behavior: 'smooth',
    block: 'nearest',
  });

  (lastRow?.querySelector('input') as HTMLInputElement)?.focus();
}

async function saveWorker(row: WorkerRow): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    await api.addWorker(row.worker);
    await fetchWorkers();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Workers added successfully.',
    };
  } catch (error: unknown) {
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to add workers.',
    };
  }
}

/** FILTERS */

const workerFilters = ref<WorkerFilters>({});

const hasActiveTableControls = computed(() =>
  Object.values(workerFilters.value).some((value) => value !== undefined && value !== null && value !== ''),
);

const workerFilterConfigs = {
  name: {
    column: WorkerSortField.NAME,
    label: 'Nome',
    kind: TableFilterKind.TEXT,
    valueKey: 'name',
    dropdownAlign: 'start',
  },
  workerType: {
    column: WorkerSortField.WORKER_TYPE,
    label: 'Tipo',
    kind: TableFilterKind.SELECT,
    valueKey: 'workerType',
    options: [
      { label: 'INTERNAL', value: 'INTERNAL' },
      { label: 'CONTRACTOR', value: 'CONTRACTOR' },
    ],
  },
  hourCost: {
    column: WorkerSortField.HOUR_COST,
    label: 'Custo Hora',
    kind: TableFilterKind.NUMBER_RANGE,
    minKey: 'minHourCost',
    maxKey: 'maxHourCost',
  },
  monthlySalary: {
    column: WorkerSortField.MONTHLY_SALARY,
    label: 'Salário Mensal',
    kind: TableFilterKind.NUMBER_RANGE,
    minKey: 'minMonthlySalary',
    maxKey: 'maxMonthlySalary',
  },
  hourRate: {
    column: WorkerSortField.HOUR_RATE,
    label: 'Rate Hora',
    kind: TableFilterKind.NUMBER_RANGE,
    minKey: 'minHourRate',
    maxKey: 'maxHourRate',
  },
} satisfies Record<string, TableColumnFilterConfig<WorkerSortField>>;

function isSorted(column: WorkerSortField, direction?: SortDirection): boolean {
  return workerFilters.value.sortBy === column && (!direction || workerFilters.value.sortDirection === direction);
}

function toggleSort(column: WorkerSortField): void {
  if (!isSorted(column)) {
    workerFilters.value = { ...workerFilters.value, sortBy: column, sortDirection: SortDirection.ASC };
  } else if (isSorted(column, SortDirection.ASC)) {
    workerFilters.value = { ...workerFilters.value, sortDirection: SortDirection.DESC };
  } else {
    workerFilters.value = { ...workerFilters.value, sortBy: undefined, sortDirection: undefined };
  }

  void fetchWorkers();
}

function applyFilterValues(values: Record<string, unknown>): void {
  workerFilters.value = { ...workerFilters.value, ...(values as Partial<WorkerFilters>) };
  void fetchWorkers();
}

function clearFilterValues(values: Record<string, unknown>): void {
  workerFilters.value = { ...workerFilters.value, ...(values as Partial<WorkerFilters>) };
  void fetchWorkers();
}

function clearAllTableControls(): void {
  workerFilters.value = {};
  void fetchWorkers();
}

async function fetchWorkers() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotWorkers = await api.getAllWorkers(workerFilters.value);

    workers.value = gotWorkers.map((worker) => ({
      worker: {
        ...worker,
        hourCost: worker.hourCost ? parseFloat(worker.hourCost.toFixed(2)) : undefined,
        monthlySalary: worker.monthlySalary ? parseFloat(worker.monthlySalary.toFixed(2)) : undefined,
        hourRate: worker.hourRate ? parseFloat(worker.hourRate.toFixed(2)) : undefined,
      },
      _key: worker.id ?? nextKey(),
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

onMounted(fetchWorkers);
</script>

<style scoped lang="scss"></style>
