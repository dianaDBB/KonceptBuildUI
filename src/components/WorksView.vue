<template>
  <div class="main-section">
    <div class="section-header">
      <span><List :size="24" /></span>
      <h3>Obras</h3>

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
              <!-- status -->
              <col style="width: 90px" />
              <!-- contractedBudget -->
              <col style="width: 100px" />
              <!-- estimatedCost -->
              <col style="width: 100px" />
              <!-- estimatedCostMaterials -->
              <col style="width: 100px" />
              <!-- estimatedCostLabor -->
              <col style="width: 100px" />
              <!-- estimatedMarginEur -->
              <col style="width: 100px" />
              <!-- estimatedMarginPercentual -->
              <col style="width: 100px" />
              <!-- startDate -->
              <col style="width: 130px" />
              <!-- estimatedEndDate -->
              <col style="width: 130px" />
              <!-- endDate -->
              <col style="width: 130px" />
              <!-- client -->
              <col style="width: 200px" />
              <!-- ACTIONS -->
              <col style="width: 50px" />
            </colgroup>
            <thead>
              <tr>
                <th v-for="config in Object.values(Work.configs)" :key="config.label">
                  <div class="column-heading">
                    {{ config.label }}

                    <TableColumnFilter
                      :config="config"
                      :filters="workFilters"
                      :sort-by="workFilters.sortBy"
                      :sort-direction="workFilters.sortDirection"
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
                v-for="row in works"
                :key="row._key"
                :class="{ disabled: !workIsActive(row) }"
                @dblclick="startEditWork(row)"
              >
                <!-- CODE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.work.code"
                      type="text"
                      :disabled="Work.configs.code.showDisabled(row.work)"
                      :class="{ required: Work.configs.code.isInvalid(row.work) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.work.code }}
                  </template>
                </td>

                <!-- NAME -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.work.name"
                      type="text"
                      :disabled="Work.configs.name.showDisabled(row.work)"
                      :class="{ required: Work.configs.name.isInvalid(row.work) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.work.name }}
                  </template>
                </td>

                <!-- STATUS -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <select
                      v-model="row.work.status"
                      :disabled="Work.configs.status.showDisabled(row.work)"
                      :class="{ required: Work.configs.status.isInvalid(row.work) }"
                    >
                      <option v-for="option in Work.configs.status.options" :key="option.value" :value="option.value">
                        {{ option.label }}
                      </option>
                    </select>
                  </template>
                  <template v-else>
                    {{ WorkStatus.getLabel(row.work.status) }}
                  </template>
                </td>

                <!-- CONTRACTED BUDGET -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="formatNumber(row.work.contractedBudget)"
                      type="text"
                      inputmode="decimal"
                      :disabled="Work.configs.contractedBudget.showDisabled(row.work)"
                      :class="{ required: Work.configs.contractedBudget.isInvalid(row.work) }"
                      @input="handleMoneyInput($event, row.work, 'contractedBudget')"
                    />
                  </template>
                  <template v-else>
                    {{ formatCurrency(row.work.contractedBudget) }}
                  </template>
                </td>

                <!-- ESTIMATED COST -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="formatNumber(row.work.estimatedCost)"
                      type="text"
                      inputmode="decimal"
                      :disabled="Work.configs.estimatedCost.showDisabled(row.work)"
                      :class="{ required: Work.configs.estimatedCost.isInvalid(row.work) }"
                      @input="handleMoneyInput($event, row.work, 'estimatedCost')"
                    />
                  </template>
                  <template v-else>
                    {{ formatCurrency(row.work.estimatedCost) }}
                  </template>
                </td>

                <!-- ESTIMATED COST MATERIALS -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="formatNumber(row.work.estimatedCostMaterials)"
                      type="text"
                      inputmode="decimal"
                      :disabled="Work.configs.estimatedCostMaterials.showDisabled(row.work)"
                      :class="{ required: Work.configs.estimatedCostMaterials.isInvalid(row.work) }"
                      @input="handleMoneyInput($event, row.work, 'estimatedCostMaterials')"
                    />
                  </template>
                  <template v-else>
                    {{ formatCurrency(row.work.estimatedCostMaterials) }}
                  </template>
                </td>

                <!-- ESTIMATED COST LABOR -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="formatNumber(row.work.estimatedCostLabor)"
                      type="text"
                      inputmode="decimal"
                      :disabled="Work.configs.estimatedCostLabor.showDisabled(row.work)"
                      :class="{ required: Work.configs.estimatedCostLabor.isInvalid(row.work) }"
                      @input="handleMoneyInput($event, row.work, 'estimatedCostLabor')"
                    />
                  </template>
                  <template v-else>
                    {{ formatCurrency(row.work.estimatedCostLabor) }}
                  </template>
                </td>

                <!-- ESTIMATED MARGIN EUR -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="formatNumber(row.work.estimatedMarginEur)"
                      type="text"
                      inputmode="decimal"
                      :disabled="Work.configs.estimatedMarginEur.showDisabled(row.work)"
                      :class="{ required: Work.configs.estimatedMarginEur.isInvalid(row.work) }"
                      @input="handleMoneyInput($event, row.work, 'estimatedMarginEur')"
                    />
                  </template>
                  <template v-else>
                    {{ formatCurrency(row.work.estimatedMarginEur) }}
                  </template>
                </td>

                <!-- ESTIMATED MARGIN PERCENTUAL -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      :value="formatNumber(row.work.estimatedMarginPercentual)"
                      type="text"
                      inputmode="decimal"
                      :disabled="Work.configs.estimatedMarginPercentual.showDisabled(row.work)"
                      :class="{ required: Work.configs.estimatedMarginPercentual.isInvalid(row.work) }"
                    />
                  </template>
                  <template v-else>
                    {{ formatPercentage(row.work.estimatedMarginPercentual) }}
                  </template>
                </td>

                <!-- START DATE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.work.startDate"
                      type="date"
                      :disabled="Work.configs.startDate.showDisabled(row.work)"
                      :class="{ required: Work.configs.startDate.isInvalid(row.work) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.work.startDate ? row.work.startDate : '-' }}
                  </template>
                </td>

                <!-- ESTIMATED END DATE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.work.estimatedEndDate"
                      type="date"
                      :disabled="Work.configs.estimatedEndDate.showDisabled(row.work)"
                      :class="{ required: Work.configs.estimatedEndDate.isInvalid(row.work) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.work.estimatedEndDate ? row.work.estimatedEndDate : '-' }}
                  </template>
                </td>

                <!-- END DATE -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <input
                      v-model="row.work.endDate"
                      type="date"
                      :disabled="Work.configs.endDate.showDisabled(row.work)"
                      :class="{ required: Work.configs.endDate.isInvalid(row.work) }"
                    />
                  </template>
                  <template v-else>
                    {{ row.work.endDate ? row.work.endDate : '-' }}
                  </template>
                </td>

                <!-- CLIENT -->
                <td>
                  <template v-if="rowHasChanges(row)">
                    <SearchSelect
                      v-model="row.work.client"
                      :options="clients"
                      :disabled="Work.configs.clientName.showDisabled(row.work)"
                      :isValid="Work.configs.clientName.isInvalid(row.work)"
                    >
                      <template #selected="{ option }">
                        {{ option.companyName }}
                      </template>

                      <template #option="{ option }">
                        {{ option.companyName }} <br />
                        {{ option.nif }} <br />
                        {{ option.code }}
                      </template>
                    </SearchSelect>
                  </template>
                  <template v-else>
                    <div class="with-info-tooltip">
                      <span>{{ row.work.client?.companyName }}</span>
                      <InfoTooltip
                        v-if="row.work.client"
                        :title="row.work.client.companyName"
                        position="left"
                        :items="[
                          { label: Client.configs.code.label, value: row.work.client.code },
                          { label: Client.configs.companyName.label, value: row.work.client.companyName },
                          { label: Client.configs.address.label, value: row.work.client.address },
                          { label: Client.configs.postalCode.label, value: row.work.client.postalCode },
                          { label: Client.configs.city.label, value: row.work.client.city },
                          { label: Client.configs.district.label, value: row.work.client.district },
                          { label: Client.configs.nif.label, value: row.work.client.nif },
                          { label: Client.configs.contact.label, value: row.work.client.contact },
                          { label: Client.configs.email.label, value: row.work.client.email },
                          {
                            label: Client.configs.phone.label,
                            value: `${row.work.client.phoneCountryCode ?? ''} ${row.work.client.phone ?? ''}`,
                          },
                          { label: Client.configs.status.label, value: Status.getLabel(row.work.client.status) },
                          { label: Client.configs.note.label, value: row.work.client.note },
                        ]"
                      />
                    </div>
                  </template>
                </td>

                <!-- ACTIONS -->
                <td>
                  <div v-if="!rowHasChanges(row)" class="action-buttons">
                    <button :disabled="isEditing" @click="askDelete(row)"><Trash2 :size="16" /></button>
                    <button :disabled="isEditing" @click="startEditWork(row)">
                      <Pencil :size="16" />
                    </button>
                  </div>
                  <div v-if="rowHasChanges(row)" class="action-buttons editing">
                    <button @click="discardRow(row)"><Undo2 :size="16" /></button>
                    <button :disabled="!isRowValid(row)" @click="saveWork(row)">
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
              A carregar clientes...
            </div>
          </div>
        </div>

        <div class="actions">
          <button :disabled="isEditing || apiStatus.isLoading" @click="addWork">
            <Plus :size="18" /> Adicionar Cliente
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
    title="Eliminar obra"
    :message="`Tem a certeza que quer eliminar definitivamente a obra '${workToDelete?.work.name}'?`"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { ApiResponseStatus } from '@/types/api-response-status';
