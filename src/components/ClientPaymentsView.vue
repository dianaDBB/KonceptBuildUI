<template>
  <div class="main-section">
    <div class="section-header">
      <span><FileInput :size="24" /></span>
      <h3>Pagamentos de Clientes</h3>

      <div class="page-nav">
        <RouterLink to="/" class="link"> Página Inicial </RouterLink>
        <ChevronRight :size="14" class="separator" />
        <RouterLink :to="{ path: '/', query: { tab: 'sales' } }" class="link"> Vendas </RouterLink>
      </div>
    </div>

    <div class="section">
      <div v-if="apiStatus.isLoading" class="loading-overlay">
        <div>
          <LoaderCircle :size="18" class="spinner" />
          A carregar pagamentos...
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

                    <TableColumnFilter
                      :config="config"
                      :filters="clientPaymentsFilter"
                      :sort-by="clientPaymentsFilter.sortBy"
                      :sort-direction="clientPaymentsFilter.sortDirection"
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
              :rows="clientPayments"
              :configs="configs"
              :row-is-active="() => true"
              :is-valid="(clientPayment) => ClientPayment.isValid(clientPayment, configs)"
              :is-editing="isEditing"
              @row-edit="startEditing"
              @row-delete="askDelete"
              @row-save="save"
              @row-discard="discard"
            >
            </EntityTableBody>
          </table>
        </div>

        <div class="actions">
          <button class="btn" :disabled="isEditing || apiStatus.isLoading" @click="add">
            <Plus :size="18" /> Adicionar Pagamento
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
    title="Eliminar pagamento"
    :message="[
      `${clientPaymentToDelete?.entity.documentId}`,
      'Tem a certeza que quer eliminar definitivamente este pagamento?',
    ]"
    confirm-text="Apagar"
    cancel-text="Cancelar"
    @confirm="confirmDelete"
  />
</template>

<script setup lang="ts">
import { ref, onMounted, computed, nextTick } from 'vue';
import { ApiResponseStatus } from '@/types/api-response-status';
import { ChevronRight, FileInput, Plus, LoaderCircle, FunnelX } from 'lucide-vue-next';
import Toast from '@/components/Toast.vue';
import TableColumnFilter from '@/components/TableColumnFilter.vue';
import ConfirmDialog from '@/components/ConfirmDialog.vue';
import { ClientFilters, ClientSortField, ClientType } from '@/types/client-type';
import clientApi from '@/services/client-api';
import EntityTableBody from '@/components/EntityTableBody.vue';
import { TableRow } from '@/types/entity-configs';
import { apiError } from '@/services/api';
import { ClientPaymentFilters, ClientPaymentType } from '@/types/client-payment-type';
import { ClientPayment } from '@/entities/client-payment';
import clientPaymentApi from '@/services/client-payment-api';
import { ClientInvoiceType } from '@/types/client-invoice-type';
import clientInvoiceApi from '@/services/client-invoice-api';
import { useTableFilters } from '@/composables/useTableFilters';
import { useConfigs } from '@/composables/useConfigs';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });
const tableBody = ref<HTMLTableSectionElement | null>(null);

const status = useConfigs().statusOptions;
const clients = ref<ClientType[]>([]);
const clientInvoices = ref<ClientInvoiceType[]>([]);

const clientPayments = ref<ClientPaymentRow[]>([]);
const configs = computed(() => ClientPayment.getConfigs(clients.value, clientInvoices.value));

/*************************************************************************************************************** LOAD */

onMounted(async () => {
  await fetch();
  await fetchClients();
  await fetchClientInvoices();
});

async function fetch() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    const gotClientPayments = await clientPaymentApi.search(clientPaymentsFilter.value);

    clientPayments.value = gotClientPayments.map((clientPayment) => ({
      entity: {
        ...clientPayment,
      },
      _key: clientPayment.code ?? nextKey(),
      _isNew: false,
      _isEdited: false,
    }));

    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load client payments.');
  }
}

async function fetchClients() {
  const clientFilters: ClientFilters = {
    status: status.value.ACTIVE.code,
    sortBy: ClientSortField.CODE,
  };

  clients.value = await clientApi.searchClients(clientFilters);
}

async function fetchClientInvoices() {
  clientInvoices.value = await clientInvoiceApi.search();
}

/******************************************************************************************************** ROW ACTIONS */

interface ClientPaymentRow extends TableRow<ClientPaymentType> {
  entity: ClientPaymentType;
  _key: string;
  _isNew: boolean;
  _isEdited: boolean;
  _original?: ClientPaymentType;
}

const isEditing = computed(() => clientPayments.value.some((row) => row._isNew || row._isEdited));
let _keyCounter = 0;

function nextKey(): string {
  return `row-${++_keyCounter}`;
}

function discard(row: ClientPaymentRow) {
  if (row._isNew) {
    clientPayments.value = clientPayments.value.filter((w) => w._key !== row._key);
  } else {
    row.entity = row._original!;
    row._isNew = false;
    row._isEdited = false;
  }
}

/*************************************************************************************************************** EDIT */

function startEditing(row: ClientPaymentRow) {
  row._isEdited = true;
  row._original = JSON.parse(JSON.stringify(row.entity));
}

/**************************************************************************************************************** ADD */

async function add(): Promise<void> {
  clientPayments.value.push({
    entity: {
      paymentDate: new Date().toISOString().split('T')[0],
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

async function save(row: ClientPaymentRow): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (row._isNew) {
      console.log('Adding new client payment:', JSON.stringify(row.entity));
      await clientPaymentApi.add(row.entity);
    } else if (row._isEdited) {
      await clientPaymentApi.edit(row.entity);
    }

    await fetch();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client payment saved successfully.',
    };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to save client payment.');
  }
}

/************************************************************************************************************* DELETE */

const showDeleteDialog = ref(false);
const clientPaymentToDelete = ref<ClientPaymentRow | null>(null);

function askDelete(row: ClientPaymentRow) {
  clientPaymentToDelete.value = row;
  showDeleteDialog.value = true;
}

async function confirmDelete(): Promise<void> {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  try {
    if (!clientPaymentToDelete.value?.entity.id) {
      return;
    }

    await clientPaymentApi.delete(clientPaymentToDelete.value.entity.id);
    await fetch();

    apiStatus.value = {
      isLoading: false,
      isSuccess: true,
      isError: false,
      message: 'Client payment deleted successfully.',
    };

    showDeleteDialog.value = false;
    clientPaymentToDelete.value = null;
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to delete client payment.');
  }
}

/************************************************************************************************************ FILTERS */

const {
  filters: clientPaymentsFilter,
  hasActiveTableControls,
  setSort,
  applyFilterValues,
  clearFilterValues,
  clearAllTableControls,
} = useTableFilters<ClientPaymentFilters>(fetch);
</script>
<style scoped lang="scss"></style>
