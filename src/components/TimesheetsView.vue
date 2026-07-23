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
                <th class="worker-column" rowspan="2" />

                <th
                  v-for="day in daysInMonth"
                  :key="`weekday-${day}`"
                  class="day-column"
                  :class="{ weekend: isNonWorkingDay(day) }"
                >
                  {{ getWeekday(selectedYear, selectedMonth, day) }}
                </th>

                <th class="total-column" rowspan="2">Total Horas</th>
                <th class="cost-column" rowspan="2">Custo (€)</th>
              </tr>

              <tr>
                <th v-for="day in daysInMonth" :key="day" class="day-column" :class="{ weekend: isNonWorkingDay(day) }">
                  {{ day }}
                </th>
              </tr>
            </thead>

            <tbody>
              <template v-for="workerTimesheet in timesheet?.workersTimesheet" :key="workerTimesheet.worker.id">
                <!-- Worker -->

                <tr class="worker-row">
                  <td class="worker-name">
                    {{ workerTimesheet.worker.name }} <br />
                    {{
                      `${WorkerContractType.getLabel(workerTimesheet.worker.workerContractType)} [${
                        workerTimesheet.worker.defaultHours
                      }h]`
                    }}
                    <br />
                    {{ formatCurrency(workerTimesheet.worker.hourRate || workerTimesheet.worker.monthlySalary) }} <br />
                  </td>
                  <td v-for="day in daysInMonth" :key="day" />
                  <td class="total-hours">
                    {{ formatNumber(workerTimesheet.totalHours) }}
                  </td>
                  <td class="total-cost">
                    {{ formatCurrency(workerTimesheet.totalCost) }}
                  </td>
                </tr>

                <!-- Timesheet lines -->

                <tr
                  v-for="(workTimesheet, workIndex) in workerTimesheet.worksTimesheet"
                  :key="workIndex"
                  class="work-row"
                >
                  <td class="work-name">
                    <SearchSelect
                      v-if="isWorkRow(workTimesheet)"
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

                    <select v-else v-model="workTimesheet.attendanceCode">
                      <option v-for="option in AttendanceCode.OPTIONS" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </td>

                  <td
                    v-for="day in daysInMonth"
                    :key="day"
                    class="day-cell"
                    :class="{
                      weekend: isNonWorkingDay(day),
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

                <!-- Add new line -->

                <tr class="add-work-row">
                  <td class="add-work-actions">
                    <button @click="addWork(workerTimesheet)">+ Obra</button>
                    <button @click="addAttendance(workerTimesheet)">+ Ausência</button>
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
  AttendanceCode,
} from '@/types/monthly-timesheet-type';
import { WorkType } from '@/types/work-type';
import { formatCurrency, formatNumber } from '@/utils/validation';
import SearchSelect from '@/composables/SearchSelect.vue';
import { WorkStatus } from '@/types/work-status';
import { getDate, getWeekday, isHoliday, monthNames } from '@/utils/date';
import { WorkerContractType } from '@/types/worker-type';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const today = new Date();
const selectedYear = ref(today.getFullYear());
const selectedMonth = ref(today.getMonth() + 1);

const timesheet = ref<MonthlyTimesheetType>();
const availableWorks = ref<WorkType[]>([]);

const monthName = computed(() => monthNames[selectedMonth.value - 1]);
const daysInMonth = computed(() => new Date(selectedYear.value, selectedMonth.value, 0).getDate());

/*************************************************************************************************************** LOAD */

onMounted(async () => {
  await fetchWorks();
  await fetchTimesheet();
});

async function fetchWorks() {
  availableWorks.value = await workApi.searchWorks();
}

async function fetchTimesheet() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    timesheet.value = await timesheetApi.getMonthlyTimesheet(selectedYear.value, selectedMonth.value);

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

/*************************************************************************************************** MONTH NAVIGATION */

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

/*************************************************************************************************************** SAVE */

async function save() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    await timesheetApi.saveMonthlyTimesheet(timesheet.value!);

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

/***************************************************************************************************** TIMESHEET LINE */

function isWorkRow(workTimesheet: WorkTimesheetType): boolean {
  return workTimesheet.work != null || workTimesheet.type == 'WORK';
}

