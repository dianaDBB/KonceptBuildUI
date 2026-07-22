<template>
  <input
    :value="value"
    type="date"
    :disabled="isDisabled"
    :class="{ required: isInvalid }"
    @input="emit('update:value', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts" generic="TEntity, TSortField extends string">
interface Props {
  value: any;
  isInvalid: boolean;
  isDisabled: boolean;
}

const props = defineProps<Props>();

const emit = defineEmits<{
  'update:value': [string];
}>();
</script>
