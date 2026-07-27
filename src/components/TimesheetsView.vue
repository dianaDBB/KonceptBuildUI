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
      <div v-if="apiStatus.isLoading" class="loading-overlay">
        <div>
          <LoaderCircle :size="18" class="spinner" />
          A carregar timesheet...
        </div>
      </div>

      <div class="section-body">
        <div class="month-toolbar">
          <div class="month-navigation">
            <button class="btn btn-icon" :disabled="apiStatus.isLoading" @click="previousMonth">
              <ChevronLeft :size="15" />
            </button>

            <h3>{{ monthName }} {{ selectedYear }}</h3>

            <button class="btn btn-icon" :disabled="apiStatus.isLoading" @click="nextMonth">
              <ChevronRight :size="15" />
            </button>
          </div>
          <div class="expand-collapse">
            <button class="btn btn-sm" @click="expandAll">
              <CopyPlus :size="15" />
              Expandir tudo
            </button>

            <button class="btn btn-sm" @click="collapseAll">
              <CopyMinus :size="15" />
              Colapsar tudo
            </button>
          </div>
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
                  :class="{
                    today: isToday(selectedYear, selectedMonth, day),
                    weekend: isWeekend(selectedYear, selectedMonth, day),
                    holiday: isHoliday(selectedYear, selectedMonth, day),
                  }"
                >
                  {{ getWeekday(selectedYear, selectedMonth, day) }}
                </th>

                <th class="total-hours" colspan="4">Horas</th>
                <th class="total-cost" colspan="3">Custos (€)</th>
              </tr>

              <tr>
                <th
                  v-for="day in daysInMonth"
                  :key="day"
                  class="day-column"
                  :class="{
                    today: isToday(selectedYear, selectedMonth, day),
                    weekend: isWeekend(selectedYear, selectedMonth, day),
                    holiday: isHoliday(selectedYear, selectedMonth, day),
                  }"
                >
                  {{ day }}
                </th>

                <th class="total-hours-column">Total</th>
                <th class="total-hours-column">Extras</th>
                <th class="total-hours-column">Aus. Pagas</th>
                <th class="total-hours-column">Aus. Não Pagas</th>

                <th class="total-cost-column">Total</th>
                <th class="total-cost-column">Extras</th>
                <th class="total-cost-column">Aus. Não Pagas</th>
              </tr>

              <tr></tr>
            </thead>

            <tbody>
              <template v-for="workerTimesheet in timesheet?.workersTimesheet" :key="workerTimesheet.worker.id">
                <!-- Worker -->

                <tr class="worker-row">
                  <td class="worker-name">
                    <div class="worker-header">
                      <button class="btn-icon" @click="toggleWorker(workerTimesheet.worker.id!)">
                        <component :is="isCollapsed(workerTimesheet.worker.id!) ? Plus : Minus" :size="16" />
                      </button>

                      <span class="worker-title">
                        {{ workerTimesheet.worker.name }}
                      </span>
                    </div>

                    <div class="worker-details">
                      <div>
                        {{ workerContractType[workerTimesheet.worker.workerContractType!].label }}
                        • {{ workerTimesheet.worker.defaultHours }}h •
                        {{ formatCurrency(workerTimesheet.worker.hourRate || workerTimesheet.worker.monthlySalary) }}
                      </div>
                    </div>
                  </td>

                  <td v-for="day in daysInMonth" :key="day" />

                  <td class="total-hours">
                    {{ formatNumber(workerTimesheet.totalHours) }}
                  </td>

                  <td class="total-hours">
                    {{ formatNumber(workerTimesheet.totalExtraHours) }}
                  </td>

                  <td class="total-hours">
                    {{ formatNumber(workerTimesheet.totalPaidAbsenceHours) }}
                  </td>

                  <td class="total-hours">
                    {{ formatNumber(workerTimesheet.totalUnpaidAbsenceHours) }}
                  </td>

                  <td class="total-cost">
                    {{ formatCurrency(workerTimesheet.totalCost) }}
                  </td>

                  <td class="total-cost">
                    {{ formatCurrency(workerTimesheet.totalCostExtraHours) }}
                  </td>

                  <td class="total-cost">
                    {{ formatCurrency(workerTimesheet.totalCostUnpaidAbsenceHours) }}
                  </td>
                </tr>

                <!-- Timesheet lines -->

                <template v-if="!isCollapsed(workerTimesheet.worker.id!)">
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
                            {{ workStatus[option.status!]?.label }}
                          </div>
                        </template>
                      </SearchSelect>

                      <select v-else v-model="workTimesheet.attendanceCode">
                        <option v-for="option in attendanceCode" :key="option.code" :value="option.code">
                          {{ option.label }}
                        </option>
                      </select>
                    </td>

                    <td
                      v-for="day in daysInMonth"
                      :key="day"
                      class="day-cell"
                      :class="{
                        today: isToday(selectedYear, selectedMonth, day),
                        weekend: isWeekend(selectedYear, selectedMonth, day),
                        holiday: isHoliday(selectedYear, selectedMonth, day),
                      }"
                    >
                      <input
                        class="day-input"
                        :class="{ filled: getDayValue(workTimesheet, day) !== '' }"
                        :value="getDayValue(workTimesheet, day)"
                        @input="updateDay(workerTimesheet, workTimesheet, day, $event)"
                      />
                    </td>

                    <td />

                    <td />
                  </tr>
                </template>

                <!-- Add new line -->

                <tr v-if="!isCollapsed(workerTimesheet.worker.id!)" class="add-work-row">
                  <td class="add-work-actions">
                    <button class="btn btn-work-action" @click="addWork(workerTimesheet)">
                      <PlusIcon :size="8" />
                      Obra
                    </button>

                    <button
                      v-if="workerTimesheet.worker.workerContractType === 'INTERNAL'"
                      class="btn btn-work-action"
                      @click="addAttendance(workerTimesheet)"
                    >
                      <PlusIcon :size="8" />
                      Ausência
                    </button>
                  </td>
                  <td v-for="day in daysInMonth" :key="day"></td>
                  <td></td>
                  <td></td>
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="actions">
          <button class="btn" :disabled="apiStatus.isLoading || !isTimesheetValid" @click="save">
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
import {
  ClipboardClock,
  ChevronLeft,
  ChevronRight,
  PlusIcon,
  LoaderCircle,
  Save,
  CopyPlus,
  CopyMinus,
  Plus,
  Minus,
} from 'lucide-vue-next';
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
import { WorkFilters, WorkType } from '@/types/work-type';
import { formatCurrency, formatNumber } from '@/utils/validation';
import SearchSelect from '@/composables/SearchSelect.vue';
import { WorkStatusType } from '@/types/work-status-type';
import { getDate, getWeekday, isToday, isHoliday, isWeekend, monthNames } from '@/utils/date';
import { AttendanceCodeType } from '@/types/attendance-code-type';
import { WorkerContractType } from '@/types/worker-contract-type';
import configsApi from '@/services/configs-api';
import { apiError } from '@/services/api';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const today = new Date();
const selectedYear = ref(today.getFullYear());
const selectedMonth = ref(today.getMonth() + 1);

