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
                <th>Nome</th>
                <th>Tipo</th>
                <th>Custo Hora</th>
                <th>Salário Mensal</th>
                <th>Rate Hora</th>
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
import { ref, onMounted, computed, nextTick } from 'vue';
import api from '@/services/api';
import { Worker } from '@/types/worker';
import { ApiResponseStatus } from '@/types/api-response-status';
import { User, Pencil, Trash2, Check, Undo2, Plus } from 'lucide-vue-next';
import Toast from '@/composables/Toast.vue';

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

async function fetchWorkers() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotWorkers = await api.getAllWorkers();

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
