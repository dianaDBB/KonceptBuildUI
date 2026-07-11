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
              <col style="width: 38%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 15%" />
              <col style="width: 2%" />
            </colgroup>
            <thead>
              <tr>
                <th>
                  <div class="column-heading">
                    Nome
                    <div class="column-heading-actions">
                      <button
                        class="column-sort-button"
                        :class="{ active: isSorted(WorkerSortField.NAME) }"
                        :disabled="isEditing"
                        :title="sortButtonTitle(WorkerSortField.NAME)"
                        @click="toggleSort(WorkerSortField.NAME)"
                      >
                        <ChevronDown v-if="isSorted(WorkerSortField.NAME, SortDirection.ASC)" :size="15" />
                        <ChevronUp v-else-if="isSorted(WorkerSortField.NAME, SortDirection.DESC)" :size="15" />
                        <ArrowUpDown v-else :size="15" />
                      </button>
                      <button
                        class="column-filter-button"
                        :class="{ active: hasColumnFilter(WorkerSortField.NAME) }"
                        :disabled="isEditing"
                        @click="openFilter(WorkerSortField.NAME, $event)"
                      >
                        <SlidersHorizontal :size="15" />
                      </button>
                    </div>
                  </div>
                </th>
                <th>
                  <div class="column-heading">
                    Tipo
                    <div class="column-heading-actions">
                      <button
                        class="column-sort-button"
                        :class="{ active: isSorted(WorkerSortField.WORKER_TYPE) }"
                        :disabled="isEditing"
                        :title="sortButtonTitle(WorkerSortField.WORKER_TYPE)"
                        @click="toggleSort(WorkerSortField.WORKER_TYPE)"
                      >
                        <ChevronDown v-if="isSorted(WorkerSortField.WORKER_TYPE, SortDirection.ASC)" :size="15" />
                        <ChevronUp v-else-if="isSorted(WorkerSortField.WORKER_TYPE, SortDirection.DESC)" :size="15" />
                        <ArrowUpDown v-else :size="15" />
                      </button>
                      <button
                        class="column-filter-button"
                        :class="{ active: hasColumnFilter(WorkerSortField.WORKER_TYPE) }"
                        :disabled="isEditing"
                        @click="openFilter(WorkerSortField.WORKER_TYPE, $event)"
                      >
                        <SlidersHorizontal :size="15" />
                      </button>
                    </div>
                  </div>
                </th>
                <th>
                  <div class="column-heading">
                    Custo Hora
                    <div class="column-heading-actions">
                      <button
                        class="column-sort-button"
                        :class="{ active: isSorted(WorkerSortField.HOUR_COST) }"
                        :disabled="isEditing"
                        :title="sortButtonTitle(WorkerSortField.HOUR_COST)"
                        @click="toggleSort(WorkerSortField.HOUR_COST)"
                      >
                        <ChevronDown v-if="isSorted(WorkerSortField.HOUR_COST, SortDirection.ASC)" :size="15" />
                        <ChevronUp v-else-if="isSorted(WorkerSortField.HOUR_COST, SortDirection.DESC)" :size="15" />
                        <ArrowUpDown v-else :size="15" />
                      </button>
                      <button
                        class="column-filter-button"
                        :class="{ active: hasColumnFilter(WorkerSortField.HOUR_COST) }"
                        :disabled="isEditing"
                        @click="openFilter(WorkerSortField.HOUR_COST, $event)"
                      >
                        <SlidersHorizontal :size="15" />
                      </button>
                    </div>
                  </div>
                </th>
                <th>
                  <div class="column-heading">
                    Salário Mensal
                    <div class="column-heading-actions">
                      <button
                        class="column-sort-button"
                        :class="{ active: isSorted(WorkerSortField.MONTHLY_SALARY) }"
                        :disabled="isEditing"
                        :title="sortButtonTitle(WorkerSortField.MONTHLY_SALARY)"
                        @click="toggleSort(WorkerSortField.MONTHLY_SALARY)"
                      >
                        <ChevronDown v-if="isSorted(WorkerSortField.MONTHLY_SALARY, SortDirection.ASC)" :size="15" />
                        <ChevronUp
                          v-else-if="isSorted(WorkerSortField.MONTHLY_SALARY, SortDirection.DESC)"
                          :size="15"
                        />
                        <ArrowUpDown v-else :size="15" />
                      </button>
                      <button
                        class="column-filter-button"
                        :class="{ active: hasColumnFilter(WorkerSortField.MONTHLY_SALARY) }"
                        :disabled="isEditing"
                        @click="openFilter(WorkerSortField.MONTHLY_SALARY, $event)"
                      >
                        <SlidersHorizontal :size="15" />
                      </button>
                    </div>
                  </div>
                </th>
                <th>
                  <div class="column-heading">
                    Rate Hora
                    <div class="column-heading-actions">
                      <button
                        class="column-sort-button"
                        :class="{ active: isSorted(WorkerSortField.HOUR_RATE) }"
                        :disabled="isEditing"
                        :title="sortButtonTitle(WorkerSortField.HOUR_RATE)"
                        @click="toggleSort(WorkerSortField.HOUR_RATE)"
                      >
                        <ChevronDown v-if="isSorted(WorkerSortField.HOUR_RATE, SortDirection.ASC)" :size="15" />
                        <ChevronUp v-else-if="isSorted(WorkerSortField.HOUR_RATE, SortDirection.DESC)" :size="15" />
                        <ArrowUpDown v-else :size="15" />
                      </button>
                      <button
                        class="column-filter-button"
                        :class="{ active: hasColumnFilter(WorkerSortField.HOUR_RATE) }"
                        :disabled="isEditing"
                        title="Filtrar rate/hora"
                        @click="openFilter(WorkerSortField.HOUR_RATE, $event)"
                      >
                        <SlidersHorizontal :size="15" />
                      </button>
                    </div>
                  </div>
                </th>
                <th></th>
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
        </div>

        <form
          v-if="activeFilterColumn"
          ref="filterDropdown"
          class="filter-dropdown"
          :style="filterDropdownStyle"
          @submit.prevent="applyColumnFilter"
        >
          <div class="filter-popover-header">
            <h4>{{ filterTitle }}</h4>
            <button type="button" class="close-filter-button" aria-label="Fechar filtros" @click="closeFilter">
              <X :size="18" />
            </button>
          </div>

          <label v-if="activeFilterColumn === WorkerSortField.NAME">
            <input v-model.trim="filterDraft.name" type="text" placeholder="Pesquisar por nome" />
          </label>

          <label v-else-if="activeFilterColumn === WorkerSortField.WORKER_TYPE">
            <select v-model="filterDraft.workerType">
              <option value="">Todos os tipos</option>
              <option value="INTERNAL">INTERNAL</option>
              <option value="CONTRACTOR">CONTRACTOR</option>
            </select>
          </label>

          <div v-else class="range-fields">
            <label>
              <input v-model.number="filterDraft[minFilterKey]" type="number" min="0" step="0.01" />
            </label>
            <label> - </label>
            <label>
              <input v-model.number="filterDraft[maxFilterKey]" type="number" min="0" step="0.01" />
            </label>
          </div>

          <div class="filter-popover-actions">
            <button type="button" class="clear-filter-button" @click="clearColumnFilter">Limpar</button>
            <button type="submit" class="apply-filter-button">Aplicar</button>
          </div>
        </form>

        <div class="actions">
          <button :disabled="isEditing" @click="addWorker"><Plus :size="18" /> Add Worker</button>
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
import { ref, onMounted, onBeforeUnmount, computed, nextTick } from 'vue';
import api from '@/services/api';
import { Worker, WorkerFilters, WorkerSortField } from '@/types/worker';
import { ApiResponseStatus } from '@/types/api-response-status';
import {
  User,
  Pencil,
  Trash2,
  Check,
  Undo2,
  Plus,
  SlidersHorizontal,
  ChevronUp,
  ChevronDown,
  ArrowUpDown,
  X,
} from 'lucide-vue-next';
import Toast from '@/composables/Toast.vue';
import { SortDirection } from '@/types/sort-direction';

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