import { List, Pencil, Trash2, Check, Undo2, Plus, LoaderCircle, FunnelX } from 'lucide-vue-next';
import Toast from '@/composables/Toast.vue';
import { SortDirection } from '@/types/sort-direction';
import TableColumnFilter from '@/components/TableColumnFilter.vue';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/validation';
import ConfirmDialog from '@/composables/ConfirmDialog.vue';
import axios from 'axios';
import { WorkType, WorkFilters, WorkSortField } from '@/types/work-type';
import { WorkStatus } from '@/types/work-status';
import workApi from '@/services/work-api';
import { handleMoneyInput } from '@/utils/handle-money-input';
import { ClientType } from '@/types/client-type';
import clientApi from '@/services/client-api';
import InfoTooltip from '@/composables/InfoTooltip.vue';
import SearchSelect from '@/composables/SearchSelect.vue';
import { Status } from '@/types/status';
import { Work } from '@/entities/work';
import { Client } from '@/entities/client';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const tableBody = ref<HTMLTableSectionElement | null>(null);

/******************************************************************************************************** ROW ACTIONS */

interface WorkRow {
  work: WorkType;
  _key: string;
  _isNew: boolean;
  _isEdited: boolean;
  _original?: WorkType;
}

const clients = ref<ClientType[]>([]);
const works = ref<WorkRow[]>([]);
const isEditing = computed(() => works.value.some((row) => row._isNew || row._isEdited));
let _keyCounter = 0;

