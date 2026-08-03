<template>
  <div class="main-section">
    <div class="section-header">
      <span>
        <ClipboardClock :size="24" />
      </span>
      <h3>Timesheets</h3>

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
          {{ apiStatus.loadingMessage ?? 'A carregar timesheet...' }}
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
                <th class="worker-column" />

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

                <th class="sticky-hours" rowspan="2">Horas</th>
              </tr>

              <tr>
                <th class="worker-column worker-column-second" />

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
                        • {{ workerTimesheet.worker.currentWorkerCompensation?.defaultHours }}h •
                        {{
                          formatCurrency(
                            workerTimesheet.worker.currentWorkerCompensation?.monthlySalary ||
                              workerTimesheet.worker.currentWorkerCompensation?.hourRate,
                          )
                        }}
                      </div>
                    </div>
                  </td>

                  <td v-for="day in daysInMonth" :key="day" />

                  <template v-if="isCollapsed(workerTimesheet.worker.id!)">
                    <td class="sticky-hours">
                      {{ formatNumber(workerTimesheet.totalHours) }}
                    </td>
                  </template>
                  <template v-else>
                    <td class="sticky-hours">
                      <div class="summary-grid">
                        <strong>TOTAL</strong>
                        <strong>{{ formatNumber(workerTimesheet.totalHours) }}</strong>

                        <span>Estimadas</span>
                        <span>{{ formatNumber(workerTimesheet.expectedHours) }}</span>

                        <span>Extras</span>
                        <span>{{ formatNumber(workerTimesheet.totalExtraHours) }}</span>

                        <span>Aus. Pagas</span>
                        <span>{{ formatNumber(workerTimesheet.totalPaidAbsenceHours) }}</span>

                        <span>Aus. Não Pagas</span>
                        <span>{{ formatNumber(workerTimesheet.totalUnpaidAbsenceHours) }}</span>
                      </div>
                    </td>
                  </template>
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

                    <td class="sticky-hours">
                      <button
                        class="btn btn-icon"
                        @click="
                          lineToDelete = { worker: workerTimesheet, index: workIndex, line: workTimesheet };
                          showDeleteDialog = true;
                        "
                      >
                        <Trash2 :size="16" />
                      </button>
                    </td>
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
                </tr>
              </template>
            </tbody>
          </table>
        </div>

        <div class="actions">
          <button
            class="btn"
            :disabled="apiStatus.isLoading || !isTimesheetValid"
            @click="showGenerateWagesDialog = true"
          >
            <HandCoins :size="18" />
            Gerar Salários
          </button>

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

  <!-- delete timesheet line-->
  <ConfirmDialog
    v-model="showDeleteDialog"
    title="Eliminar linha"
    :message="[
      `${lineToDelete?.worker.worker.name}' - '${lineToDelete?.line.work?.code ?? attendanceCode[lineToDelete?.line.attendanceCode!]?.label}`,
      'Tem a certeza que quer eliminar definitivamente esta linha?'
    ]"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="deleteWorkLine"
  />

  <!-- confirm wage-->
  <ConfirmDialog
    v-model="showGenerateWagesDialog"
    title="Gerar salários?"
    :message="[
      'Os salários já existentes para este mês serão substituídos pelos valores atuais da folha de horas.',
      'Esta ação NÃO pode ser revertida.',
      'Tem a certeza que pretende continuar?',
    ]"
    confirm-text="Gerar salários"
    cancel-text="Cancelar"
    @confirm="generateWages"
  />

  <!-- go to wages (after generate)-->
  <ConfirmDialog
    v-model="showWagesGeneratedDialog"
    title="Salários gerados"
    :message="['Os salários foram gerados com sucesso.', 'Pretende abrir a página de Salários?']"
    confirm-text="Ir para Salários"
    cancel-text="Ficar nesta página"
    @confirm="goToWages"
  />
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
  Trash2,
  HandCoins,
} from 'lucide-vue-next';
import Toast from '@/components/Toast.vue';
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
import SearchSelect from '@/components/SearchSelect.vue';
import { WorkStatusEnum } from '@/types/work-status-enum';
import { getDate, getWeekday, isToday, isHoliday, isWeekend, monthNames } from '@/utils/date';
import { AttendanceCodeEnum } from '@/types/attendance-code-enum';
import { WorkerContractTypeEnum } from '@/types/worker-contract-type-enum';
import configsApi from '@/services/configs-api';
import { apiError } from '@/services/api';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import wagesApi from '@/services/wages-api';
import { useRouter } from 'vue-router';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const today = new Date();
const selectedYear = ref(today.getFullYear());
const selectedMonth = ref(today.getMonth() + 1);

