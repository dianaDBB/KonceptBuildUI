<template>
  <div ref="target" class="search-select">
    <button type="button" class="select-button" :disabled="disabled" :class="{ required: isValid }" @click="toggle">
      <span class="selected-value">
        <template v-if="selected.length">
          <slot name="selected" :options="selected" />
        </template>
      </span>

      <ChevronDown class="chevron" :class="{ open }" :size="16" />
    </button>

    <Teleport to="body">
      <div v-if="open" ref="dropdown" class="dropdown" :style="dropdownStyle">
        <input
          ref="searchInput"
          v-model="search"
          class="search-input"
          type="text"
          placeholder="Search..."
          @click.stop
          @keydown.esc="open = false"
        />

        <label v-for="option in filteredOptions" :key="JSON.stringify(option)" class="option">
          <input type="checkbox" :checked="isSelected(option)" @change="toggleOption(option)" />

          <div class="option-content">
            <slot name="option" :option="option" />
          </div>
        </label>

        <div v-if="filteredOptions.length === 0" class="no-results">No results found</div>
      </div>
    </Teleport>
  </div>
</template>

<script setup lang="ts" generic="T">
import { computed, onMounted, onUnmounted, nextTick, ref, watch } from 'vue';
import { ChevronDown } from 'lucide-vue-next';

const props = withDefaults(
  defineProps<{
    modelValue?: T[];
    options: T[];
    optionKey?: (option: T) => string;
    filter?: (option: T) => string;
    disabled?: boolean;
    isValid?: boolean;
  }>(),
  {},
);

const emit = defineEmits<{
  (e: 'update:modelValue', value: T[]): void;
}>();

const dropdown = ref<HTMLElement>();
const open = ref(false);
const target = ref<HTMLElement>();
const searchInput = ref<HTMLInputElement>();

const dropdownStyle = ref({
  top: '0px',
  left: '0px',
  width: '0px',
});

const search = ref('');

const selected = computed(() => props.modelValue ?? []);

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

    updateDropdownPosition();

    searchInput.value?.focus();
  } else {
    search.value = '';
  }
});

const getKey = (option: T) => (props.optionKey ? props.optionKey(option) : option);

function isSelected(option: T) {
  return selected.value.some((o) => getKey(o) === getKey(option));
}

function toggleOption(option: T) {
  const values = [...selected.value];

  const index = values.findIndex((o) => getKey(o) === getKey(option));

  if (index >= 0) {
    values.splice(index, 1);
  } else {
    values.push(option);
  }

  emit('update:modelValue', values);
}

function handleClick(event: MouseEvent) {
  const element = event.target as Node;

  const clickedTarget = target.value?.contains(element);
  const clickedDropdown = dropdown.value?.contains(element);

  if (!clickedTarget && !clickedDropdown) {
    open.value = false;
  }
}

function toggle() {
  open.value = !open.value;
}

function updateDropdownPosition() {
  if (!target.value) {
    return;
  }

  const rect = target.value.getBoundingClientRect();

  dropdownStyle.value = {
    top: `${rect.bottom + window.scrollY + 4}px`,
    left: `${rect.left + window.scrollX}px`,
    width: `${rect.width}px`,
  };
}

function handleWindowChange() {
  if (open.value) {
    updateDropdownPosition();
  }
}

onMounted(() => {
  window.addEventListener('resize', handleWindowChange);
  window.addEventListener('scroll', handleWindowChange, true);
  document.addEventListener('mousedown', handleClick);
});

onUnmounted(() => {
  window.removeEventListener('resize', handleWindowChange);
  window.removeEventListener('scroll', handleWindowChange, true);
  document.removeEventListener('mousedown', handleClick);
});
</script>

<style>
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

  &:disabled {
    background: var(--color-background-disabled);
    color: var(--color-text-disabled);
    cursor: not-allowed;
  }
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

  max-height: 300px;
  overflow-y: auto;

  border: 1px solid var(--color-border);
  border-radius: 4px;

  background: var(--color-background);
  box-shadow: var(--shadow-pop-small);

  z-index: 99999;
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
  display: flex;
  align-items: center;
  gap: 4px;

  width: 100%;
  padding: 6px 8px;

  cursor: pointer;
  font-size: 12px;
}

.option:hover {
  background: var(--color-background-alt);
}

.option input[type='checkbox'] {
  margin: 0;
  width: 14px;
  height: 14px;
  flex-shrink: 0;

  accent-color: var(--color-primary-light);
}

.option-content {
  flex: 1;
  line-height: 1.35;
}

.option.selected {
  background: var(--color-primary-light);
}

.no-results {
  padding: 12px;

  text-align: center;
  color: var(--color-text-secondary);
  font-size: 12px;
}
</style>
