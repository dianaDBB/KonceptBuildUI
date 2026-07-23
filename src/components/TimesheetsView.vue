<template>
  <div class="main-section">
    <div class="section-header">
      <span>
        <ClipboardClock :size="24" />
      </span>
      <h3>Timesheets</h3>

      <div class="page-nav">
        <RouterLink to="/" class="link"> Página Inicial </RouterLink>
      </div>
    </div>

    <div class="section">
      <div class="section-body">
        <div class="month-navigation">
          <button :disabled="apiStatus.isLoading" @click="previousMonth">
            <ChevronLeft :size="15" />
          </button>

          <h3>{{ monthName }} {{ selectedYear }}</h3>

          <button :disabled="apiStatus.isLoading" @click="nextMonth">
            <ChevronRight :size="15" />
          </button>
        </div>

        <div class="table">
          <table>
            <thead>
              <tr>
                <th class="worker-column" />
                <th v-for="day in daysInMonth" :key="day" class="day-column">{{ day }}</th>
                <th class="total-column">Total Horas</th>
                <th class="cost-column">Custo (€)</th>
              </tr>
            </thead>

            <tbody>
              <template v-for="workerTimesheet in timesheet?.workersTimesheet" :key="workerTimesheet.worker.id">
                <!-- Worker Row -->

                <tr class="worker-row">
                  <td class="worker-name">
                    {{ `${workerTimesheet.worker.name} [${workerTimesheet.worker.defaultHours}h]` }}
                  </td>
                  <td v-for="day in daysInMonth" :key="day" />
                  <td class="total-hours">
                    {{ formatNumber(workerTimesheet.totalHours) }}
                  </td>
                  <td class="total-cost">
                    {{ formatCurrency(workerTimesheet.totalCost) }}
                  </td>
                </tr>

                <!-- Works -->

                <tr
                  v-for="(workTimesheet, workIndex) in workerTimesheet.worksTimesheet"
                  :key="workIndex"
                  class="work-row"
                >
                  <td class="work-name">
                    <SearchSelect
                      :model-value="workTimesheet.work"
                      :options="availableWorks"
                      :filter="workFilter"
                      @update:model-value="selectWork(workTimesheet, $event)"
                    >
                      <template #selected="{ option }">
                        {{ option.code }}
                      </template>

                      <template #option="{ option }">
                        <div>
                          <strong>{{ option.code }}</strong>
                          <br />
                          {{ option.name }}
                          <br />
                          {{ WorkStatus.getLabel(option.status) }}
                        </div>
                      </template>
                    </SearchSelect>
                  </td>

                  <td
                    v-for="day in daysInMonth"
                    :key="day"
                    class="day-cell"
                    :class="{
                      weekend: isWeekend(day),
                      today: isToday(day),
                    }"
                  >
                    <input
                      class="day-input"
                      :value="getDayValue(workTimesheet, day)"
                      @input="updateDay(workTimesheet, day, $event)"
                    />
                  </td>

                  <td />

                  <td />
                </tr>

                <!-- Add work row -->

                <tr class="add-work-row">
                  <td class="add-work-actions">
                    <button type="button" @click="addWork(workerTimesheet)">+ Obra</button>
                  </td>

                  <td v-for="day in daysInMonth" :key="day"></td>

                  <td></td>
                  <td></td>
                </tr>
              </template>
            </tbody>
          </table>

          <div v-if="apiStatus.isLoading" class="table-loading-overlay">
            <div>
              <LoaderCircle :size="18" class="spinner" />
              A carregar timesheet...
            </div>
          </div>
        </div>

        <div class="actions">
          <button :disabled="apiStatus.isLoading" @click="save">
            <Save :size="18" />
            Guardar
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
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { ClipboardClock, ChevronLeft, ChevronRight, LoaderCircle, Save } from 'lucide-vue-next';
import Toast from '@/composables/Toast.vue';
import timesheetApi from '@/services/timesheet-api';
import workApi from '@/services/work-api';
import { ApiResponseStatus } from '@/types/api-response-status';
import {
  MonthlyTimesheetType,
  WorkerTimesheetType,
  WorkTimesheetType,
  DayEntryType,
} from '@/types/monthly-timesheet-type';
import { WorkType } from '@/types/work-type';
import { formatCurrency, formatNumber } from '@/utils/validation';
import SearchSelect from '@/composables/SearchSelect.vue';
import { WorkStatus } from '@/types/work-status';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const today = new Date();
const selectedYear = ref(today.getFullYear());
const selectedMonth = ref(today.getMonth() + 1);