type RangeFilterColumn =
  | WorkerSortField.HOUR_COST
  | WorkerSortField.MONTHLY_SALARY
  | WorkerSortField.HOUR_RATE;

const activeFilterColumn = ref<WorkerSortField | null>(null);
const filterDraft = ref<WorkerFilters>({});
const filterDropdownPosition = ref({ top: 0, left: 0 });
const filterDropdown = ref<HTMLFormElement | null>(null);

const filterDropdownStyle = computed(() => ({
  top: `${filterDropdownPosition.value.top}px`,
  left: `${filterDropdownPosition.value.left}px`,
}));

const filterTitle = computed(() => {
  const labels: Record<WorkerSortField, string> = {
    [WorkerSortField.NAME]: 'Nome',
    [WorkerSortField.WORKER_TYPE]: 'Tipo',
    [WorkerSortField.HOUR_COST]: 'Custo Hora',
    [WorkerSortField.MONTHLY_SALARY]: 'Salário Mensal',
    [WorkerSortField.HOUR_RATE]: 'Rate Hora',
  };

  return activeFilterColumn.value ? `Filtrar por - ${labels[activeFilterColumn.value]}` : '';
});

const minFilterKey = computed<'minHourCost' | 'minMonthlySalary' | 'minHourRate'>(() => {
  const keys: Record<RangeFilterColumn, 'minHourCost' | 'minMonthlySalary' | 'minHourRate'> = {
    [WorkerSortField.HOUR_COST]: 'minHourCost',
    [WorkerSortField.MONTHLY_SALARY]: 'minMonthlySalary',
    [WorkerSortField.HOUR_RATE]: 'minHourRate',
  };

  return keys[activeFilterColumn.value as RangeFilterColumn] ?? 'minHourRate';
});