const attendanceCode = ref<{ [k: string]: AttendanceCodeEnum }>({});
const workStatus = ref<{ [k: string]: WorkStatusEnum }>({});
const workerContractType = ref<{ [k: string]: WorkerContractTypeEnum }>({});

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
    startDate: {
      min: getDate(selectedYear.value, selectedMonth.value, 1),
      max: getDate(selectedYear.value, selectedMonth.value, daysInMonth.value),
    },
  };
  availableWorks.value = await workApi.searchWorks(workFilters);
}

async function fetchTimesheet() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false, loadingMessage: 'A carregar timesheet...' };

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
    days: createEmptyDays(isFirstLine ? workerTimesheet.worker.currentWorkerCompensation!.defaultHours! : null),
  });
}

function addAttendance(workerTimesheet: WorkerTimesheetType) {
  const isFirstLine = workerTimesheet.worksTimesheet.length === 0;

  workerTimesheet.worksTimesheet.push({
    type: 'ATTENDANCE_CODE',
    attendanceCode: attendanceCode.value.VACATION.code,
    work: undefined,
    days: createEmptyDays(isFirstLine ? workerTimesheet.worker.currentWorkerCompensation!.defaultHours! : null),
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

/************************************************************************************************************* DELETE */

const showDeleteDialog = ref(false);
const lineToDelete = ref<{
  worker: WorkerTimesheetType;
  index: number;
  line: WorkTimesheetType;
} | null>(null);

async function deleteWorkLine() {
  if (!lineToDelete.value) {
    return;
  }

  lineToDelete.value.worker.worksTimesheet.splice(lineToDelete.value.index, 1);

  showDeleteDialog.value = false;
  lineToDelete.value = null;

  await save();
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
    workerTimesheet.totalHours = undefined;
    return;
  }

  entry.hours = Number.isNaN(dayValue) ? null : Number(dayValue);
  workerTimesheet.totalHours = undefined;
}

function createDayEntry(day: number, hours: number): DayEntryType {
  return {
    date: getDate(selectedYear.value, selectedMonth.value, day),
    hours,
  };
}

/************************************************************************************************************** WAGES */

const showGenerateWagesDialog = ref(false);
const showWagesGeneratedDialog = ref(false);
const router = useRouter();

async function generateWages() {
  if (!timesheet.value) {
    return;
  }

  apiStatus.value = { isLoading: true, isSuccess: false, isError: false, loadingMessage: 'A gerar salários...' };

  try {
    await Promise.all(
      timesheet.value.workersTimesheet.map((workerTimesheet) =>
        wagesApi.addWage({
          year: timesheet.value!.year,
          month: timesheet.value!.month,
          workerId: workerTimesheet.worker.id!,
          timesheetId: workerTimesheet.timesheetId,
        }),
      ),
    );

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false, message: 'Salários gerados com sucesso.' };

    showWagesGeneratedDialog.value = true;
  } catch (error) {
    apiStatus.value = apiError(error, 'Falha ao gerar salários.');
  }
}

function goToWages() {
  router.push('/hr/wages');
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

thead tr:first-child .worker-column {
  position: sticky;
  top: 0;
  left: 0;
  z-index: 30;
}

thead tr:nth-child(2) .worker-column-second {
  position: sticky;
  top: 35px;
  left: 0;
  z-index: 29;
}

thead .worker-column,
thead .worker-column-second {
  position: sticky;
  left: 0;
  background: var(--color-background);
}

thead .worker-column {
  top: 0;
  z-index: 30;
  border-bottom: 0;
}

thead .worker-column-second {
  top: 35px;
  z-index: 29;
  border-top: 0;
}

.day-column {
  width: 50px;
}

.sticky-hours {
  position: sticky;
  background: var(--color-background);
  z-index: 8;
}

.sticky-hours {
  right: 0px;
  width: 200px;
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

.summary-grid {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 4px 12px;
}

.summary-grid-reverse {
  grid-template-columns: auto 1fr;
}

.summary-grid-reverse > :nth-child(odd) {
  text-align: left;
}

.summary-grid-reverse > :nth-child(even) {
  text-align: right;
}
</style>
