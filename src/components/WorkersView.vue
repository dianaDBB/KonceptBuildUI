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
              <col style="width: 80px" />
              <!-- code -->
              <col style="width: 150px" />
              <!-- name -->
              <col style="width: 90px" />
              <!-- status -->
              <col style="width: 95px" />
              <!-- contact -->
              <col style="width: 150px" />
              <!-- email -->
              <col style="width: 100px" />
              <!-- function -->
              <col style="width: 100px" />
              <!-- defaultHours -->
              <col style="width: 100px" />
              <!-- contractType -->
              <col style="width: 80px" />
              <!-- hourRate -->
              <col style="width: 100px" />
              <!-- monthlySalary -->
              <col style="width: 80px" />
              <!-- tsu -->
              <col style="width: 100px" />
              <!-- mealAllowance -->
              <col style="width: 100px" />
              <!-- accidentInsurance -->
              <col style="width: 130px" />
              <!-- startDate -->
              <col style="width: 130px" />
              <!-- endDate -->
              <col style="width: 50px" />
              <!-- ACTIONS -->
            </colgroup>
            <thead>
              <tr>
                <th>
                  <div class="column-heading">
                    ID
                    <TableColumnFilter
                      :config="workerFilterConfigs.code"
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
                  <div class="column-heading">
                    Nome
                    <TableColumnFilter
                      :config="workerFilterConfigs.name"
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
                  <div class="column-heading">
                    Estado
                    <TableColumnFilter
                      :config="workerFilterConfigs.status"
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
                  <div class="column-heading">
                    Tlf
                    <TableColumnFilter
                      :config="workerFilterConfigs.contact"
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
                  <div class="column-heading">
                    Email
                    <TableColumnFilter
                      :config="workerFilterConfigs.email"
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
                  <div class="column-heading">
                    Função
                    <TableColumnFilter
                      :config="workerFilterConfigs.function"
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
                  <div class="column-heading">
                    Horas Dia <br />
                    (Padrão)
                    <TableColumnFilter
                      :config="workerFilterConfigs.defaultHours"
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
                  <div class="column-heading">
                    Tipo <br />
                    Contrato
                    <TableColumnFilter
                      :config="workerFilterConfigs.contractType"
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
                  <div class="column-heading">
                    Valor <br />
                    Hora <br />
                    (€)
                    <TableColumnFilter
                      :config="workerFilterConfigs.hourRate"
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
                  <div class="column-heading">
                    Ordenado <br />
                    Mensal <br />
                    (€/mês)
                    <TableColumnFilter
                      :config="workerFilterConfigs.montlhySalary"
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
                  <div class="column-heading">
                    TSU <br />
                    Empresa <br />
                    (%)
                    <TableColumnFilter
                      :config="workerFilterConfigs.tsu"
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
                  <div class="column-heading">
                    Sub. Ali. <br />
                    (€/dia)
                    <TableColumnFilter
                      :config="workerFilterConfigs.mealAllowance"
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
                  <div class="column-heading">
                    Seg. Aci. <br />
                    Trabalho <br />
                    (€/mês)
                    <TableColumnFilter
                      :config="workerFilterConfigs.accidentInsurance"
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
                  <div class="column-heading">
                    Data <br />
                    Admissão
                    <TableColumnFilter
                      :config="workerFilterConfigs.startDate"
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
                  <div class="column-heading">
                    Data <br />
                    Cessação
                    <TableColumnFilter
                      :config="workerFilterConfigs.endDate"
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
              <tr v-for="row in workers" :key="row._key" :class="{ deleted: row._isDeleted }">
                <!-- CODE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input v-model="row.worker.code" type="text" :disabled="true" :class="{ required: false }" />
                  </template>
                  <template v-else>
                    {{ row.worker.code }}
                  </template>
                </td>

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

                <!-- STATUS -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <select
                      v-model="row.worker.status"
                      :class="{ required: !row.worker.status }"
                      @change="row._isEdited = true"
                    >
                      <option v-for="status in WorkerStatus.OPTIONS" :key="status.value" :value="status.value">
                        {{ status.label }}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    {{ WorkerStatus.getLabel(row.worker.status) }}
                  </template>
                </td>

                <!-- CONTACT -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.worker.contact"
                      type="tel"
                      pattern="[0-9]{9}"
                      maxlength="9"
                      inputmode="numeric"
                      :class="{ required: !isValidPhone(row.worker.contact) }"
                      @change="row._isEdited = true"
                    />
                  </template>
                  <template v-else>
                    {{ row.worker.contact }}
                  </template>
                </td>

                <!-- EMAIL -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.worker.email"
                      type="email"
                      :class="{ required: !isValidEmail(row.worker.email) }"
                      @change="row._isEdited = true"
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
                      :class="{ required: !row.worker.function }"
                      @change="row._isEdited = true"
                    />
                  </template>
                  <template v-else>
                    {{ row.worker.function }}
                  </template>
                </td>

                <!-- DEFAULT HOURS -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model.number="row.worker.defaultHours"
                      type="number"
                      step="0.1"
                      :class="{ required: !row.worker.defaultHours }"
                      @change="row._isEdited = true"
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
                      v-model="row.worker.contractType"
                      :class="{ required: !row.worker.contractType }"
                      @change="onContractTypeChanged(row)"
                    >
                      <option v-for="type in ContractType.OPTIONS" :key="type.value" :value="type.value">
                        {{ type.label }}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    {{ ContractType.getLabel(row.worker.contractType) }}
                  </template>
                </td>

                <!-- HOUR RATE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="row.worker.hourRate?.toFixed(2)"
                      type="text"
                      inputmode="decimal"
                      :disabled="!row.worker.contractType || row.worker.contractType == ContractType.INTERNAL"
                      :class="{ required: row.worker.contractType == ContractType.CONTRACTOR && !row.worker.hourRate }"
                      @input="handleMoneyInput($event, row.worker, 'hourRate')"
                      @change="row._isEdited = true"
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
                      :value="row.worker.monthlySalary?.toFixed(2)"
                      type="text"
                      inputmode="decimal"
                      :disabled="!row.worker.contractType || row.worker.contractType == ContractType.CONTRACTOR"
                      :class="{
                        required: row.worker.contractType == ContractType.INTERNAL && !row.worker.monthlySalary,
                      }"
                      @input="handleMoneyInput($event, row.worker, 'monthlySalary')"
                      @change="row._isEdited = true"
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
                      :value="row.worker.tsu?.toFixed(2)"
                      type="text"
                      inputmode="decimal"
                      :disabled="!row.worker.contractType || row.worker.contractType == ContractType.CONTRACTOR"
                      :class="{ required: row.worker.contractType == ContractType.INTERNAL && !row.worker.tsu }"
                      @change="row._isEdited = true"
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
                      :value="row.worker.mealAllowance?.toFixed(2)"
                      type="text"
                      inputmode="decimal"
                      :disabled="!row.worker.contractType || row.worker.contractType == ContractType.CONTRACTOR"
                      :class="{
                        required:
                          row.worker.contractType == ContractType.INTERNAL &&
                          (row.worker.mealAllowance == undefined || row.worker.mealAllowance < 0),
                      }"
                      @input="handleMoneyInput($event, row.worker, 'mealAllowance')"
                      @change="row._isEdited = true"
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
                      :value="row.worker.accidentInsurance?.toFixed(2)"
                      type="text"
                      inputmode="decimal"
                      :disabled="!row.worker.contractType || row.worker.contractType == ContractType.CONTRACTOR"
                      :class="{
                        required:
                          row.worker.contractType == ContractType.INTERNAL &&
                          (row.worker.accidentInsurance == undefined || row.worker.accidentInsurance < 0),
                      }"
                      @input="handleMoneyInput($event, row.worker, 'accidentInsurance')"
                      @change="row._isEdited = true"
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
                      :class="{ required: !row.worker.startDate }"
                      @change="row._isEdited = true"
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
                      :class="{ required: false }"
                      @change="row._isEdited = true"
                    />
                  </template>
                  <template v-else>
                    {{ row.worker.endDate ? row.worker.endDate : '-' }}
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
import workerApi from '@/services/worker-api';
import { ContractType, Worker, WorkerFilters, WorkerSortField, WorkerStatus } from '@/types/worker';
import { ApiResponseStatus } from '@/types/api-response-status';
import { User, Pencil, Trash2, Check, Undo2, Plus, LoaderCircle, FunnelX } from 'lucide-vue-next';
import Toast from '@/composables/Toast.vue';
import { SortDirection } from '@/types/sort-direction';
import TableColumnFilter from '@/components/TableColumnFilter.vue';
import { TableFilterKind, type TableColumnFilterConfig } from '@/types/table-filter';
import { handleMoneyInput } from '@/utils/handle-money-input';
import { formatCurrency, formatPercentage, isValidEmail, isValidPhone } from '@/utils/validation';

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
    row.worker.status?.trim() &&
    row.worker.contact &&
    row.worker.email?.trim() &&
    row.worker.function?.trim() &&
    row.worker.defaultHours &&
    row.worker.contractType?.trim() &&
    row.worker.contractType?.trim() &&
    ((row.worker.contractType == ContractType.CONTRACTOR && row.worker.hourRate != null && row.worker.hourRate > 0) ||
      (row.worker.contractType === ContractType.INTERNAL &&
        row.worker.monthlySalary != null &&
        row.worker.monthlySalary > 0 &&
        row.worker.tsu != null &&
        row.worker.tsu > 0 &&
        row.worker.mealAllowance != null &&
        row.worker.mealAllowance >= 0 &&
        row.worker.accidentInsurance != null &&
        row.worker.accidentInsurance >= 0))
  );
}

