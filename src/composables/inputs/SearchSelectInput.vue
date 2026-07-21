<template>
  <SearchSelect
    :model-value="value"
    :options="options"
    :filter="config.searchSelect?.filter"
    :disabled="isDisabled"
    :is-valid="isInvalid"
    @update:model-value="emit('update:value', $event)"
  >
    <template #selected="{ option }">
      {{ config.searchSelect?.selected(option) }}
    </template>

    <template #option="{ option }">
      <template v-for="line in config.searchSelect?.optionLines(option)" :key="line"> {{ line }}<br /> </template>
    </template>
  </SearchSelect>
</template>

<script setup lang="ts">
import SearchSelect from '../SearchSelect.vue';

interface Props {
  value: any;
  options: any[];
  config: any;
  isInvalid: boolean;
  isDisabled: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:value': [unknown];
}>();
</script>
