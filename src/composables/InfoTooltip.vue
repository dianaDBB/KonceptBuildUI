<template>
  <div ref="target" class="tooltip">
    <slot>
      <Info class="icon" :size="16" @click.stop="toggle" />
    </slot>

    <div v-if="open" class="content" :class="`content--${position}`">
      <h4 v-if="title">{{ title }}</h4>

      <div v-for="item in items" :key="item.label" class="row">
        <span class="label">{{ item.label }}</span>
        <span class="value">{{ item.value || '-' }}</span>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { Info } from 'lucide-vue-next';

export interface TooltipItem {
  label: string;
  value?: string | number | null;
}

withDefaults(
  defineProps<{
    title?: string;
    items: TooltipItem[];
    position?: 'left' | 'right';
  }>(),
  {
    title: '',
    position: 'right',
  },
);

const open = ref(false);
const target = ref<HTMLElement | null>(null);

function toggle() {
  open.value = !open.value;
}

onClickOutside(target, () => {
  open.value = false;
});
</script>

<style scoped>
.tooltip {
  position: relative;
  display: inline-flex;
}

.icon {
  cursor: pointer;
  color: var(--color-text-secondary);
}

.content {
  position: absolute;
  top: 24px;

  min-width: 280px;

  padding: 12px;

  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;

  box-shadow: var(--shadow-pop-small);

  z-index: 100;
}

.content--right {
  left: 0;
}

.content--left {
  right: 0;
}

h4 {
  margin: 0 0 10px;
}

.row {
  display: flex;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 6px;
}

.label {
  font-weight: 600;
  color: var(--color-text-secondary);
}

.value {
  text-align: right;
}
</style>
