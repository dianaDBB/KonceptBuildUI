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
              <!-- code -->
              <col style="width: 90px" />
              <!-- name -->
              <col style="width: 150px" />
              <!-- nif -->
              <col style="width: 95px" />
              <!-- status -->
              <col style="width: 90px" />
              <!-- phone -->
              <col style="width: 140px" />
              <!-- email -->
              <col style="width: 150px" />
              <!-- function -->
              <col style="width: 100px" />
              <!-- hourCost -->
              <col style="width: 100px" />
              <!-- defaultHours -->
              <col style="width: 100px" />
              <!-- workerContractType -->
              <col style="width: 100px" />
              <!-- hourRate -->
              <col style="width: 80px" />
              <!-- monthlySalary -->
              <col style="width: 100px" />
              <!-- tsu -->
              <col style="width: 80px" />
              <!-- mealAllowance -->
              <col style="width: 100px" />
              <!-- accidentInsurance -->
              <col style="width: 100px" />
              <!-- startDate -->
              <col style="width: 130px" />
              <!-- endDate -->
              <col style="width: 130px" />
              <!-- ACTIONS -->
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
            <tbody ref="tableBody">
              <tr
                v-for="row in workers"
                :key="row._key"
                :class="{ disabled: !workerIsActive(row) }"
                @dblclick="startEditWorker(row)"
              >
                <!-- CODE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.worker.code"
                      type="text"
                      :disabled="Worker.configs.code.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.code.isInvalid(row.worker) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.worker.code }}
                  </template>
                </td>

                <!-- NAME -->
                <td :class="{ highlight: workerIsActive(row) }">
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.worker.name"
                      type="text"
                      :disabled="Worker.configs.name.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.name.isInvalid(row.worker) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.worker.name }}
                  </template>
                </td>

                <!-- NIF -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.worker.nif"
                      type="text"
                      :disabled="Worker.configs.nif.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.nif.isInvalid(row.worker) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.worker.nif }}
                  </template>
                </td>

                <!-- STATUS -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <select
                      v-model="row.worker.status"
                      :disabled="Worker.configs.status.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.status.isInvalid(row.worker) }"
                    >
                      <option v-for="option in Worker.configs.status.options" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    {{ Status.getLabel(row.worker.status) }}
                  </template>
                </td>

                <!-- PHONE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <div class="phone-input">
                      <input
                        v-model="row.worker.phoneCountryCode"
                        inputmode="text"
                        pattern="[0-9]{9}"
                        maxlength="4"
                        placeholder="+351"
                        :disabled="Worker.configs.phone.showDisabled(row.worker)"
                        :class="{ required: Worker.configs.phone.isInvalid(row.worker) }"
                        class="country-code"
                      />
                      <input
                        v-model="row.worker.phone"
                        type="tel"
                        inputmode="numeric"
                        pattern="[0-9]{9}"
                        maxlength="9"
                        :disabled="Worker.configs.phone.showDisabled(row.worker)"
                        :class="{ required: Worker.configs.phone.isInvalid(row.worker) }"
                        class="phone-number"
                      />
                    </div>
                  </template>
                  <template v-else>
                    {{ `${row.worker.phoneCountryCode} ${row.worker.phone}` }}
                  </template>
                </td>

                <!-- EMAIL -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.worker.email"
                      type="email"
                      :disabled="Worker.configs.email.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.email.isInvalid(row.worker) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.worker.email }}
                  </template>
                </td>

                <!-- FUNCTION -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.worker.function"
                      type="text"
                      :disabled="Worker.configs.function.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.function.isInvalid(row.worker) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.worker.function }}
                  </template>
                </td>

                <!-- HOUR COST -->
                <td :class="{ highlight: workerIsActive(row) }">
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="formatNumber(row.worker.hourCost)"
                      type="text"
                      inputmode="decimal"
                      :disabled="Worker.configs.hourCost.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.hourCost.isInvalid(row.worker) }"
                      @input="handleMoneyInput($event, row.worker, 'hourCost')"
                    />
                  </template>
                  <template v-else>
                    {{ formatCurrency(row.worker.hourCost) }}
                  </template>
                </td>

                <!-- DEFAULT HOURS -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model.number="row.worker.defaultHours"
                      type="number"
                      step="0.1"
                      :disabled="Worker.configs.defaultHours.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.defaultHours.isInvalid(row.worker) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.worker.defaultHours }}
                  </template>
                </td>

                <!-- CONTRACT TYPE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <select
                      v-model="row.worker.workerContractType"
                      :disabled="Worker.configs.workerContractType.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.workerContractType.isInvalid(row.worker) }"
                      @change="onContractTypeChanged(row)"
                    >
                      <option
                        v-for="option in Worker.configs.workerContractType.options"
                        :key="option.value"
                        :value="option.value"
                      >
                        {{ option.label }}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    {{ WorkerContractType.getLabel(row.worker.workerContractType) }}
                  </template>
                </td>

                <!-- HOUR RATE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="formatNumber(row.worker.hourRate)"
                      type="text"
                      inputmode="decimal"
                      :disabled="Worker.configs.hourRate.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.hourRate.isInvalid(row.worker) }"
                      @input="handleMoneyInput($event, row.worker, 'hourRate')"
                    />
                  </template>
                  <template v-else>
                    {{ formatCurrency(row.worker.hourRate) }}
                  </template>
                </td>

                <!-- MONTHLY SALARY -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="formatNumber(row.worker.monthlySalary)"
                      type="text"
                      inputmode="decimal"
                      :disabled="Worker.configs.monthlySalary.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.monthlySalary.isInvalid(row.worker) }"
                      @input="handleMoneyInput($event, row.worker, 'monthlySalary')"
                    />
                  </template>
                  <template v-else>
                    {{ formatCurrency(row.worker.monthlySalary) }}
                  </template>
                </td>

                <!-- TSU -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="formatNumber(row.worker.tsu)"
                      type="text"
                      inputmode="decimal"
                      :disabled="Worker.configs.tsu.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.tsu.isInvalid(row.worker) }"
                    />
                  </template>
                  <template v-else>
                    {{ formatPercentage(row.worker.tsu) }}
                  </template>
                </td>

                <!-- MEAL ALLOWANCE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="formatNumber(row.worker.mealAllowance)"
                      type="text"
                      inputmode="decimal"
                      :disabled="Worker.configs.mealAllowance.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.mealAllowance.isInvalid(row.worker) }"
                      @input="handleMoneyInput($event, row.worker, 'mealAllowance')"
                    />
                  </template>
                  <template v-else>
                    {{ formatCurrency(row.worker.mealAllowance) }}
                  </template>
                </td>

                <!-- ACCIDENT INSURANCE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="formatNumber(row.worker.accidentInsurance)"
                      type="text"
                      inputmode="decimal"
                      :disabled="Worker.configs.accidentInsurance.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.accidentInsurance.isInvalid(row.worker) }"
                      @input="handleMoneyInput($event, row.worker, 'accidentInsurance')"
                    />
                  </template>
                  <template v-else>
                    {{ formatCurrency(row.worker.accidentInsurance) }}
                  </template>
                </td>

                <!-- START DATE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.worker.startDate"
                      type="date"
                      :disabled="Worker.configs.startDate.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.startDate.isInvalid(row.worker) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.worker.startDate ? row.worker.startDate : '-' }}
                  </template>
                </td>

                <!-- END DATE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.worker.endDate"
                      type="date"
                      :disabled="Worker.configs.endDate.showDisabled(row.worker)"
                      :class="{ required: Worker.configs.endDate.isInvalid(row.worker) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.worker.endDate ? row.worker.endDate : '-' }}
                  </template>
                </td>

                <!-- ACTIONS -->
                <td>
                  <div v-if="!rowHasChanges(row)" class="action-buttons">
                    <button :disabled="isEditing" @click="askDelete(row)"><Trash2 :size="16" /></button>
                    <button :disabled="isEditing" @click="startEditWorker(row)">
                      <Pencil :size="16" />
                    </button>
                  </div>
                  <div v-if="rowHasChanges(row)" class="action-buttons editing">
                    <button @click="discardRow(row)"><Undo2 :size="16" /></button>
                    <button :disabled="!Worker.isValid(row.worker)" @click="saveWorker(row)">
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
    :message="`Tem a certeza que quer eliminar definitivamente o colaborador '${workerToDelete?.worker.name}' com o NIF ${workerToDelete?.worker.nif}?`"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import workerApi from '@/services/worker-api';
