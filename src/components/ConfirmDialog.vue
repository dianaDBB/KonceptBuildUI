<template>
  <div v-if="modelValue" class="overlay" @click.self="cancel">
    <div class="dialog">
      <h2>{{ title }}</h2>

      <div v-for="item in message" :key="item" class="row">
        <p>{{ item }}</p>
      </div>

      <div class="actions">
        <button class="button" @click="cancel">
          {{ cancelText }}
        </button>

        <button class="button confirm" @click="confirm">
          {{ confirmText }}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Props {
  modelValue: boolean;
  title: string;
  message: string[];
  confirmText?: string;
  cancelText?: string;
}

withDefaults(defineProps<Props>(), {
  confirmText: 'Confirm',
  cancelText: 'Cancel',
});

const emit = defineEmits<{
  (e: 'update:modelValue', value: boolean): void;
  (e: 'confirm'): void;
}>();

function cancel() {
  emit('update:modelValue', false);
}

function confirm() {
  emit('confirm');
  emit('update:modelValue', false);
}
</script>

<style>
.overlay {
  position: fixed;
  inset: 0;
  background: var(--color-background-dilaog-muted);

  display: flex;
  justify-content: center;
  align-items: center;

  z-index: 999;
}

.confirm {
  background: var(--color-danger-bg);
  color: var(--color-danger);
  border: 1px solid var(--color-danger-border);
}
</style>
