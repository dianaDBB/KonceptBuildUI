<template>
  <div ref="target" class="search-select">
    <button type="button" class="select-button" :disabled="disabled" :class="{ required: isValid }" @click="toggle">
      <span class="selected-value">
        <template v-if="selected">
          <slot name="selected" :option="selected" />
        </template>
      </span>

      <ChevronDown class="chevron" :class="{ open }" :size="16" />
    </button>

    <div v-if="open" class="dropdown">
      <input
        ref="searchInput"
        v-model="search"
        class="search-input"
        type="text"
        placeholder="Search..."
        @click.stop
        @keydown.esc="open = false"
      />

      <button
        v-for="option in filteredOptions"
        :key="JSON.stringify(option)"
        type="button"
        class="option"
        @click="select(option)"
      >
        <slot name="option" :option="option" />
      </button>

      <div v-if="filteredOptions.length === 0" class="no-results">No results found</div>
    </div>
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, nextTick, ref, watch } from 'vue';
import { onClickOutside } from '@vueuse/core';
import { ChevronDown } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    modelValue?: T;
    options: T[];
    filter?: (option: T) => string;
    disabled?: boolean;
    isValid?: boolean;
  }>(),
  {},
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: T): void;
}>();

const open = ref(false);
const target = ref<HTMLElement>();
const searchInput = ref<HTMLInputElement>();

const search = ref('');

const selected = computed(() => props.modelValue);

const filteredOptions = computed(() => {
  if (!search.value.trim()) {
    return props.options;
  }

  const term = search.value.toLowerCase();

  return props.options.filter((option) => {
    if (props.filter) {
      return props.filter(option).toLowerCase().includes(term);
    }

    return JSON.stringify(option).toLowerCase().includes(term);
  });
});

watch(open, async (isOpen) => {
  if (isOpen) {
    await nextTick();
    searchInput.value?.focus();
  } else {
    search.value = '';
  }
});

onClickOutside(target, () => {
  open.value = false;
});

function select(option: T) {
  emit('update:modelValue', option);
  search.value = '';
  open.value = false;
}

function toggle() {
  open.value = !open.value;
}
</script>

<style scoped>
.search-select {
  position: relative;
  width: 100%;
}

.select-button {
  width: 100%;
  min-height: 34px;

  display: flex;
  align-items: center;

  padding: 6px 10px;

  border: 1px solid var(--color-border);
  border-radius: 4px;

  background: var(--color-background);

  color: var(--color-text);
  font-size: 12px;
  text-align: left;

  cursor: pointer;
  transition: 0.2s;
}

.selected-value {
  flex: 1;
  min-width: 0;

  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
}

.chevron {
  margin-left: auto;
  flex-shrink: 0;

  color: var(--color-text-secondary);
  transition: transform 0.2s ease;
}

.chevron.open {
  transform: rotate(180deg);
}

.dropdown {
  position: absolute;
  left: 0;
  right: 0;

  margin-top: 4px;

  max-height: 300px;
  overflow-y: auto;

  border: 1px solid var(--color-border);
  border-radius: 4px;

  background: var(--color-background);
  box-shadow: var(--shadow-pop-small);

  z-index: 100;
}

.search-input {
  width: 100%;
  box-sizing: border-box;

  padding: 8px 10px;

  border: none;
  border-bottom: 1px solid var(--color-border);

  background: var(--color-background);

  color: var(--color-text);
  font-size: 12px;

  outline: none;
}

.option {
  width: 100%;

  padding: 8px 10px;

  border: none;
  background: transparent;

  text-align: left;
  font-size: 12px;

  cursor: pointer;
}

.option:hover {
  background: var(--color-background-alt);
}

.no-results {
  padding: 12px;

  text-align: center;
  color: var(--color-text-secondary);
  font-size: 12px;
}
</style>
