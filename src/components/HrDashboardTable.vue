<template>
  <section>
    <div class="dashboard-table-actions">
      <div v-if="showFilters" class="dashboard-filters">
        <select
          :value="selectedYear"
          @change="$emit('update:selectedYear', Number(($event.target as HTMLSelectElement).value))"
        >
          <option v-for="year in years" :key="year" :value="year">
            {{ year }}
          </option>
        </select>

        <select
          :value="selectedMonth"
          @change="$emit('update:selectedMonth', Number(($event.target as HTMLSelectElement).value))"
        >
          <option v-for="month in months" :key="month.value" :value="month.value">
            {{ month.label }}
          </option>
        </select>
      </div>

      <div class="dashboard-actions">
        <button class="btn btn-secondary btn-sm" @click="$emit('expandAll')">
          <CopyPlus :size="15" />
          Expandir tudo
        </button>

        <button class="btn btn-secondary btn-sm" @click="$emit('collapseAll')">
          <CopyMinus :size="15" />
          Colapsar tudo
        </button>
      </div>
    </div>

    <table class="dashboard-table">
      <thead>
        <tr>
          <th>Obra / Colaborador</th>
          <th class="number-column">Horas</th>
          <th class="number-column">Custo</th>
        </tr>
      </thead>

      <tbody>
        <template v-for="row in dashboard.dashboard" :key="row.workDto?.id">
          <tr class="main-row" @click="$emit('toggleWork', row.workDto!.id!)">
            <td>
              <div class="main-cell">
                <component :is="isCollapsed(row.workDto!.id!) ? ChevronRight : ChevronDown" :size="18" />

                <div>
                  <div class="main-cell-text">
                    {{ row.workDto?.code }}
                  </div>

                  <div class="main-cell-subtext">
                    {{ row.workDto?.name }}
                  </div>
                </div>
              </div>
            </td>

            <td class="number-column">
              {{ formatNumber(row.totalHours) }}
            </td>

            <td class="number-column">
              {{ formatCurrency(row.totalCost) }}
            </td>
          </tr>

          <tr
            v-for="worker in row.workerDtoList"
            v-show="!isCollapsed(row.workDto!.id!)"
            :key="worker.workerDto.id"
            class="sub-row"
          >
            <td>
              <div class="sub-row-cell">
                {{ worker.workerDto.code }}
                <span>{{ worker.workerDto.name }}</span>
              </div>
            </td>

            <td class="number-column">
              {{ formatNumber(worker.totalHours) }}
            </td>

            <td class="number-column">
              {{ formatCurrency(worker.totalCost) }}
            </td>
          </tr>
        </template>
      </tbody>
    </table>
  </section>
</template>

<script setup lang="ts">
import { ChevronDown, ChevronRight, CopyMinus, CopyPlus } from 'lucide-vue-next';
import type { HrDashboardType } from '@/types/hr-dashboard-type';
import { formatCurrency, formatNumber } from '@/utils/validation';
import { months } from '@/utils/date';

const props = defineProps<{
  dashboard: HrDashboardType;
  collapsedWorks: Set<string>;
  showFilters?: boolean;
  selectedYear?: number;
  selectedMonth?: number;
  years?: number[];
}>();

defineEmits<{
  toggleWork: [id: string];
  expandAll: [];
  collapseAll: [];
  'update:selectedYear': [value: number];
  'update:selectedMonth': [value: number];
}>();

function isCollapsed(workId: string) {
  return props.collapsedWorks.has(workId);
}
</script>

<style scoped lang="scss"></style>
