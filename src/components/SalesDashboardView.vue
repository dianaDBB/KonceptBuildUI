<template>
  <div class="main-section">
    <div class="section-header">
      <span><LayoutDashboard :size="24" /></span>
      <h3>Dashboard de Vendas</h3>

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
        <div class="stats-grid">
          <div class="stat-card">
            <div class="stat-title">Total Faturado (C/IVA)</div>
            <div class="stat-value stat-style neutral">{{ formatCurrency(dashboard.totalBilled) }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Total Recebido (C/IVA)</div>
            <div class="stat-value stat-style positive">{{ formatCurrency(dashboard.totalReceived) }}</div>
          </div>
          <div class="stat-card">
            <div class="stat-title">Em Dívida (C/IVA)</div>
            <div class="stat-value stat-style warning">{{ formatCurrency(dashboard.totalDue) }}</div>
          </div>
        </div>
        <section class="dashboard-card">
          <div class="dashboard-table-wrapper">
            <table class="dashboard-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th class="number-column">Total Faturado (€)</th>
                  <th class="number-column">Total Recebido (€)</th>
                  <th class="number-column">Em Dívida (€)</th>
                  <th class="number-column">Em Atraso (€)</th>
                  <th class="number-column">Estado</th>
                </tr>
              </thead>

              <tbody>
                <template v-for="row in dashboard.clientsStatistics" :key="row.client?.id">
                  <tr>
                    <td>
                      <div>
                        <div>
                          <div class="main-cell-text">
                            {{ row.client?.code }}
                          </div>

                          <div class="main-cell-subtext">
                            {{ row.client?.companyName }}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td class="number-column">
                      {{ formatNumber(row.totalBilled) }}
                    </td>

                    <td class="number-column stat-style positive">
                      {{ formatCurrency(row.totalReceived) }}
                    </td>

                    <td class="number-column stat-style warning">
                      {{ formatCurrency(row.totalDue) }}
                    </td>

                    <td class="number-column stat-style negative">
                      {{ formatCurrency(row.totalOverdue) }}
                    </td>

                    <td class="number-column" :class="getInvoiceStatusClass(row.status)">
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
import { onMounted, ref } from 'vue';
import { ApiResponseStatus } from '@/types/api-response-status';
import Toast from '@/components/Toast.vue';
import { LayoutDashboard, ChevronRight } from 'lucide-vue-next';
import { SalesDashboardType } from '@/types/sales-dashboard-type';
import salesDashboardApi from '@/services/sales-dashboard-api';
import { formatCurrency, formatNumber } from '@/utils/validation.ts';
import { useConfigs } from '@/composables/useConfigs';
import { getInvoiceStatusClass } from '@/utils/enums-css-class';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const invoiceStatus = useConfigs().invoiceStatusOptions.value;

const dashboard = ref<SalesDashboardType>({ clientsStatistics: [] });

onMounted(async () => {
  await loadTotals();
});

async function loadTotals() {
  dashboard.value = await salesDashboardApi.getSalesDashboard();
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
</style>