const attendanceCode = ref<{ [k: string]: AttendanceCodeType }>({});
const workStatus = ref<{ [k: string]: WorkStatusType }>({});
const workerContractType = ref<{ [k: string]: WorkerContractType }>({});

const timesheet = ref<MonthlyTimesheetType>();
const availableWorks = ref<WorkType[]>([]);

const monthName = computed(() => monthNames[selectedMonth.value - 1]);
const daysInMonth = computed(() => new Date(selectedYear.value, selectedMonth.value, 0).getDate());

/*************************************************************************************************************** LOAD */

onMounted(async () => {
  await loadConfigs();
  await fetchWorks();
  await fetchTimesheet();

  collapseAll();
});

async function loadConfigs() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotAttendanceCodeValues = await configsApi.getAttendanceCodeValues();
    attendanceCode.value = Object.fromEntries(gotAttendanceCodeValues.map((e) => [e.code, e]));

    const gotWorkStatusValues = await configsApi.getWorkStatusValues();
    workStatus.value = Object.fromEntries(gotWorkStatusValues.map((e) => [e.code, e]));

    const gotWorkerContractTypeValues = await configsApi.getWorkerContractTypeValues();
    workerContractType.value = Object.fromEntries(gotWorkerContractTypeValues.map((e) => [e.code, e]));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load config values.');
  }
}

async function fetchWorks() {
  const workFilters: WorkFilters = {
    startDateMax: getDate(selectedYear.value, selectedMonth.value, daysInMonth.value),
    endDateMin: getDate(selectedYear.value, selectedMonth.value, 1),
  };
  availableWorks.value = await workApi.searchWorks(workFilters);
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
    apiStatus.value = apiError(error, 'Failed to load timesheet.');
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

  await fetchWorks();
  await fetchTimesheet();
}

async function nextMonth() {
  if (selectedMonth.value === 12) {
    selectedMonth.value = 1;
    selectedYear.value++;
  } else {
    selectedMonth.value++;
  }

  await fetchWorks();
  await fetchTimesheet();
}

/*************************************************************************************************************** SAVE */

