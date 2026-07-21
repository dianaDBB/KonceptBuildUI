<template>
  <input
    :value="formatNumber(value)"
    type="text"
    inputmode="decimal"
    :disabled="isDisabled"
    :class="{ required: isInvalid }"
    @input="handleMoneyInput($event, entity, fieldKey)"
  />
</template>

<script setup lang="ts" generic="TEntity, TColumn extends string">
import { handleMoneyInput } from '@/utils/handle-money-input';
import { formatNumber } from '@/utils/validation';

interface Props<T extends Record<string, T>> {
  entity: T;
  value: number;
  fieldKey: string;
  isInvalid: boolean;
  isDisabled: boolean;
}

const props = defineProps<Props<any>>();
</script>
