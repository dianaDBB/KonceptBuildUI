<template>
  <tbody ref="tableBody">
    <tr
      v-for="row in rows"
      :key="row._key"
      :class="{ disabled: !isRowActive(row) }"
      @dblclick="!isEditing && $emit('row-edit', row)"
    >
      <td
        v-for="(config, fieldKey) in configs"
        :key="fieldKey"
        :style="config.styleConfig.columnStyle"
        :class="getColumnClasses(fieldKey)"
      >
        <template v-if="rowHasChanges(row)">
          <slot :name="`edit-${fieldKey}`" :row="row" :config="config" :field-key="fieldKey">
            <component
              :is="getEditableComponent(config.type)"
              :value="getFieldValue(row, fieldKey)"
              :entity="row.entity"
              :field-key="fieldKey"
              :secondary-value="
                config.phoneConfig?.secondaryField ? getFieldValue(row, String(config.phoneConfig.secondaryField)) : ''
              "
              :config="config"
              :select-options="config.selectConfig?.options"
              :search-select-options="config.searchSelectConfig?.options"
              :search-select-multiple-options="config.searchSelectMultipleConfig?.options"
              :search-select-multiple-option-key="config.searchSelectMultipleConfig?.optionKey"
              :is-invalid="config.styleConfig.isInvalid(row.entity)"
              :is-disabled="config.styleConfig.showDisabled(row.entity, row)"
              @update:value="updateFieldValue(row, fieldKey, $event)"
              @update:secondary-value="
                config.phoneConfig?.secondaryField
                  ? updateFieldValue(row, String(config.phoneConfig.secondaryField), $event)
                  : undefined
              "
            />
          </slot>
        </template>

        <template v-else>
          <slot :name="`display-${fieldKey}`" :row="row" :config="config" :field-key="fieldKey">
            <template v-if="config.type === ColumnType.SEARCH_SELECT">
              <div class="with-info-tooltip">
                <span>{{ getFormatedValue(row, fieldKey, config) }}</span>

                <InfoTooltip
                  v-if="getFieldValue(row, fieldKey)"
                  position="left"
                  :title="config.searchSelectConfig?.tooltipTitle?.(getFieldValue(row, fieldKey) as TEntity)"
                  :items="config.searchSelectConfig?.tooltipItems?.(getFieldValue(row, fieldKey) as TEntity)"
                />
              </div>
            </template>

            <template v-else>
              {{ getFormatedValue(row, fieldKey, config) }}
            </template>
          </slot>
        </template>
      </td>

      <td class="actions-column">
        <div v-if="!rowHasChanges(row)" class="action-buttons">
          <slot name="row-actions" :row="row">
            <button title="Eliminar" :disabled="isEditing" @click="$emit('row-delete', row)">
              <Trash2 :size="16" />
            </button>

            <button title="Editar" :disabled="isEditing" @click="$emit('row-edit', row)">
              <Pencil :size="16" />
            </button>
          </slot>
        </div>

        <div v-else class="action-buttons editing">
          <button @click="$emit('row-discard', row)">
            <Undo2 :size="16" />
          </button>

          <button :disabled="!isRowValid(row.entity)" @click="$emit('row-save', row)">
            <Check :size="16" />
          </button>
        </div>
      </td>
    </tr>
  </tbody>
</template>

<script setup lang="ts" generic="TSortField extends string, TEntity extends EntityType = EntityType">
import { Trash2, Pencil, Undo2, Check } from 'lucide-vue-next';
import type { Component } from 'vue';
import { ColumnType, EntityConfig, EntityType, TableRow } from '@/types/entity-configs';
import TextInput from './inputs/TextInput.vue';
import { formatCurrency, formatNumber, formatPercentage } from '@/utils/validation.ts';
import InfoTooltip from './InfoTooltip.vue';
import NumberInput from './inputs/NumberInput.vue';
import MoneyInput from './inputs/MoneyInput.vue';
import DateInput from './inputs/DateInput.vue';
import EmailInput from './inputs/EmailInput.vue';
import PercentageInput from './inputs/PercentageInput.vue';
import PhoneInput from './inputs/PhoneInput.vue';
import SelectInput from './inputs/SelectInput.vue';
import SearchSelectInput from './inputs/SearchSelectInput.vue';
import SearchSelectMultipleInput from './inputs/SearchSelectMultipleInput.vue';

interface Props {
  rows: TableRow<TEntity>[];
  configs: Record<string, EntityConfig<TSortField>>;
  rowIsActive: (row: TableRow<TEntity>) => boolean;
  isValid: (entity: TEntity) => boolean;
  isEditing?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isEditing: false,
});

