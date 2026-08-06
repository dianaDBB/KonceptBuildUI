<template>
  <div ref="target" class="tooltip">
    <slot>
      <Info ref="icon" class="icon" :size="16" @click.stop="toggle" />
    </slot>

    <Teleport to="body">
      <div v-if="open" class="content" :style="contentStyle">
        <h4 v-if="title">{{ title }}</h4>

        <template v-if="items">
          <div v-for="item in items" :key="item.label" class="row">
            <span class="label">{{ item.label }}</span>
            <span class="value">{{ item.value || '-' }}</span>
          </div>
        </template>

        <template v-if="info">
          <div v-for="item in info" :key="item" class="row">
            <span class="info">{{ item }}</span>
          </div>
        </template>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted, CSSProperties } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { Info } from 'lucide-vue-next';

export interface TooltipItem {
  label: string;
  value?: string | number | null;
}

const props = withDefaults(
  defineProps<{
    title?: string;
    items?: TooltipItem[];
    info?: string[];
    position?: 'left' | 'right';
  }>(),
  {
    title: '',
    position: 'right',
  },
);

const open = ref(false);
const target = ref<HTMLElement | null>(null);
const icon = ref<HTMLElement | null>(null);

const contentStyle = ref<CSSProperties>({
  top: '0px',
  left: '0px',
});

function toggle() {
  if (!icon.value) {
    return;
  }

  const rect = icon.value.getBoundingClientRect();

  contentStyle.value = {
    top: `${rect.bottom + 8}px`,
    left: `${rect.left}px`,
    transform: props.position === 'left' ? 'translateX(calc(-100% + 16px))' : 'none',
  };

  if (props.position === 'left') {
    contentStyle.value.transform = 'translateX(calc(-100% + 16px))';
  } else {
    contentStyle.value.transform = '';
  }

  open.value = !open.value;
}

onClickOutside(target, () => {
  open.value = false;
});

function close() {
  open.value = false;
}

onMounted(() => {
  window.addEventListener('scroll', close, true);
  window.addEventListener('resize', close);
});

onUnmounted(() => {
  window.removeEventListener('scroll', close, true);
  window.removeEventListener('resize', close);
});
</script>

<style>
.tooltip {
  position: relative;
  display: inline-flex;
}

.icon {
  cursor: pointer;
  color: var(--color-text-secondary);
}

.content {
  position: fixed;

  min-width: 280px;

  padding: 12px;

  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;

  box-shadow: var(--shadow-pop-small);

  z-index: 99999;
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
  font-size: 12px;
  color: var(--color-text-secondary);
}

.value {
  text-align: right;
  font-size: 12px;
}

.info {
  text-align: left;
  font-size: 12px;
  color: var(--color-text-secondary);
}
</style>