function onContractTypeChanged(row: WorkerRow) {
  row._isEdited = true;

  if (row.worker.contractType === ContractType.INTERNAL && row.worker.tsu == null) {
    row.worker.tsu = 23.75;
    row.worker.hourRate = undefined;
  }

  if (row.worker.contractType === ContractType.CONTRACTOR) {
    row.worker.tsu = undefined;
    row.worker.monthlySalary = undefined;
    row.worker.mealAllowance = undefined;
    row.worker.accidentInsurance = undefined;
  }
}

async function addWorker(): Promise<void> {
  workers.value.push({
    worker: {
      status: WorkerStatus.ACTIVE,
      defaultHours: 8,
      startDate: new Date().toISOString().split('T')[0],
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
    await workerApi.addWorker(row.worker);
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
  code: {
    column: WorkerSortField.CODE,
    label: 'ID',
    kind: TableFilterKind.TEXT,
    valueKey: 'code',
    dropdownAlign: 'start',
  },
  name: {
    column: WorkerSortField.NAME,
    label: 'Nome',
    kind: TableFilterKind.TEXT,
    valueKey: 'name',
    dropdownAlign: 'start',
  },
  status: {
    column: WorkerSortField.STATUS,
    label: 'Estado',
    kind: TableFilterKind.SELECT,
    valueKey: 'status',
    dropdownAlign: 'start',
    options: [
      { label: 'Activo', value: 'ACTIVE' },
      { label: 'Inactivo', value: 'INACTIVE' },
    ],
  },
  contact: {
    column: WorkerSortField.CONTACT,
    label: 'Contacto',
    kind: TableFilterKind.TEXT,
    valueKey: 'contact',
  },
  email: {
    column: WorkerSortField.EMAIL,
    label: 'E-mail',
    kind: TableFilterKind.TEXT,
    valueKey: 'email',
  },
  function: {
    column: WorkerSortField.FUNCTION,
    label: 'Função',
    kind: TableFilterKind.TEXT,
    valueKey: 'function',
  },
  defaultHours: {
    column: WorkerSortField.DEFAULT_HOURS,
    label: 'Horas Dia (Padrão)',
    kind: TableFilterKind.NUMBER_RANGE,
    minKey: 'defaultHoursMin',
    maxKey: 'defaultHoursMax',
  },
  contractType: {
    column: WorkerSortField.CONTRACT_TYPE,
    label: 'Tipo de Contracto',
    kind: TableFilterKind.SELECT,
    valueKey: 'contractType',
    options: [
      { label: 'Contracto', value: 'INTERNAL' },
      { label: 'Hora', value: 'CONTRACTOR' },
    ],
  },
  hourRate: {
    column: WorkerSortField.HOUR_RATE,
    label: 'Valor /Hora',
    kind: TableFilterKind.NUMBER_RANGE,
    minKey: 'hourRateMin',
    maxKey: 'hourRateMax',
  },
  montlhySalary: {
    column: WorkerSortField.MONTHLY_SALARY,
    label: 'Ordenado Base Mensal',
    kind: TableFilterKind.NUMBER_RANGE,
    minKey: 'montlhySalaryMin',
    maxKey: 'montlhySalaryMax',
  },
  tsu: {
    column: WorkerSortField.TSU,
    label: 'TSU Empresa (%)',
    kind: TableFilterKind.NUMBER_RANGE,
    minKey: 'tsuMin',
    maxKey: 'tsuMax',
  },
  mealAllowance: {
    column: WorkerSortField.MEAL_ALLOWANCE,
    label: 'Subsídio Alim. /Dia (€)',
    kind: TableFilterKind.NUMBER_RANGE,
    minKey: 'mealAllowanceMin',
    maxKey: 'mealAllowanceMax',
  },
  accidentInsurance: {
    column: WorkerSortField.ACCIDENT_INSURANCE,
    label: 'Seguro Ac. Trabalho (€/mês)',
    kind: TableFilterKind.NUMBER_RANGE,
    minKey: 'accidentInsuranceMin',
    maxKey: 'accidentInsuranceMax',
  },
  startDate: {
    column: WorkerSortField.START_DATE,
    label: 'Data Admissão',
    kind: TableFilterKind.NUMBER_RANGE,
    minKey: 'startDateMin',
    maxKey: 'startDateMax',
  },
  endDate: {
    column: WorkerSortField.END_DATE,
    label: 'Data Cessação',
    kind: TableFilterKind.NUMBER_RANGE,
    minKey: 'endDateMin',
    maxKey: 'endDateMax',
  },
} satisfies Record<string, TableColumnFilterConfig<WorkerSortField>>;

function setSort(event: { column: WorkerSortField; direction: SortDirection | undefined }): void {
  workerFilters.value = {
    ...workerFilters.value,
    sortBy: event.direction ? event.column : undefined,
    sortDirection: event.direction,
  };

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
    const gotWorkers = await workerApi.searchWorkers(workerFilters.value);

    workers.value = gotWorkers.map((worker) => ({
      worker: {
        ...worker,
        defaultHours: worker.defaultHours ? parseFloat(worker.defaultHours.toFixed(2)) : undefined,
        hourRate: worker.hourRate ? parseFloat(worker.hourRate.toFixed(2)) : undefined,
        monthlySalary: worker.monthlySalary ? parseFloat(worker.monthlySalary.toFixed(2)) : undefined,
        tsu: worker.tsu ? parseFloat(worker.tsu.toFixed(2)) : undefined,
        mealAllowance: worker.mealAllowance ? parseFloat(worker.mealAllowance.toFixed(2)) : undefined,
        accidentInsurance: worker.accidentInsurance ? parseFloat(worker.accidentInsurance.toFixed(2)) : undefined,
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

onMounted(fetchWorkers);
</script>

<style scoped lang="scss"></style>
