<template>
  <div ref="control" class="table-column-filter">
    <button
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

    <form
      v-if="isOpen"
      class="filter-dropdown"
      :class="`align-${config.filter.dropdownAlign ?? 'end'}`"
      @submit.prevent="apply"
    >
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

      <input
        v-if="config.filter.kind === TableFilterKind.TEXT"
        v-model.trim="filterValues[config.filter.valueKey!]"
        type="text"
        :placeholder="`Pesquisar por ${config.label.toLowerCase()}`"
      />

      <select v-else-if="config.filter.kind === TableFilterKind.SELECT" v-model="filterValues[config.filter.valueKey!]">
        <option value="">-</option>

        <option v-for="option in config.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <div v-else class="range-fields">
        <input
          v-model.number="filterValues[config.filter.minKey!]"
          type="number"
          min="0"
          step="0.01"
          placeholder="Mínimo"
        />

        <span>-</span>

        <input
          v-model.number="filterValues[config.filter.maxKey!]"
          type="number"
          min="0"
          step="0.01"
          placeholder="Máximo"
        />
      </div>

      <div class="filter-actions">
        <button type="button" class="clear-button" @click="clear">Limpar</button>

        <button type="submit" class="apply-button">Aplicar</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts" generic="TColumn extends string, TEntity">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ArrowUpDown, ChevronDown, ChevronUp, Funnel, X, CircleX } from 'lucide-vue-next';

import { SortDirection } from '@/types/sort-direction';
import { EntityConfig } from '@/types/entity-configs';
import { TableFilterKind } from '@/types/table-filter';

type FilterValues = Record<string, unknown>;

const props = withDefaults(
  defineProps<{
    config: EntityConfig<TEntity, TColumn>;
    filters: object;
    sortBy?: TColumn;
    sortDirection?: SortDirection;
    disabled?: boolean;
  }>(),
  {
    sortBy: undefined,
    sortDirection: undefined,
    disabled: false,
  },
);

const emit = defineEmits<{
  apply: [values: FilterValues];
  clear: [values: FilterValues];
  sort: [
    {
      column: TColumn;
      direction: SortDirection | undefined;
    },
  ];
}>();

const control = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const filterValues = ref<FilterValues>({});

const currentFilters = computed(() => props.filters as FilterValues);

const filterKeys = computed(
  () =>
    [props.config.filter.valueKey, props.config.filter.minKey, props.config.filter.maxKey].filter(Boolean) as string[],
);

const isFilterActive = computed(() => filterKeys.value.some((key) => hasValue(currentFilters.value[key])));

const isSorted = computed(() => props.sortBy === props.config.filter.column);

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== '';
}

function toggleDropdown() {
  if (isOpen.value) {
    close();
    return;
  }

  filterValues.value = Object.fromEntries(filterKeys.value.map((key) => [key, currentFilters.value[key]]));

  isOpen.value = true;
}

function close() {
  isOpen.value = false;
}

function emitSort(direction: SortDirection | undefined) {
  emit('sort', {
    column: props.config.filter.column,
    direction,
  });

  close();
}

function apply() {
  emit('apply', { ...filterValues.value });
  close();
}

function clear() {
  emit('clear', Object.fromEntries(filterKeys.value.map((key) => [key, undefined])));

  close();
}

function closeOnOutsideClick(event: MouseEvent) {
  if (isOpen.value && !control.value?.contains(event.target as Node)) {
    close();
  }
}

onMounted(() => document.addEventListener('mousedown', closeOnOutsideClick));

onBeforeUnmount(() => document.removeEventListener('mousedown', closeOnOutsideClick));
</script>

<style scoped lang="scss">
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
  position: absolute;
  z-index: 20;
  top: calc(100% + 0.5rem);
  width: 280px;
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

.align-start {
  left: 0;
}

.align-end {
  right: 0;
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
</style>