function nextKey(): string {
  return `row-${++_keyCounter}`;
}

function rowHasChanges(row: WorkRow) {
  return row._isNew || row._isEdited;
}

function discardRow(row: WorkRow) {
  if (row._isNew) {
    works.value = works.value.filter((w) => w._key !== row._key);
  } else {
    row.work = row._original!;
    row._isNew = false;
    row._isEdited = false;
  }
}

function isRowValid(row: WorkRow) {
  return (
    row.work.name?.trim() &&
    row.work.status?.trim() &&
    row.work.contractedBudget &&
    row.work.estimatedCostMaterials &&
    row.work.estimatedCostLabor &&
    row.work.startDate?.trim() &&
    row.work.estimatedEndDate?.trim()
  );
}

function workIsActive(row: WorkRow) {
  return row.work.status != WorkStatus.DONE;
}

/**************************************************************************************************************** GET */

async function fetchWorks() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotWorks = await workApi.searchWorks(workFilters.value);

    works.value = gotWorks.map((work) => ({
      work: {
        ...work,
      },
      _key: work.code ?? nextKey(),
      _isNew: false,
      _isEdited: false,
    }));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = {
      isLoading: false,
      isSuccess: false,
      isError: true,
      message: error instanceof Error ? error.message : 'Could not load works.',
    };
  }
}

async function fetchClients() {
  clients.value = await clientApi.searchClients();
}

/*************************************************************************************************************** EDIT */

function startEditWork(row: WorkRow) {
  row._isEdited = true;
  row._original = JSON.parse(JSON.stringify(row.work));
}

/**************************************************************************************************************** ADD */

async function addWork(): Promise<void> {
  works.value.push({
    work: {
      status: WorkStatus.STARTED,
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

async function saveWork(row: WorkRow): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (row._isNew) {
      await workApi.addWork(row.work);
    }

    if (row._isEdited) {
      await workApi.editWork(row.work);
    }

    await fetchWorks();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Work saved successfully.',
    };
  } catch (error: unknown) {
    let message = 'Failed to save work.';

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
const workToDelete = ref<WorkRow | null>(null);

function askDelete(row: WorkRow) {
  workToDelete.value = row;
  showDeleteDialog.value = true;
}

async function confirmDelete(): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (!workToDelete.value?.work.id) {
      return;
    }

    await workApi.deleteWork(workToDelete.value.work.id);
    await fetchWorks();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Work deleted successfully.',
    };

    showDeleteDialog.value = false;
    workToDelete.value = null;
  } catch (error: unknown) {
    let message = 'Failed to delete work.';

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

const workFilters = ref<WorkFilters>({});

const hasActiveTableControls = computed(() =>
  Object.values(workFilters.value).some((value) => value !== undefined && value !== null && value !== ''),
);

function setSort(event: { column: WorkSortField; direction: SortDirection | undefined }): void {
  workFilters.value = {
    ...workFilters.value,
    sortBy: event.direction ? event.column : undefined,
    sortDirection: event.direction,
  };

  fetchWorks();
}

function applyFilterValues(values: Record<string, unknown>): void {
  workFilters.value = { ...workFilters.value, ...(values as Partial<WorkFilters>) };

  fetchWorks();
}

function clearFilterValues(values: Record<string, unknown>): void {
  workFilters.value = { ...workFilters.value, ...(values as Partial<WorkFilters>) };

  fetchWorks();
}

function clearAllTableControls(): void {
  workFilters.value = {};

  void fetchWorks();
}

onMounted(() => {
  fetchWorks();
  fetchClients();
});
</script>
<style scoped lang="scss"></style>
