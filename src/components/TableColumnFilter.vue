<template>
  <div ref="control" class="table-column-filter">
    <button
      v-if="config.filterConfig"
      ref="button"
      class="column-button"
      :class="{ active: isSorted || isFilterActive }"
      :disabled="disabled"
      :title="`Ordenar / Filtrar ${config.label}`"
      type="button"
      @click="toggleDropdown"
    >
      <Funnel v-if="isSorted || isFilterActive" :size="12" />
      <ArrowUpDown v-else :size="12" />
    </button>

    <Teleport to="body">
      <form v-if="isOpen" ref="dropdown" class="filter-dropdown" :style="dropdownStyle" @submit.prevent="apply">
        <div class="filter-dropdown-header">
          <strong>{{ config.label }}</strong>

          <button type="button" class="close-button" aria-label="Fechar" @click="close">
            <X :size="18" />
          </button>
        </div>

        <div class="sort-actions">
          <button type="button" class="menu-button" @click="emitSort(SortDirection.ASC)">
            <ChevronDown :size="14" :class="{ active: isSorted && sortDirection === SortDirection.ASC }" />
            Crescente
          </button>

          <button type="button" class="menu-button" @click="emitSort(SortDirection.DESC)">
            <ChevronUp :size="14" :class="{ active: isSorted && sortDirection === SortDirection.DESC }" />
            Decrescente
          </button>

          <button v-if="isSorted" type="button" class="menu-button" @click="emitSort(undefined)">
            <CircleX :size="14" />
            Remover ordenação
          </button>
        </div>

        <hr />

        <template v-if="config.filterConfig">
          <input
            v-if="config.filterConfig.kind === TableFilterKind.TEXT"
            v-model.trim="filterValues[(config.filterConfig.valueConfig as SingleFilterConfig).valueKey!]"
            type="text"
            :placeholder="`Pesquisar por ${config.label.toLowerCase()}`"
          />

          <select
            v-else-if="config.filterConfig.kind === TableFilterKind.SELECT"
            v-model="filterValues[(config.filterConfig.valueConfig as SingleFilterConfig).valueKey!]"
          >
            <option value="">-</option>

            <option v-for="option in config.selectConfig!.options" :key="option.code" :value="option.code">
              {{ option.label }}
            </option>
          </select>

          <div v-else class="range-fields">
            <input v-model="rangeFilter.min" :type="rangeInputType" :step="rangeStep" placeholder="Mínimo" />

            <span>-</span>

            <input v-model="rangeFilter.max" :type="rangeInputType" :step="rangeStep" placeholder="Máximo" />
          </div>

          <div v-if="config.filterConfig.info" class="info">
            {{ config.filterConfig.info }}
          </div>
        </template>

        <div class="filter-actions">
          <button type="button" class="clear-button" @click="clear">Limpar</button>

          <button type="submit" class="apply-button">Aplicar</button>
        </div>
      </form>
    </Teleport>
  </div>
</template>

<script setup lang="ts" generic="TSortField extends string, TEntity extends EntityType = EntityType">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import type { CSSProperties } from 'vue';
import { ArrowUpDown, ChevronDown, ChevronUp, Funnel, X, CircleX } from 'lucide-vue-next';

import { SortDirection } from '@/types/sort-direction';
import {
  EntityConfig,
  EntityType,
  RangeFilter,
  RangeFilterConfig,
  RangeFilterValueType,
  SingleFilterConfig,
} from '@/types/entity-configs';
import { TableFilterKind } from '@/types/table-filter';

type FilterValues = Record<string, unknown>;

const props = withDefaults(
  defineProps<{
    config: EntityConfig<TSortField, TEntity>;
    filters: object;
    sortBy?: TSortField;
    sortDirection?: SortDirection;
    disabled?: boolean;
  }>(),
  {
    sortBy: undefined,
    sortDirection: undefined,
    disabled: false,
  },
);

const filterConfig = computed(() => props.config.filterConfig);

const emit = defineEmits<{
  apply: [values: FilterValues];
  clear: [values: FilterValues];
  sort: [
    {
      column: TSortField;
      direction: SortDirection | undefined;
    },
  ];
}>();

const control = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const filterValues = ref<FilterValues>({});
const button = ref<HTMLElement | null>(null);
const dropdown = ref<HTMLElement | null>(null);

const currentFilters = computed(() => props.filters as FilterValues);

const filterKeys = computed(() => {
  if (!filterConfig.value) {
    return [];
  }

  return [(filterConfig.value.valueConfig as SingleFilterConfig).valueKey];
});

const rangeConfig = computed(() => filterConfig.value?.valueConfig as RangeFilterConfig | undefined);

const rangeInputType = computed(() => (rangeConfig.value?.valueType === RangeFilterValueType.DATE ? 'date' : 'number'));

const rangeStep = computed(() => (rangeConfig.value?.valueType === RangeFilterValueType.DATE ? undefined : '0.01'));

