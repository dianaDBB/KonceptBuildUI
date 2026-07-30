<template>
  <tbody ref="tableBody">
    <tr v-for="row in rows" :key="row._key" :class="{ disabled: !isRowActive(row) }" @dblclick="$emit('row-edit', row)">
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
              :config="config"
              :select-options="config.selectConfig?.options"
              :search-select-options="props.searchSelectOptions"
              :is-invalid="config.styleConfig.isInvalid(row.entity)"
              :is-disabled="config.styleConfig.showDisabled(row.entity, row)"
              @update:value="updateFieldValue(row, fieldKey, $event)"
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
                  :title="config.searchSelectConfig!.tooltipTitle!(getFieldValue(row, fieldKey))"
                  :items="config.searchSelectConfig!.tooltipItems!(getFieldValue(row, fieldKey))"
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

interface Props<TEntity extends EntityType = EntityType> {
  rows: TableRow<TEntity>[];
  configs: Record<string, EntityConfig<TSortField, TEntity>>;
  rowIsActive: (row: TableRow<TEntity>) => boolean;
  isValid: (entity: TEntity) => boolean;
  isEditing?: boolean;
  searchSelectOptions?: any[];
}

const props = withDefaults(defineProps<Props<TEntity>>(), {
  isEditing: false,
});

const emit = defineEmits<{
  'row-edit': [row: TableRow<TEntity>];
  'row-delete': [row: TableRow<TEntity>];
  'row-save': [row: TableRow<TEntity>];
  'row-discard': [row: TableRow<TEntity>];
}>();

const editableComponentMap: Record<ColumnType, any> = {
  [ColumnType.TEXT]: TextInput,
  [ColumnType.NUMBER]: NumberInput,
  [ColumnType.MONEY]: MoneyInput,
  [ColumnType.DATE]: DateInput,
  [ColumnType.SELECT]: SelectInput,
  [ColumnType.SEARCH_SELECT]: SearchSelectInput,
  [ColumnType.EMAIL]: EmailInput,
  [ColumnType.PHONE]: PhoneInput,
  [ColumnType.PERCENTAGE]: PercentageInput,
};

function getEditableComponent(type: ColumnType) {
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

function getColumnClasses(fieldKey: string): any {
  return {
    highlight: props.configs[fieldKey].styleConfig.isHighlight,
  };
}

function getFieldValue(row: TableRow<TEntity>, fieldKey: string): any {
  return fieldKey
    .split('.')
    .reduce((obj, key) => (obj as Record<string, any>)?.[key], row.entity as Record<string, any>);
}

function getFormatedValue(row: TableRow<TEntity>, fieldKey: string, config: EntityConfig<TSortField, TEntity>): string {
  const value = getFieldValue(row, fieldKey);

  switch (config.type) {
    case ColumnType.NUMBER:
      return formatNumber(value);
    case ColumnType.MONEY:
      return formatCurrency(value);
    case ColumnType.PERCENTAGE:
      return formatPercentage(value);
    case ColumnType.SELECT:
      return config.selectConfig?.options?.find((opt) => opt.code === value)?.label ?? value;
    case ColumnType.SEARCH_SELECT:
      return value ? config.searchSelectConfig!.selected(value) : '';
    case ColumnType.DATE:
      return value ? new Date(value).toLocaleDateString() : '-';
    case ColumnType.PHONE:
      return `${row.entity[config.phoneConfig!.secondaryField!]} ${row.entity[fieldKey as keyof TEntity]}`;
    default:
      return String(value ?? '');
  }
}

function updateFieldValue(row: TableRow<TEntity>, fieldKey: string, value: unknown) {
  const keys = fieldKey.split('.');
  const lastKey = keys.pop()!;

  const target = keys.reduce((obj, key) => obj?.[key], row.entity as any);

  if (target) {
    target[lastKey] = value;
  }

  row._isEdited = true;

  props.configs[fieldKey]?.onValueChanged?.(row, value);
}
</script>

<style scoped></style>
