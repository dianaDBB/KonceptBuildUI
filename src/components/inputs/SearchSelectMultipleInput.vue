<template>
  <SearchSelectMultiple
    :model-value="value"
    :options="searchSelectMultipleOptions"
    :option-key="searchSelectMultipleOptionKey"
    :filter="config.searchSelectMultipleConfig?.filter"
    :disabled="isDisabled"
    :is-valid="isInvalid"
    @update:model-value="emit('update:value', $event)"
  >
    <template #selected="{ options }">
      {{ config.searchSelectMultipleConfig?.selected(options) }}
    </template>

    <template #option="{ option }">
      <template v-for="line in config.searchSelectMultipleConfig?.optionLines(option)" :key="line">
        {{ line }}<br />
      </template>
    </template>
  </SearchSelectMultiple>
</template>

<script setup lang="ts">
import SearchSelectMultiple from '../SearchSelectMultiple.vue';

interface SearchSelectConfigLike {
  selected: (options: unknown[]) => string;
  optionLines: (option: unknown) => string[];
  filter?: (option: unknown) => string;
}

interface Props {
  value: unknown[];
  searchSelectMultipleOptions: unknown[];
  searchSelectMultipleOptionKey: (option: unknown) => string;
  config: {
    searchSelectMultipleConfig?: SearchSelectConfigLike;
  };
  isInvalid: boolean;
  isDisabled: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:value': [unknown[]];
}>();
</script>