const timesheet = ref<MonthlyTimesheetType>();
const availableWorks = ref<WorkType[]>([]);

/**********************************************************************************************************************
 * MONTH
 *********************************************************************************************************************/

const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dexembro',
];

const monthName = computed(() => monthNames[selectedMonth.value - 1]);

const daysInMonth = computed(() => new Date(selectedYear.value, selectedMonth.value, 0).getDate());

function selectWork(workRow: WorkTimesheetType, work: WorkType) {
  workRow.work = work;
}

/**********************************************************************************************************************
 * LOAD
 *********************************************************************************************************************/

async function fetchWorks() {
  availableWorks.value = await workApi.searchWorks();
}

async function fetchTimesheet() {
  apiStatus.value = {
    isLoading: true,
    isSuccess: false,
    isError: false,
  };

  try {
    timesheet.value = await timesheetApi.getMonthlyTimesheet(selectedYear.value, selectedMonth.value);

    recalculateTotals();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
    };
  } catch (error: unknown) {
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to load timesheet.',
    };
  }
}

/**********************************************************************************************************************
 * SAVE
 *********************************************************************************************************************/

async function save() {
  if (!timesheet.value) {
    return;
  }

  apiStatus.value = {
    isLoading: true,
    isSuccess: false,
    isError: false,
  };

  try {
    await timesheetApi.saveMonthlyTimesheet(timesheet.value);

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Timesheet saved successfully.',
    };

    await fetchTimesheet();
  } catch (error: unknown) {
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Failed to save timesheet.',
    };
  }
}
/**********************************************************************************************************************
 * MONTH NAVIGATION
 *********************************************************************************************************************/

async function previousMonth() {
  if (selectedMonth.value === 1) {
    selectedMonth.value = 12;
    selectedYear.value--;
  } else {
    selectedMonth.value--;
  }

  await fetchTimesheet();
}

async function nextMonth() {
  if (selectedMonth.value === 12) {
    selectedMonth.value = 1;
    selectedYear.value++;
  } else {
    selectedMonth.value++;
  }

  await fetchTimesheet();
}

/**********************************************************************************************************************
 * WORKS
 *********************************************************************************************************************/

function workFilter(work: WorkType): string {
  return `${work.code ?? ''} ${work.name ?? ''}`;
}

function addWork(workerTimesheet: WorkerTimesheetType) {
  const isFirstWork = workerTimesheet.worksTimesheet.length === 0;

  const days: DayEntryType[] = [];

  for (let day = 1; day <= daysInMonth.value; day++) {
    days.push(createDayEntry(day, isFirstWork ? workerTimesheet.worker.defaultHours || 0 : 0));
  }

  workerTimesheet.worksTimesheet.push({
    work: undefined,
    days,
  });

  recalculateTotals();
}

function createDayEntry(day: number, hours: number): DayEntryType {
  const month = String(selectedMonth.value).padStart(2, '0');
  const dayString = String(day).padStart(2, '0');

  return {
    date: `${selectedYear.value}-${month}-${dayString}`,
    hours,
    attendanceCode: null,
  };
}

/**********************************************************************************************************************
 * DAYS
 *********************************************************************************************************************/

function getEntry(work: WorkTimesheetType, day: number): DayEntryType | undefined {
  const expected = `${selectedYear.value}-${String(selectedMonth.value).padStart(2, '0')}-${String(day).padStart(
    2,
    '0',
  )}`;

  return work.days.find((entry) => entry.date === expected);
}

function getDayValue(work: WorkTimesheetType, day: number): string {
  const entry = getEntry(work, day);

  if (!entry) {
    return '';
  }

  if (entry.attendanceCode) {
    return String(entry.attendanceCode);
  }

  return entry.hours?.toString() ?? '';
}