const maxFilterKey = computed<'maxHourCost' | 'maxMonthlySalary' | 'maxHourRate'>(() => {
  const keys: Record<RangeFilterColumn, 'maxHourCost' | 'maxMonthlySalary' | 'maxHourRate'> = {
    [WorkerSortField.HOUR_COST]: 'maxHourCost',
    [WorkerSortField.MONTHLY_SALARY]: 'maxMonthlySalary',
    [WorkerSortField.HOUR_RATE]: 'maxHourRate',
  };

  return keys[activeFilterColumn.value as RangeFilterColumn] ?? 'maxHourRate';
});

function openFilter(column: WorkerSortField, event: MouseEvent): void {
  const button = event.currentTarget as HTMLButtonElement;
  const bounds = button.getBoundingClientRect();
  const dropdownWidth = 380;

  filterDropdownPosition.value = {
    top: Math.max(12, Math.min(bounds.bottom + 8, window.innerHeight - 300)),
    left: Math.max(12, Math.min(bounds.right - dropdownWidth, window.innerWidth - dropdownWidth - 12)),
  };
  activeFilterColumn.value = column;
  filterDraft.value = copyWorkerFilters(workerFilters.value);
}

function closeFilter(): void {
  activeFilterColumn.value = null;
}

function closeFilterOnOutsideClick(event: MouseEvent): void {
  if (activeFilterColumn.value && !filterDropdown.value?.contains(event.target as Node)) {
    closeFilter();
  }
}

function hasColumnFilter(column: WorkerSortField): boolean {
  switch (column) {
    case WorkerSortField.NAME:
      return Boolean(workerFilters.value.name);
    case WorkerSortField.WORKER_TYPE:
      return Boolean(workerFilters.value.workerType);
    case WorkerSortField.HOUR_COST:
      return workerFilters.value.minHourCost != null || workerFilters.value.maxHourCost != null;
    case WorkerSortField.MONTHLY_SALARY:
      return workerFilters.value.minMonthlySalary != null || workerFilters.value.maxMonthlySalary != null;
    case WorkerSortField.HOUR_RATE:
      return workerFilters.value.minHourRate != null || workerFilters.value.maxHourRate != null;
  }
}

