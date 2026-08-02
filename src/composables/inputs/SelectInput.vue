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

<script setup lang="ts">
import type { SelectOption } from '@/types/select-options';

interface Props {
  value: string;
  isInvalid: boolean;
  isDisabled: boolean;
  selectOptions: SelectOption[];
}

defineProps<Props>();

const emit = defineEmits<{
  'update:value': [string];
}>();
</script>
