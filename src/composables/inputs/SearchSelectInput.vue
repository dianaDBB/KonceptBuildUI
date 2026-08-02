<template>
  <SearchSelect
    :model-value="value"
    :options="searchSelectOptions"
    :filter="config.searchSelectConfig?.filter"
    :disabled="isDisabled"
    :is-valid="isInvalid"
    @update:model-value="emit('update:value', $event)"
  >
    <template #selected="{ option }">
      {{ config.searchSelectConfig?.selected(option) }}
    </template>

    <template #option="{ option }">
      <template v-for="line in config.searchSelectConfig?.optionLines(option)" :key="line"> {{ line }}<br /> </template>
    </template>
  </SearchSelect>
</template>

<script setup lang="ts">
import SearchSelect from '../SearchSelect.vue';

interface SearchSelectConfigLike {
  selected: (option: unknown) => string;
  optionLines: (option: unknown) => string[];
  filter?: (option: unknown) => string;
}

interface Props {
  value: unknown;
  searchSelectOptions: unknown[];
  config: {
    searchSelectConfig?: SearchSelectConfigLike;
  };
  isInvalid: boolean;
  isDisabled: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:value': [unknown];
}>();
</script>
