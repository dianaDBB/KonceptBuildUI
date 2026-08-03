import { computed, ref } from 'vue';
import { SortDirection } from '@/types/sort-direction';

type SortableFilters = {
  sortBy?: string;
  sortDirection?: SortDirection;
};

export function useTableFilters<TFilters extends SortableFilters>(fetch: () => void | Promise<void>) {
  const filters = ref<TFilters>({} as TFilters);

  const hasActiveTableControls = computed(() =>
    Object.values(filters.value).some((value) => value !== undefined && value !== null && value !== ''),
  );

  function setSort(event: { column: TFilters['sortBy']; direction: SortDirection | undefined }) {
    filters.value = {
      ...filters.value,
      sortBy: event.direction ? event.column : undefined,
      sortDirection: event.direction,
    };

    void fetch();
  }

  function applyFilterValues(values: Record<string, unknown>) {
    filters.value = { ...filters.value, ...(values as Partial<TFilters>) };

    void fetch();
  }

  function clearFilterValues(values: Record<string, unknown>) {
    filters.value = {
      ...filters.value,
      ...(values as Partial<TFilters>),
    };

    void fetch();
  }

  function clearAllTableControls() {
    filters.value = {} as TFilters;

    void fetch();
  }

  return {
    filters,
    hasActiveTableControls,
    setSort,
    applyFilterValues,
    clearFilterValues,
    clearAllTableControls,
  };
}
