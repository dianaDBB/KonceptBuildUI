<template>
  <div ref="control" class="table-column-filter">
    <button
      class="sort-button"
      :class="{ active: isSorted }"
      :disabled="disabled"
      :title="sortButtonTitle"
      type="button"
      @click="$emit('sort')"
    >
      <ChevronDown v-if="sortDirection === 'ASC' && isSorted" :size="15" />
      <ChevronUp v-else-if="sortDirection === 'DESC' && isSorted" :size="15" />
      <ArrowUpDown v-else :size="15" />
    </button>

    <button
      class="filter-button"
      :class="{ active: isFilterActive }"
      :disabled="disabled"
      :title="`Filtrar ${config.label}`"
      type="button"
      @click="toggleDropdown"
    >
      <Funnel :size="15" />
    </button>

    <form
      v-if="isOpen"
      class="filter-dropdown"
      :class="`align-${config.dropdownAlign ?? 'end'}`"
      @submit.prevent="apply"
    >
      <div class="filter-dropdown-header">
        <strong>Filtrar por: {{ config.label }}</strong>
        <button type="button" class="close-button" aria-label="Fechar filtros" @click="close">
          <X :size="18" />
        </button>
      </div>

      <input
        v-if="config.kind === TableFilterKind.TEXT"
        v-model.trim="filterValues[config.valueKey!]"
        type="text"
        :placeholder="`Pesquisar por ${config.label.toLowerCase()}`"
      />

      <select v-else-if="config.kind === TableFilterKind.SELECT" v-model="filterValues[config.valueKey!]">
        <option value="">-</option>
        <option v-for="option in config.options" :key="option.value" :value="option.value">
          {{ option.label }}
        </option>
      </select>

      <div v-else class="range-fields">
        <input v-model.number="filterValues[config.minKey!]" type="number" min="0" step="0.01" placeholder="Mínimo" />
        <span>-</span>
        <input v-model.number="filterValues[config.maxKey!]" type="number" min="0" step="0.01" placeholder="Máximo" />
      </div>

      <div class="filter-actions">
        <button type="button" class="clear-button" @click="clear">Limpar</button>
        <button type="submit" class="apply-button">Aplicar</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';
import { ArrowUpDown, ChevronDown, ChevronUp, Funnel, X } from 'lucide-vue-next';
import { TableFilterKind, type TableColumnFilterConfig } from '@/types/table-filter';

type FilterValues = Record<string, unknown>;

const props = withDefaults(
  defineProps<{
    config: TableColumnFilterConfig;
    filters: object;
    sortBy?: string;
    sortDirection?: string;
    disabled?: boolean;
  }>(),
  { sortBy: undefined, sortDirection: undefined, disabled: false },
);

const emit = defineEmits<{
  apply: [values: FilterValues];
  clear: [values: FilterValues];
  sort: [];
}>();

const control = ref<HTMLElement | null>(null);
const isOpen = ref(false);
const filterValues = ref<FilterValues>({});

const currentFilters = computed(() => props.filters as FilterValues);
const filterKeys = computed(
  () => [props.config.valueKey, props.config.minKey, props.config.maxKey].filter(Boolean) as string[],
);
const isFilterActive = computed(() => filterKeys.value.some((key) => hasValue(currentFilters.value[key])));
const isSorted = computed(() => props.sortBy === props.config.column);
const sortButtonTitle = computed(() => {
  if (!isSorted.value) return 'Ordenar: ascendente';
  return props.sortDirection === 'ASC' ? 'Ordenar: descendente' : 'Remover ordenação';
});

function hasValue(value: unknown): boolean {
  return value !== undefined && value !== null && value !== '';
}

function toggleDropdown(): void {
  if (isOpen.value) {
    close();
    return;
  }

  filterValues.value = Object.fromEntries(filterKeys.value.map((key) => [key, currentFilters.value[key]]));
  isOpen.value = true;
}

function close(): void {
  isOpen.value = false;
}

function apply(): void {
  emit('apply', { ...filterValues.value });
  close();
}

function clear(): void {
  emit('clear', Object.fromEntries(filterKeys.value.map((key) => [key, undefined])));
  close();
}

function closeOnOutsideClick(event: MouseEvent): void {
  if (isOpen.value && !control.value?.contains(event.target as Node)) close();
}

onMounted(() => document.addEventListener('mousedown', closeOnOutsideClick));
onBeforeUnmount(() => document.removeEventListener('mousedown', closeOnOutsideClick));
</script>

<style scoped lang="scss">
.table-column-filter {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.1rem;
}

.sort-button,
.filter-button,
.close-button {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: 0;
  background: transparent;
  color: var(--color-text-muted);
  cursor: pointer;
}

.sort-button,
.filter-button {
  width: 27px;
  height: 27px;
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
}

.align-start {
  left: 0;
}

.align-end {
  right: 0;
}

.filter-dropdown-header,
.filter-actions {
  display: flex;
  align-items: center;
}

.filter-dropdown-header {
  justify-content: space-between;
  margin-bottom: 1rem;
}

.range-fields {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  align-items: center;
  gap: 0.5rem;
}

.filter-actions {
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
}

.apply-button {
  border: 1px solid var(--color-primary);
  background: var(--color-primary);
  color: white;
}
</style>
