<template>
  <div class="card">
    <div class="card-header">
      <span class="card__icon">👥</span>
      <h3>Workers</h3>
    </div>

    <div class="card-body">
      <div class="workers-section">
        <div class="table-wrapper">
          <table class="table">
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
                <th>Name</th>
                <th>Type</th>
                <th>Hour Cost</th>
                <th>Mohtly Salary</th>
                <th>Hour Rate</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="row in workers" :key="row._key" :class="{ deleted: row._isDeleted }">
                <!-- NAME -->
                <td>
                  <input
                    v-model="row.name"
                    :disabled="row._isDeleted"
                    type="text"
                    class="cell-input"
                    :class="{ required: !row.name }"
                    @change="row._isEdited = true"
                  />
                </td>

                <!-- WORKER TYPE -->
                <td>
                  <select
                    v-model="row.workerType"
                    :disabled="row._isDeleted"
                    class="cell-select"
                    :class="{ required: !row.workerType }"
                    @change="row._isEdited = true"
                  >
                    <option v-for="type in ['CONTRACTOR', 'INTERNAL']" :key="type" :value="type">
                      {{ type }}
                    </option>
                  </select>
                </td>

                <!-- HOUR COST -->
                <td>
                  <input
                    :value="row.hourCost?.toFixed(2)"
                    :disabled="true"
                    type="text"
                    inputmode="decimal"
                    class="cell-input"
                    :class="{ required: false }"
                  />
                </td>

                <!-- MONTLHY SALARY -->
                <td>
                  <input
                    :value="row.monthlySalary?.toFixed(2)"
                    :disabled="row._isDeleted || row.workerType?.trim() == '' || row.workerType == 'CONTRACTOR'"
                    type="text"
                    inputmode="decimal"
                    class="cell-input"
                    :class="{ required: row.workerType == 'INTERNAL' && !row.monthlySalary }"
                    @input="handleMoneyInput($event, row, 'monthlySalary')"
                    @change="row._isEdited = true"
                  />
                </td>

                <!-- HOUR RATE -->
                <td>
                  <input
                    :value="row.hourRate?.toFixed(2)"
                    :disabled="row._isDeleted || row.workerType?.trim() == '' || row.workerType == 'INTERNAL'"
                    type="text"
                    inputmode="decimal"
                    class="cell-input"
                    :class="{ required: row.workerType == 'CONTRACTOR' && !row.hourRate }"
                    @input="handleMoneyInput($event, row, 'hourRate')"
                    @change="row._isEdited = true"
                  />
                </td>

                <!-- REMOVE BTN -->
                <td class="col-action">
                  <button class="col-action-btn" @click="toggleDelete(row)">{{ row._isDeleted ? '↺' : '✕' }}</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <div class="actions">
          <button class="btn btn-outline" @click="addWorker">+ Add Worker</button>

          <button
            class="btn"
            :disabled="apiStatus.isLoading || !hasChanges || (hasChanges && !isFormValid)"
            @click="saveWorkers"
          >
            <span v-if="apiStatus.isLoading" class="spinner">⚙️</span>
            <span v-else>Save Workers</span>
          </button>
        </div>

        <div v-if="apiStatus.isError" class="alert alert-error">
          <span class="alert-icon">⚠️</span>
          {{ apiStatus.message }}
        </div>

        <div v-if="apiStatus.isSuccess && apiStatus.message" class="alert alert-success">
          <span class="alert-icon">✓</span>
          {{ apiStatus.message }}
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import api from '@/services/api';
import { computed } from 'vue';
import { Worker } from '@/types/worker';
import { ApiResponseStatus } from '@/types/api-response-status';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

interface WorkerRow extends Worker {
  _key: string;
  _isNew: boolean;
  _isEdited: boolean;
  _isDeleted: boolean;
}

const workers = ref<WorkerRow[]>([]);

let _keyCounter = 0;
function nextKey(): string {
  return `row-${++_keyCounter}`;
}

const hasChanges = computed(() => {
  return workers.value.some((r) => r._isNew || r._isEdited || r._isDeleted);
});

const isFormValid = computed(() =>
  workers.value.every(
    (row) =>
      row.name?.trim() &&
      row.workerType?.trim() &&
      ((row.workerType === 'CONTRACTOR' && row.hourRate != null) ||
        (row.workerType === 'INTERNAL' && row.monthlySalary != null)),
  ),
);

function handleMoneyInput(event: Event, row: WorkerRow, field: keyof Pick<WorkerRow, 'monthlySalary' | 'hourRate'>) {
  const input = event.target as HTMLInputElement;
  const digits = input.value.replace(/\D/g, '');
  const value = Number(digits) / 100;

  row[field] = value;
  input.value = value.toFixed(2);
}

function addWorker(): void {
  workers.value.push({
    id: '',
    name: '',
    workerType: '',
    hourRate: undefined,
    monthlySalary: undefined,
    hourCost: undefined,
    _key: nextKey(),
    _isNew: true,
    _isEdited: true,
    _isDeleted: false,
  });
}

function toggleDelete(row: WorkerRow): void {
  row._isDeleted = !row._isDeleted;
}

async function saveWorkers(): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };
  try {
    const newWorker: Worker[] = workers.value
      .filter((worker) => worker._isNew)
      .map((worker) => ({
        name: worker.name,
        workerType: worker.workerType,
        hourRate: worker.hourRate,
        monthlySalary: worker.monthlySalary,
      }));

    await api.addWorkers(newWorker);
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
      ...worker,
      hourCost: worker.hourCost ? parseFloat(worker.hourCost.toFixed(2)) : undefined,
      monthlySalary: worker.monthlySalary ? parseFloat(worker.monthlySalary.toFixed(2)) : undefined,
      hourRate: worker.hourRate ? parseFloat(worker.hourRate.toFixed(2)) : undefined,
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

<style scoped lang="scss">
.workers-section {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}
</style>
