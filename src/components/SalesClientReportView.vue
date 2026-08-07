<template>
  <div class="main-section">
    <div class="section-header">
      <span><LayoutDashboard :size="24" /></span>
      <h3>Extrato Cliente por Vencimento</h3>

      <div class="page-nav">
        <RouterLink to="/" class="link">Página Inicial</RouterLink>
        <ChevronRight :size="14" class="separator" />
        <RouterLink :to="{ path: '/', query: { tab: 'sales' } }" class="link"> Vendas </RouterLink>
      </div>
    </div>

    <div class="section">
      <div v-if="apiStatus.isLoading" class="loading-overlay">
        <div>
          <LoaderCircle :size="18" class="spinner" />
          A carregar relatório...
        </div>
      </div>

      <div class="section-body">
        <div class="dashboard-filters">
          <SearchSelect
            :model-value="selectedClient"
            :options="clients"
            :filter="clientFilter"
            @update:model-value="selectedClient = $event"
          >
            <template #selected="{ option }">
              <div class="report-title">
                {{ `${option.code} - ${option.companyName}` }}
              </div>
            </template>

            <template #option="{ option }">
              <div>
                <strong>{{ option.code }}</strong>
                <br />
                {{ option.companyName }}
              </div>
            </template>
          </SearchSelect>
        </div>
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-title">Valor Total (€) (C/IVA)</div>
            <div class="stat-value stat-style neutral">{{ formatCurrency(clientReport.totalValueWithTax) }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Valor Total ILíquido (C/IVA)</div>
            <div class="stat-value stat-style positive">{{ formatCurrency(clientReport.totalValueGross) }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Valor em Falta (€) (C/IVA)</div>
            <div class="stat-value stat-style warning">{{ formatCurrency(clientReport.totalAmountDueWithTax) }}</div>
          </div>
        </div>
        <section class="dashboard-card">
          <div class="dashboard-table-wrapper">
            <table class="dashboard-table">
              <thead>
                <tr>
                  <th>Data Registo</th>
                  <th>Nº Documento</th>
                  <th>ID Cliente</th>
                  <th>Nome / Empresa</th>
                  <th>Data Vencimento</th>
                  <th class="number-column">Valor Total (€) (C/IVA)</th>
                  <th class="number-column">Valor Total ILíquido (C/IVA)</th>
                  <th class="number-column">Valor em Falta (€) (C/IVA)</th>
                  <th>Estado</th>
                </tr>
              </thead>

              <tbody>
                <template v-for="row in clientReport.invoices" :key="row.id!">
                  <tr>
                    <td>
                      {{ row.registrationDate }}
                    </td>

                    <td>
                      {{ row.docNumber }}
                    </td>

                    <td>
                      {{ row.client?.code }}
                    </td>

                    <td>
                      {{ row.client?.companyName }}
                    </td>

                    <td>
                      {{ row.dueDate }}
                    </td>

                    <td class="number-column">
                      {{ formatNumber(row.totalValue) }}
                    </td>

                    <td class="number-column">
                      {{ formatCurrency(row.totalValueGross) }}
                    </td>

                    <td class="number-column">
                      {{ formatCurrency(row.amountDueWithTax) }}
                    </td>

                    <td :class="getInvoiceStatusClass(row.status)">
                      {{ invoiceStatus[row.status!].label }}
                    </td>
                  </tr>
                </template>
              </tbody>
            </table>
          </div>
        </section>
      </div>

      <Toast v-if="apiStatus.message" :message="apiStatus.message" :type="apiStatus.isSuccess ? 'success' : 'error'" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue';
import { ApiResponseStatus } from '@/types/api-response-status';
import Toast from '@/components/Toast.vue';
import { LayoutDashboard, ChevronRight } from 'lucide-vue-next';
import salesDashboardApi from '@/services/sales-dashboard-api';
import { formatCurrency, formatNumber } from '@/utils/validation.ts';
import { SalesClientReportType } from '@/types/sales-client-report-type';
import { ClientFilters, ClientSortField, ClientType } from '@/types/client-type';
import { SortDirection } from '@/types/sort-direction';
import clientApi from '@/services/client-api';
import { apiError } from '@/services/api';
import { getInvoiceStatusClass } from '@/utils/enums-css-class';
import { useConfigs } from '@/composables/useConfigs';
import SearchSelect from './SearchSelect.vue';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const invoiceStatus = useConfigs().invoiceStatusOptions.value;
const clients = ref<ClientType[]>([]);

const clientReport = ref<SalesClientReportType>({ invoices: [] });
const selectedClient = ref<ClientType | undefined>();

onMounted(async () => {
  await fetchClients();
  await loadSalesClientReport();
});

watch(selectedClient, async () => {
  await loadSalesClientReport();
});

async function loadSalesClientReport() {
  apiStatus.value = { isLoading: true, isSuccess: false, isError: false };

  if (!selectedClient.value) {
    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
    return;
  }

  try {
    clientReport.value = await salesDashboardApi.getSalesClientReport(selectedClient.value.id!);
    apiStatus.value = { isLoading: false, isSuccess: true, isError: false };
  } catch (error: unknown) {
    apiStatus.value = apiError(error, 'Failed to load client report.');
  }
}

async function fetchClients() {
  const clientFilters: ClientFilters = {
    sortBy: ClientSortField.CODE,
    sortDirection: SortDirection.ASC,
  };

  clients.value = await clientApi.searchClients(clientFilters);

  if (clients.value.length > 0) {
    selectedClient.value = clients.value[0];
  }
}

function clientFilter(client: ClientType): string {
  return `${client.code ?? ''} ${client.companyName ?? ''}`;
}
</script>

<style lang="scss">
.dashboard-card {
  border: 1px solid var(--color-border-light);
  border-radius: 10px;
  background: var(--color-background);
  padding: 16px;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.report-title {
  font-size: 20px;
  font-weight: 600;
  color: var(--color-primary);
}
</style>