defineEmits<{
  'row-edit': [row: TableRow<TEntity>];
  'row-delete': [row: TableRow<TEntity>];
  'row-save': [row: TableRow<TEntity>];
  'row-discard': [row: TableRow<TEntity>];
}>();

const editableComponentMap: Record<ColumnType, Component | undefined> = {
  [ColumnType.TEXT]: TextInput,
  [ColumnType.NUMBER]: NumberInput,
  [ColumnType.MONEY]: MoneyInput,
  [ColumnType.DATE]: DateInput,
  [ColumnType.SELECT]: SelectInput,
  [ColumnType.SEARCH_SELECT]: SearchSelectInput,
  [ColumnType.SEARCH_SELECT_MULTIPLE]: SearchSelectMultipleInput,
  [ColumnType.EMAIL]: EmailInput,
  [ColumnType.PHONE]: PhoneInput,
  [ColumnType.PERCENTAGE]: PercentageInput,
};

function getEditableComponent(type: ColumnType): Component | undefined {
  return editableComponentMap[type];
}

function rowHasChanges(row: TableRow<TEntity>): boolean {
  return row._isNew || row._isEdited;
}

function isRowValid(entity: TEntity): boolean {
  return props.isValid(entity);
}

function isRowActive(row: TableRow<TEntity>): boolean {
  return props.rowIsActive(row);
}

function getColumnClasses(fieldKey: string): Record<string, boolean> {
  return {
    highlight: props.configs[fieldKey].styleConfig.isHighlight ?? false,
  };
}

function getFieldValue(row: TableRow<TEntity>, fieldKey: string | number | symbol): unknown {
  const path = String(fieldKey);

  return path.split('.').reduce<unknown>((obj, key) => {
    if (typeof obj === 'object' && obj !== null && key in obj) {
      return (obj as Record<string, unknown>)[key];
    }

    return undefined;
  }, row.entity as Record<string, unknown>);
}

function toDisplayString(value: unknown): string {
  return value == null ? '' : String(value);
}

function getFormatedValue(row: TableRow<TEntity>, fieldKey: string, config: EntityConfig<TSortField>): string {
  const value = getFieldValue(row, fieldKey);

  switch (config.type) {
    case ColumnType.NUMBER:
    case ColumnType.MONEY:
    case ColumnType.PERCENTAGE: {
      const numericValue = typeof value === 'number' ? value : Number(value);

      if (Number.isNaN(numericValue)) {
        return '';
      }

      if (config.type === ColumnType.NUMBER) {
        return formatNumber(numericValue);
      }

      if (config.type === ColumnType.MONEY) {
        return formatCurrency(numericValue);
      }

      return formatPercentage(numericValue);
    }
    case ColumnType.SELECT: {
      const selectedValue = typeof value === 'string' || typeof value === 'number' ? value : undefined;

      return config.selectConfig?.options?.find((opt) => opt.code === selectedValue)?.label ?? toDisplayString(value);
    }
    case ColumnType.SEARCH_SELECT: {
      const selectedEntity = value as TEntity | undefined;

      return selectedEntity ? config.searchSelectConfig?.selected(selectedEntity) ?? '' : '';
    }
    case ColumnType.SEARCH_SELECT_MULTIPLE: {
      const selectedEntities = value as TEntity[] | undefined;

      return selectedEntities ? config.searchSelectMultipleConfig?.selected(selectedEntities) ?? '' : '';
    }
    case ColumnType.DATE: {
      const dateValue = value instanceof Date ? value : value ? new Date(value as string | number | Date) : null;

      return dateValue && !Number.isNaN(dateValue.getTime()) ? dateValue.toLocaleDateString() : '-';
    }
    case ColumnType.PHONE: {
      const secondaryField = config.phoneConfig?.secondaryField;
      const secondaryValue = secondaryField ? getFieldValue(row, secondaryField) : undefined;
      const primaryValue = getFieldValue(row, fieldKey);

      return `${toDisplayString(secondaryValue)} ${toDisplayString(primaryValue)}`.trim();
    }
    default:
      return toDisplayString(value);
  }
}

function updateFieldValue(row: TableRow<TEntity>, fieldKey: string, value: unknown) {
  const keys = fieldKey.split('.');
  const lastKey = keys.pop()!;

  const target = keys.reduce<Record<string, unknown> | null>((obj, key) => {
    if (obj && typeof obj === 'object' && key in obj) {
      return obj[key] as Record<string, unknown>;
    }

    return null;
  }, row.entity as Record<string, unknown>);

  if (target && typeof target === 'object') {
    (target as Record<string, unknown>)[lastKey] = value;
  }

  row._isEdited = true;

  props.configs[fieldKey]?.onValueChanged?.(row, value);
}
</script>

<style scoped></style>