function selectWork(workRow: WorkTimesheetType, work: WorkType) {
  workRow.work = work;
}

function workFilter(work: WorkType): string {
  return `${work.code ?? ''} ${work.name ?? ''}`;
}

function addWork(workerTimesheet: WorkerTimesheetType) {
  const isFirstLine = workerTimesheet.worksTimesheet.length === 0;

  workerTimesheet.worksTimesheet.push({
    type: 'WORK',
    work: undefined,
    attendanceCode: undefined,
    days: createEmptyDays(isFirstLine ? workerTimesheet.worker.defaultHours! : null),
  });
}

function addAttendance(workerTimesheet: WorkerTimesheetType) {
  const isFirstLine = workerTimesheet.worksTimesheet.length === 0;

  workerTimesheet.worksTimesheet.push({
    type: 'ATTENDANCE_CODE',
    attendanceCode: AttendanceCode.SL,
    work: undefined,
    days: createEmptyDays(isFirstLine ? workerTimesheet.worker.defaultHours! : null),
  });
}

function createEmptyDays(defaultHours: number | null = null): DayEntryType[] {
  return Array.from({ length: daysInMonth.value }, (_, index) => {
    const day = index + 1;

    return {
      date: createDate(day),
      hours: isNonWorkingDay(day) ? null : defaultHours,
    };
  });
}

function createDate(day: number): string {
  const month = String(selectedMonth.value).padStart(2, '0');
  const dayString = String(day).padStart(2, '0');

  return `${selectedYear.value}-${month}-${dayString}`;
}

/**********************************************************************************************************************
 * DAYS
 *********************************************************************************************************************/

function getDayEntry(work: WorkTimesheetType, day: number): DayEntryType | undefined {
  const date = getDate(selectedYear.value, selectedMonth.value, day);
  return work.days.find((entry) => entry.date === date);
}

function getDayValue(work: WorkTimesheetType, day: number): string {
  const dayEntry = getDayEntry(work, day);
  return dayEntry?.hours?.toString() ?? '';
}

function updateDay(work: WorkTimesheetType, day: number, event: Event) {
  let entry = getDayEntry(work, day);

  if (!entry) {
    entry = createDayEntry(day, 0);
    work.days.push(entry);
  }

  const dayValue = (event.target as HTMLInputElement).value.trim();
  if (dayValue === '') {
    work.days = work.days.filter((d) => d !== entry);
    recalculateTotals();
    return;
  }

  entry.hours = Number.isNaN(dayValue) ? null : Number(dayValue);
  recalculateTotals();
}

function createDayEntry(day: number, hours: number): DayEntryType {
  return {
    date: getDate(selectedYear.value, selectedMonth.value, day),
    hours,
  };
}

/************************************************************************************************************* TOTALS */

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
    workerTimesheet.totalCost =
      workerTimesheet.worker.workerContractType == WorkerContractType.CONTRACTOR
        ? totalHours * workerTimesheet.worker.hourRate!
        : workerTimesheet.worker.monthlySalary!;
  });
}

/**********************************************************************************************************************
 * STYLE
 *********************************************************************************************************************/

function isNonWorkingDay(day: number): boolean {
  const date = new Date(selectedYear.value, selectedMonth.value - 1, day);

  return date.getDay() === 0 || date.getDay() === 6 || isHoliday(selectedYear.value, selectedMonth.value, day);
}

function isToday(day: number): boolean {
  return (
    selectedYear.value === today.getFullYear() &&
    selectedMonth.value === today.getMonth() + 1 &&
    day === today.getDate()
  );
}
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

thead th {
  height: 35px;
}

thead tr:first-child th {
  position: sticky;
  top: 0;
  z-index: 20;
}

thead tr:nth-child(2) th {
  position: sticky;
  top: 35px;
  z-index: 19;
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

thead th.weekend {
  background: var(--color-background-disabled);
  color: var(--color-text-disabled);
}

.day-cell.weekend {
  background: var(--color-background-disabled);

  input {
    background: transparent;
    color: var(--color-text-disabled);
  }
}

.worker-name,
.work-name,
.add-work-actions {
  position: sticky;
  left: 0;
  z-index: 5;
  background: var(--color-background);
}

.table td.worker-name {
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
  display: flex;
  gap: 8px;

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
