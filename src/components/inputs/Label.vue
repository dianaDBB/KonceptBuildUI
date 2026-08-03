<template>
  <span>{{ value }}</span>
</template>

<script setup lang="ts">
interface Props {
  value: string;
  isInvalid: boolean;
  isDisabled: boolean;
}

defineProps<Props>();
</script>
