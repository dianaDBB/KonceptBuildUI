<template>
  <div class="main-section">
    <div class="section-header">
      <span><HandCoins :size="24" /></span>
      <h3>Salários</h3>

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
          A carregar salários...
        </div>
      </div>
      <div class="section-body">
        <div class="table">
          <table>
            <colgroup>
              <col
                v-for="config in Object.values(configs)"
                :key="config.label"
                :style="config.styleConfig.columnStyle"
              />
              <col style="width: 50px" />
            </colgroup>
            <thead>
              <tr>
                <th v-for="config in Object.values(configs)" :key="config.label">
                  <div class="column-heading">
                    {{ config.label }}

                    <InfoTooltip
                      v-if="config.additionalInfo"
                      :title="config.additionalInfo.tooltipTitle"
                      :items="config.additionalInfo.tooltipItems"
                      :info="config.additionalInfo.tooltipInfo"
                    />

                    <TableColumnFilter
                      :config="config"
                      :filters="wageFilters"
                      :sort-by="wageFilters.sortBy"
                      :sort-direction="wageFilters.sortDirection"
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
            <EntityTableBody
              :rows="wages"
              :configs="configs"
              :row-is-active="() => true"
              :is-valid="(wage) => Wage.isValid(wage, configs)"
              :is-editing="isEditing"
              @row-edit="startEditing"
              @row-save="save"
              @row-discard="discard"
            />
          </table>
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
import { ref, onMounted, computed } from 'vue';
import { ApiResponseStatus } from '@/types/api-response-status';
import { ChevronRight, HandCoins, LoaderCircle, FunnelX } from 'lucide-vue-next';
import Toast from '@/composables/Toast.vue';
import { SortDirection } from '@/types/sort-direction';
import TableColumnFilter from '@/components/TableColumnFilter.vue';
import EntityTableBody from '@/composables/EntityTableBody.vue';
import { TableRow } from '@/types/entity-configs';
import configsApi from '@/services/configs-api';
import { apiError } from '@/services/api';
import { Wage } from '@/entities/wage';
import { PaymentMethodType } from '@/types/payment-method-type';
import { WageFilters, WageSortField, WageType } from '@/types/wage-type';
import wagesApi from '@/services/wages-api';
import InfoTooltip from '@/composables/InfoTooltip.vue';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const paymentMethodType = ref<{ [k: string]: PaymentMethodType }>({});
const wages = ref<WageRow[]>([]);

const configs = computed(() => Wage.getConfigs(paymentMethodType.value));

/*************************************************************************************************************** LOAD */

onMounted(async () => {
  await loadConfigs();
  await fetchWages();
});

async function loadConfigs() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotPaymentMethodValues = await configsApi.getPaymentMethodValues();
    paymentMethodType.value = Object.fromEntries(gotPaymentMethodValues.map((e) => [e.code, e]));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load config values.');
  }
}

async function fetchWages() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotWages = await wagesApi.searchWages(wageFilters.value);

    wages.value = gotWages.map((wage) => ({
      entity: {
        ...wage,
      },
      _key: wage.code ?? nextKey(),
      _isNew: false,
      _isEdited: false,
    }));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load works.');
  }
}

/******************************************************************************************************** ROW ACTIONS */

interface WageRow extends TableRow<WageType> {
  entity: WageType;
  _key: string;
  _isNew: boolean;
  _isEdited: boolean;
  _original?: WageType;
}

const isEditing = computed(() => wages.value.some((row) => row._isNew || row._isEdited));
let _keyCounter = 0;

function nextKey(): string {
  return `row-${++_keyCounter}`;
}

function discard(row: WageRow) {
  if (row._isNew) {
    wages.value = wages.value.filter((w) => w._key !== row._key);
  } else {
    row.entity = row._original!;
    row._isNew = false;
    row._isEdited = false;
  }
}

/*************************************************************************************************************** EDIT */

function startEditing(row: WageRow) {
  row._isEdited = true;
  row._original = JSON.parse(JSON.stringify(row.entity));
}

/*************************************************************************************************************** SAVE */

async function save(row: WageRow): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (row._isEdited) {
      await wagesApi.editWage(row.entity);
    }

    await fetchWages();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Wage saved successfully.',
    };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to save wage.');
  }
}

/************************************************************************************************************ FILTERS */

const wageFilters = ref<WageFilters>({});

const hasActiveTableControls = computed(() =>
  Object.values(wageFilters.value).some((value) => value !== undefined && value !== null && value !== ''),
);

function setSort(event: { column: WageSortField; direction: SortDirection | undefined }): void {
  wageFilters.value = {
    ...wageFilters.value,
    sortBy: event.direction ? event.column : undefined,
    sortDirection: event.direction,
  };

  fetchWages();
}

function applyFilterValues(values: Record<string, unknown>): void {
  wageFilters.value = { ...wageFilters.value, ...(values as Partial<WageFilters>) };

  fetchWages();
}

function clearFilterValues(values: Record<string, unknown>): void {
  wageFilters.value = { ...wageFilters.value, ...(values as Partial<WageFilters>) };

  fetchWages();
}

function clearAllTableControls(): void {
  wageFilters.value = {};

  void fetchWages();
}
</script>
<style scoped lang="scss"></style>
