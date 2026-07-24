<template>
  <select
    :value="value"
    :disabled="isDisabled"
    :class="{ required: isInvalid }"
    @input="emit('update:value', ($event.target as HTMLInputElement).value)"
  >
    <option v-for="option in selectOptions" :key="option.code" :value="option.code">
      {{ option.label }}
    </option>
  </select>
</template>

<script setup lang="ts" generic="TEntity, TSortField extends string">
import { SelectOption } from '@/types/select-options';

interface Props {
  value: any;
  isInvalid: boolean;
  isDisabled: boolean;
  selectOptions: SelectOption[];
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:value': [string];
}>();
</script>
