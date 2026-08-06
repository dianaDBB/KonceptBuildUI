<template>
  <Transition name="toast">
    <div v-if="visible" :class="['toast', `toast-${type}`]">
      <div class="toast-content">
        <CheckCircle2 v-if="type === 'success'" :size="20" />
        <CircleAlert v-else-if="type === 'error'" :size="20" />

        <span>{{ message }}</span>
      </div>

      <button class="toast-close" @click="close">
        <X :size="18" />
      </button>
    </div>
  </Transition>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import { CheckCircle2, CircleAlert, X } from 'lucide-vue-next';

const props = defineProps<{
  message: string;
  type: 'success' | 'error';
}>();

const visible = ref(false);

let timer: number;

watch(
  () => props.message,
  (message) => {
    if (!message) return;

    visible.value = true;

    clearTimeout(timer);

    timer = window.setTimeout(() => {
      visible.value = false;
    }, 5000);
  },
  { immediate: true },
);

function close() {
  visible.value = false;
}
</script>

<style lang="scss">
.toast {
  position: fixed;
  top: 24px;
  right: 24px;

  min-width: 320px;
  max-width: 420px;

  display: flex;
  justify-content: space-between;
  align-items: center;

  padding: 14px 18px;

  border-radius: 10px;

  box-shadow: var(--shadow-pop);

  z-index: 9999;
}

.toast-success {
  background: var(--color-success-bg);
  border: 1px solid var(--color-success-border);
  color: var(--color-success);
}

.toast-error {
  background: var(--color-danger-bg);
  border: 1px solid var(--color-danger-border);
  color: var(--color-danger);
}

.toast-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.toast-close {
  border: none;
  background: transparent;
  cursor: pointer;
  color: inherit;
}

.toast-enter-active,
.toast-leave-active {
  transition: all 0.25s ease;
}

.toast-enter-from,
.toast-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}
</style>