const isFilterActive = computed(() => filterKeys.value.some((key) => hasValue(currentFilters.value[key])));

const isSorted = computed(() => filterConfig.value && props.sortBy === filterConfig.value.column);

const rangeFilter = computed<RangeFilter>(() => {
  const key = (filterConfig.value!.valueConfig as RangeFilterConfig).valueKey;

  let value = filterValues.value[key] as RangeFilter | undefined;

  if (!value) {
    value = {
      min: undefined,
      max: undefined,
    };

    filterValues.value[key] = value;
  }

  return value;
});

const dropdownStyle = ref<CSSProperties>({
  top: '0px',
  left: '0px',
});

function hasValue(value: unknown): boolean {
  if (value && typeof value === 'object' && 'min' in (value as object) && 'max' in (value as object)) {
    const range = value as RangeFilter;

    return range.min != null || range.max != null;
  }

  return value !== undefined && value !== null && value !== '';
}

function toggleDropdown() {
  if (isOpen.value) {
    close();
    return;
  }

  filterValues.value = Object.fromEntries(
    filterKeys.value.map((key) => [
      key,
      currentFilters.value[key] ? { ...(currentFilters.value[key] as object) } : undefined,
    ]),
  );

  const valueConfig = filterConfig.value?.valueConfig;

  if (valueConfig && 'valueType' in valueConfig) {
    const key = valueConfig.valueKey;

    filterValues.value[key] ??= {
      min: undefined,
      max: undefined,
    };
  }

  if (button.value) {
    const rect = button.value.getBoundingClientRect();

    dropdownStyle.value = {
      position: 'fixed',
      top: `${rect.bottom + 8}px`,
      left: filterConfig.value?.dropdownAlign === 'start' ? `${rect.left}px` : `${rect.right - 300}px`,
      zIndex: '99999',
    };
  }

  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

onMounted(() => {
  document.addEventListener('click', closeOnOutsideClick);
  window.addEventListener('scroll', close, true);
  window.addEventListener('resize', close);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', closeOnOutsideClick);
  window.removeEventListener('scroll', close, true);
  window.removeEventListener('resize', close);
});

function emitSort(direction: SortDirection | undefined) {
  emit('sort', {
    column: filterConfig.value!.column,
    direction,
  });

  close();
}

function apply() {
  emit('apply', { ...filterValues.value });
  close();
}

function clear() {
  const values: FilterValues = {};

  for (const key of filterKeys.value) {
    if (
      filterConfig.value?.kind === TableFilterKind.NUMBER_RANGE ||
      filterConfig.value?.kind === TableFilterKind.DATE_RANGE
    ) {
      values[key] = {
        min: undefined,
        max: undefined,
      };
    } else {
      values[key] = undefined;
    }
  }

  emit('clear', values);
}

function closeOnOutsideClick(event: MouseEvent) {
  const target = event.target as Node;

  if (isOpen.value && !control.value?.contains(target) && !dropdown.value?.contains(target)) {
    close();
  }
}
</script>

<style lang="scss">
.table-column-filter {
  position: relative;
  display: inline-flex;
  align-items: center;
}

.column-button,
.close-button,
.menu-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: var(--color-text-muted);
}

.column-button,
.close-button {
  cursor: pointer;
}

.column-button {
  width: 20px;
  height: 20px;
  border-radius: 6px;

  &:hover:not(:disabled),
  &.active {
    background: var(--color-primary-light);
    color: var(--color-primary);
  }
}

.filter-dropdown {
  width: 300px;
  padding: 1rem;

  border: 1px solid var(--color-border-light);
  border-radius: 10px;

  background: var(--color-background);
  box-shadow: var(--shadow-hover);

  input,
  select {
    width: 100%;
  }

  hr {
    margin: 0.75rem 0;
    border: 0;
    border-top: 1px solid var(--color-border-light);
  }
}

.filter-dropdown-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 0.75rem;
}

.sort-actions {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.menu-button {
  justify-content: flex-start;
  gap: 0.5rem;
  width: 100%;
  padding: 0.45rem 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.9rem;

  &:hover {
    background: var(--color-primary-light);
    color: var(--color-primary);
  }
}

.active {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.range-fields {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.5rem;
}

.filter-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 1rem;

  button {
    padding: 0.45rem 0.75rem;
    border-radius: 6px;
    cursor: pointer;
  }
}

.clear-button {
  border: 0;
  background: transparent;
  color: var(--color-text-muted);

  &:hover {
    color: var(--color-primary);
  }
}

.apply-button {
  border: 1px solid var(--color-primary);
  background: var(--color-primary);
  color: white;

  &:hover {
    opacity: 0.9;
  }
}

.info {
  color: var(--color-text-secondary);
  font-size: 10px;

  padding: 0.45rem 0.5rem;
}
</style>