function updateDay(work: WorkTimesheetType, day: number, event: Event) {
  const value = (event.target as HTMLInputElement).value.trim();

  let entry = getEntry(work, day);

  if (!entry) {
    entry = createDayEntry(day, 0);
    work.days.push(entry);
  }

  if (value === '') {
    work.days = work.days.filter((d) => d !== entry);

    recalculateTotals();

    return;
  }

  const number = Number(value);

  if (!Number.isNaN(number)) {
    entry.hours = number;
    entry.attendanceCode = null;
  } else {
    entry.hours = null;
    entry.attendanceCode = value.toUpperCase() as any;
  }

  recalculateTotals();
}

/**********************************************************************************************************************
 * TOTALS
 *********************************************************************************************************************/

function recalculateTotals() {
  if (!timesheet.value) {
    return;
  }

  timesheet.value.workersTimesheet.forEach((workerTimesheet) => {
    let totalHours = 0;

    workerTimesheet.worksTimesheet.forEach((work) => {
      work.days.forEach((day) => {
        totalHours += day.hours ?? 0;
      });
    });

    workerTimesheet.totalHours = totalHours;
    workerTimesheet.totalCost = totalHours * workerTimesheet.hourCost;
  });
}

/**********************************************************************************************************************
 * STYLE
 *********************************************************************************************************************/

function isWeekend(day: number): boolean {
  const date = new Date(selectedYear.value, selectedMonth.value - 1, day);

  return date.getDay() === 0 || date.getDay() === 6;
}

function isToday(day: number): boolean {
  return (
    selectedYear.value === today.getFullYear() &&
    selectedMonth.value === today.getMonth() + 1 &&
    day === today.getDate()
  );
}

/**********************************************************************************************************************
 * INIT
 *********************************************************************************************************************/

onMounted(async () => {
  await fetchWorks();
  await fetchTimesheet();
});
</script>
<style>
.month-navigation {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 18px;

  padding: 12px 18px;

  background: var(--color-background-alt);
  border: 1px solid var(--color-border-light);
  border-radius: 10px;

  flex-shrink: 0;

  h3 {
    margin: 0;
    color: var(--color-text);
    font-size: 18px;
    font-weight: 600;
  }

  button {
    width: 20px;
    height: 20px;

    display: flex;
    align-items: center;
    justify-content: center;

    border: none;

    background: var(--color-background-alt);
    color: var(--color-text);

    cursor: pointer;
    transition: 0.2s;

    &:hover:not(:disabled) {
      border-color: var(--color-primary);
      background: var(--color-primary-light);
      color: var(--color-primary);
    }

    &:disabled {
      cursor: not-allowed;
    }
  }
}

.worker-column {
  width: 220px;
}

.day-column {
  width: 50px;
}

.total-column {
  width: 80px;
}

.cost-column {
  width: 120px;
}

.worker-name,
.work-name,
.add-work-actions {
  position: sticky;
  left: 0;
  z-index: 5;
  background: var(--color-background);
}

.worker-name {
  font-size: 13px;
  font-weight: 600;
}

.total-hours,
.total-cost {
  text-align: center;
}

.worker-row,
.worker-row:hover {
  background: var(--color-background-alt);
  background: var(--color-background-alt);
}

.worker-row td {
  background: var(--color-background-alt);
}

.table table tbody tr.work-row td {
  border-bottom: 0;
}

.add-work-row td,
.add-work-row:hover td {
  border-bottom: 1px solid var(--color-border-lighter);
  background: var(--color-background);
}

.add-work-actions {
  opacity: 1;

  .add-work-content {
    display: inline-flex;
  }

  button {
    padding: 5px 9px;
    border: 1px solid var(--color-border);
    border-radius: 8px;
    background: var(--color-background);
    color: var(--color-text);
    cursor: pointer;
    transition: 0.2s;

    &:hover:not(:disabled) {
      border-color: var(--color-primary);
      color: var(--color-primary);
      background: var(--color-primary-light);
    }

    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      background: var(--color-background-disabled);
      color: var(--color-text-disabled);
      border-color: var(--color-border-light);
    }
  }
}
</style>
