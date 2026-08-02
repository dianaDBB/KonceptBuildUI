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

interface Props {
  value: any[];
  searchSelectMultipleOptions: any[];
  searchSelectMultipleOptionKey: (option: any) => string;
  config: any;
  isInvalid: boolean;
  isDisabled: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:value': [unknown[]];
}>();
</script>