function isSorted(column: WorkerSortField, direction?: SortDirection): boolean {
  return workerFilters.value.sortBy === column && (!direction || workerFilters.value.sortDirection === direction);
}

function sortButtonTitle(column: WorkerSortField): string {
  if (!isSorted(column)) return 'Ordenar: ascendente';
  if (isSorted(column, SortDirection.ASC)) return 'Ordenar: descendente';
  return 'Remover ordenação';
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

function clearColumnFilter(): void {
  const column = activeFilterColumn.value;
  if (!column) return;

  if (column === WorkerSortField.NAME) filterDraft.value.name = undefined;
  if (column === WorkerSortField.WORKER_TYPE) filterDraft.value.workerType = '';
  if (column === WorkerSortField.HOUR_COST) {
    filterDraft.value.minHourCost = undefined;
    filterDraft.value.maxHourCost = undefined;
  }
  if (column === WorkerSortField.MONTHLY_SALARY) {
    filterDraft.value.minMonthlySalary = undefined;
    filterDraft.value.maxMonthlySalary = undefined;
  }
  if (column === WorkerSortField.HOUR_RATE) {
    filterDraft.value.minHourRate = undefined;
    filterDraft.value.maxHourRate = undefined;
  }
  workerFilters.value = copyWorkerFilters(filterDraft.value);
  closeFilter();
  void fetchWorkers();
}

function applyColumnFilter(): void {
  workerFilters.value = copyWorkerFilters(filterDraft.value);
  closeFilter();
  void fetchWorkers();
}

function copyWorkerFilters(filters: WorkerFilters): WorkerFilters {
  return { ...filters };
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

onMounted(() => {
  document.addEventListener('mousedown', closeFilterOnOutsideClick);
  void fetchWorkers();
});

onBeforeUnmount(() => {
  document.removeEventListener('mousedown', closeFilterOnOutsideClick);
});
</script>

<style scoped lang="scss">
.column-heading {
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 0.4rem;
}

.column-heading-actions {
  display: inline-flex;
  align-items: center;
  gap: 0.1rem;
}

.column-filter-button,
.column-sort-button,
.close-filter-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
}

.column-filter-button,
.column-sort-button {
  width: 27px;
  height: 27px;
  border-radius: 6px;

  &:hover:not(:disabled),
  &.active {
    background: var(--color-primary-light);
    color: var(--color-primary);
  }
}

.filter-dropdown {
  position: fixed;
  z-index: 20;
  width: min(380px, calc(100vw - 24px));
  max-height: calc(100vh - 24px);
  overflow-y: auto;
  padding: 1.25rem;
  border: 1px solid var(--color-border-light);
  border-radius: 12px;
  background: var(--color-background);
  box-shadow: var(--shadow-hover);

  label {
    display: grid;
    gap: 0.4rem;
    color: var(--color-text-secondary);
    font-weight: 500;
  }

  input,
  select {
    width: 100%;
  }
}

.filter-popover-header,
.filter-popover-actions {
  display: flex;
  align-items: center;
}

.filter-popover-header {
  justify-content: space-between;
  margin-bottom: 1.25rem;

  h4 {
    font-size: 1rem;
  }
}

.range-fields {
  display: grid;
  grid-template-columns: 1fr 0fr 1fr;
  gap: 0.75rem;
}

.filter-popover-actions {
  margin-top: 1.25rem;
  justify-content: flex-end;
  gap: 0.75rem;

  button {
    padding: 0.5rem 0.8rem;
    border-radius: 6px;
    cursor: pointer;
  }
}

.clear-filter-button {
  border: 0;
  background: transparent;
  color: var(--color-text-muted);
}

.apply-filter-button {
  border: 1px solid var(--color-primary);
  background: var(--color-primary);
  color: white;
}
</style>
