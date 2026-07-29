<template>
  <div class="main-section">
    <div class="section-header">
      <span><LayoutDashboard :size="24" /></span>
      <h3>Relatório Custos</h3>

      <div class="page-nav">
        <RouterLink to="/" class="link">Página Inicial</RouterLink>
        <ChevronRight :size="14" class="separator" />
        <RouterLink :to="{ path: '/', query: { tab: 'hr' } }" class="link"> Recursos Humanos </RouterLink>
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
        <div class="dashboard-grid">
          <!-- GLOBAL -->
          <section class="dashboard-card">
            <div class="card-header">
              <div>
                <h4>Totais Globais</h4>
              </div>
            </div>

            <HrDashboardTable
              :dashboard="totalDashboard"
              :collapsed-works="collapsedTotalWorks"
              @toggle-work="toggleWorkTotal"
              @expand-all="expandAllTotal"
              @collapse-all="collapseAllTotal"
            />
          </section>

          <!-- PERIOD -->
          <section class="dashboard-card">
            <div class="card-header">
              <div>
                <h4>Período (ano / mês)</h4>
              </div>
            </div>

            <HrDashboardTable
              :dashboard="periodDashboard"
              :collapsed-works="collapsedPeriodWorks"
              :show-filters="true"
              :selected-year="selectedYear"
              :selected-month="selectedMonth"
              :years="years"
              @update:selectedYear="
                selectedYear = $event;
                loadPeriod();
              "
              @update:selectedMonth="
                selectedMonth = $event;
                loadPeriod();
              "
              @toggle-work="toggleWorkPerid"
              @expand-all="expandAllPeriod"
              @collapse-all="collapseAllPeriod"
            />
          </section>
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
import { onMounted, ref } from 'vue';

import type { HrDashboardType } from '@/types/hr-dashboard-type';
import hrDashboardApi from '@/services/hr-dashboard-api';
import { ApiResponseStatus } from '@/types/api-response-status';
import Toast from '@/composables/Toast.vue';
import { LayoutDashboard, ChevronRight } from 'lucide-vue-next';
import { years } from '@/utils/date';
import HrDashboardTable from '@/composables/HrDashboardTable.vue';

const apiStatus = ref<ApiResponseStatus>({ isLoading: false, isSuccess: false, isError: false });

const totalDashboard = ref<HrDashboardType>({ dashboard: [] });
const periodDashboard = ref<HrDashboardType>({ dashboard: [] });

const collapsedTotalWorks = ref<Set<string>>(new Set());
const collapsedPeriodWorks = ref<Set<string>>(new Set());
const selectedYear = ref(new Date().getFullYear());
const selectedMonth = ref(new Date().getMonth() + 1);

onMounted(async () => {
  await loadTotals();
  await loadPeriod();
});

async function loadTotals() {
  totalDashboard.value = await hrDashboardApi.getHrDashboard();
  collapseAllTotal();
}

async function loadPeriod() {
  periodDashboard.value = await hrDashboardApi.getHrDashboard(selectedYear.value, selectedMonth.value);
  collapseAllPeriod();
}

function toggleWorkTotal(workId: string) {
  if (collapsedTotalWorks.value.has(workId)) {
    collapsedTotalWorks.value.delete(workId);
  } else {
    collapsedTotalWorks.value.add(workId);
  }

  collapsedTotalWorks.value = new Set(collapsedTotalWorks.value);
}

function toggleWorkPerid(workId: string) {
  if (collapsedPeriodWorks.value.has(workId)) {
    collapsedPeriodWorks.value.delete(workId);
  } else {
    collapsedPeriodWorks.value.add(workId);
  }

  collapsedPeriodWorks.value = new Set(collapsedPeriodWorks.value);
}

function collapseAllTotal() {
  collapsedTotalWorks.value = new Set([...(totalDashboard.value.dashboard ?? []).map((w) => w.workDto!.id!)]);
}

function collapseAllPeriod() {
  collapsedPeriodWorks.value = new Set([...(periodDashboard.value.dashboard ?? []).map((w) => w.workDto!.id!)]);
}

function expandAllTotal() {
  collapsedTotalWorks.value.clear();
}

function expandAllPeriod() {
  collapsedPeriodWorks.value.clear();
}
</script>

<style scoped lang="scss">
.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
}

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

.filters {
  display: flex;
  gap: 8px;
}
</style>