import { WorkerContractType, WorkerType, WorkerFilters, WorkerSortField } from '@/types/worker-type';
import { ApiResponseStatus } from '@/types/api-response-status';
import { Contact, Pencil, Trash2, Check, Undo2, Plus, LoaderCircle, FunnelX } from 'lucide-vue-next';
import Toast from '@/composables/Toast.vue';
import { SortDirection } from '@/types/sort-direction';
import TableColumnFilter from '@/components/TableColumnFilter.vue';
import { handleMoneyInput } from '@/utils/handle-money-input';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/validation';
import ConfirmDialog from '@/composables/ConfirmDialog.vue';
import axios from 'axios';
import { Status } from '@/types/status';
import { Worker } from '@/entities/worker';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const tableBody = ref<HTMLTableSectionElement | null>(null);

/******************************************************************************************************** ROW ACTIONS */

interface WorkerRow {
  worker: WorkerType;
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

function rowHasChanges(row: WorkerRow) {
  return row._isNew || row._isEdited;
}

function discardRow(row: WorkerRow) {
  if (row._isNew) {
    workers.value = workers.value.filter((w) => w._key !== row._key);
  } else {
    row.worker = row._original!;
    row._isNew = false;
    row._isEdited = false;
  }
}

function workerIsActive(row: WorkerRow) {
  return row.worker.status == Status.ACTIVE;
}

/**************************************************************************************************************** GET */

async function fetchWorkers() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotWorkers = await workerApi.searchWorkers(workerFilters.value);

    workers.value = gotWorkers.map((worker) => ({
      worker: {
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

function startEditWorker(row: WorkerRow) {
  row._isEdited = true;

  row._original = structuredClone({ ...row.worker });
}

function onContractTypeChanged(row: WorkerRow) {
  row._isEdited = true;

  if (row.worker.workerContractType === WorkerContractType.INTERNAL && row.worker.tsu == null) {
    row.worker.tsu = 23.75;
    row.worker.hourRate = undefined;
  }

  if (row.worker.workerContractType === WorkerContractType.CONTRACTOR) {
    row.worker.tsu = undefined;
    row.worker.monthlySalary = undefined;
    row.worker.mealAllowance = undefined;
    row.worker.accidentInsurance = undefined;
  }
}

/**************************************************************************************************************** ADD */

async function addWorker(): Promise<void> {
  workers.value.push({
    worker: {
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

async function saveWorker(row: WorkerRow): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (row._isNew) {
      await workerApi.addWorker(row.worker);
    }

    if (row._isEdited) {
      await workerApi.editWorker(row.worker);
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
    if (!workerToDelete.value?.worker.id) {
      return;
    }

    await workerApi.deleteWorker(workerToDelete.value.worker.id);
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