const isTimesheetValid = computed(() => {
  if (!timesheet.value) {
    return false;
  }

  return timesheet.value.workersTimesheet.every((worker) =>
    worker.worksTimesheet.every((line) => {
      const hasWork = line.work != null;
      const hasAttendance = line.attendanceCode != null;

      return hasWork !== hasAttendance;
    }),
  );
});

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
    apiStatus.value = apiError(error, 'Failed to save timesheet.');
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
    attendanceCode: attendanceCode.value.VACATION.code,
    work: undefined,
    days: createEmptyDays(isFirstLine ? workerTimesheet.worker.defaultHours! : null),
  });
}

function createEmptyDays(defaultHours: number | null = null): DayEntryType[] {
  return Array.from({ length: daysInMonth.value }, (_, index) => {
    const day = index + 1;

    return {
      date: createDate(day),
      hours:
        isWeekend(selectedYear.value, selectedMonth.value, day) ||
        isHoliday(selectedYear.value, selectedMonth.value, day)
          ? null
          : defaultHours,
    };
  });
}

function createDate(day: number): string {
  const month = String(selectedMonth.value).padStart(2, '0');
  const dayString = String(day).padStart(2, '0');

  return `${selectedYear.value}-${month}-${dayString}`;
}

/************************************************************************************************** COLLPASE / EXPAND */

const collapsedWorkers = ref(new Set<string>());

function isCollapsed(workerId: string): boolean {
  return collapsedWorkers.value.has(workerId);
}

function toggleWorker(workerId: string) {
  if (collapsedWorkers.value.has(workerId)) {
    collapsedWorkers.value.delete(workerId);
  } else {
    collapsedWorkers.value.add(workerId);
  }

  collapsedWorkers.value = new Set(collapsedWorkers.value);
}

function collapseAll() {
  collapsedWorkers.value = new Set(timesheet.value?.workersTimesheet.map((w) => w.worker.id!) ?? []);
}

function expandAll() {
  collapsedWorkers.value = new Set();
}

/*************************************************************************************************************** DAYS */

function getDayEntry(work: WorkTimesheetType, day: number): DayEntryType | undefined {
  const date = getDate(selectedYear.value, selectedMonth.value, day);
  return work.days.find((entry) => entry.date === date);
}

function getDayValue(work: WorkTimesheetType, day: number): string {
  const dayEntry = getDayEntry(work, day);
  return dayEntry?.hours?.toString() ?? '';
}

function updateDay(workerTimesheet: WorkerTimesheetType, work: WorkTimesheetType, day: number, event: Event) {
  let entry = getDayEntry(work, day);

  if (!entry) {
    entry = createDayEntry(day, 0);
    work.days.push(entry);
  }

  const dayValue = (event.target as HTMLInputElement).value.trim();
  if (dayValue === '') {
    work.days = work.days.filter((d) => d !== entry);
    workerTimesheet.totalCost = undefined;
    workerTimesheet.totalHours = undefined;
    return;
  }

  entry.hours = Number.isNaN(dayValue) ? null : Number(dayValue);
  workerTimesheet.totalCost = undefined;
  workerTimesheet.totalHours = undefined;
}

function createDayEntry(day: number, hours: number): DayEntryType {
  return {
    date: getDate(selectedYear.value, selectedMonth.value, day),
    hours,
  };
}
</script>
<style>
.month-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 12px 18px;

  background: var(--color-background-alt);
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
}

.month-navigation,
.expand-collapse {
  display: flex;
  align-items: center;
  gap: 10px;
}

.month-navigation {
  gap: 18px;
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

.total-hours {
  width: 200px;
}

.total-hours-column {
  width: 50px;
}

.total-cost {
  width: 270px;
}

.total-cost-column {
  width: 90px;
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

thead th.holiday {
  background: var(--color-danger-bg);
  color: var(--color-danger);
}

.day-cell.holiday {
  background: var(--color-danger-bg);

  input {
    background: transparent;
    color: var(--color-danger);
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

.worker-name {
  vertical-align: top;
}

.worker-header {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-bottom: 4px;
}

.worker-title {
  font-size: 13px;
  font-weight: 600;
  color: var(--color-text);
}

.worker-details {
  margin-left: 33px; /* aligns with the title after the icon */
  font-size: 11px;
  line-height: 1.4;
  color: var(--color-text-muted);
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

  .btn-work-action {
    padding: 5px 8px;
    font-size: 10px;
  }
}

.day-input {
  width: calc(100% - 4px);
  margin: 0 auto;

  padding: 4px 6px;

  border-radius: 4px;

  background: transparent;
  color: var(--color-text);

  font-size: 12px;
  text-align: center;
}

.day-input:focus {
  border-color: var(--color-primary);
}
</style>
