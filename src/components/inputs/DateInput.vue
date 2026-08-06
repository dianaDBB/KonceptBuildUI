<template>
  <input
    :value="value"
    type="date"
    :disabled="isDisabled"
    :class="{ required: isInvalid }"
    @input="emit('update:value', ($event.target as HTMLInputElement).value)"
  />
</template>

<script setup lang="ts">
interface Props {
  value: string | undefined;
  isInvalid: boolean;
  isDisabled: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:value': [string];
}>();
</script>
