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

function handleInput(event: Event) {
  const input = event.target as HTMLInputElement;
  const digits = input.value.replace(/\D/g, '');
  const numericValue = Number(digits) / 100;

  (props.entity as Record<string, number | null | undefined>)[props.fieldKey] = numericValue;
  input.value = formatNumber(numericValue);
}
</script>
