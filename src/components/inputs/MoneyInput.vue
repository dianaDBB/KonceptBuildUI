<template>
  <input
    :value="formatNumber(value)"
    type="text"
    inputmode="decimal"
    :disabled="isDisabled"
    :class="{ required: isInvalid }"
    @input="handleInput($event)"
  />
</template>

<script setup lang="ts">
import { formatNumber } from '@/utils/validation';

interface Props {
  entity: Record<string, unknown>;
  value: number | null | undefined;
  fieldKey: string;
  isInvalid: boolean;
  isDisabled: boolean;
}

const props = defineProps<Props>();
const emit = defineEmits<{ 'update:value': [value: number] }>();

function handleInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const digits = input.value.replace(/\D/g, '');
  const numericValue = Number(digits) / 100;

  emit('update:value', numericValue);
  input.value = formatNumber(numericValue);
}
</script>
