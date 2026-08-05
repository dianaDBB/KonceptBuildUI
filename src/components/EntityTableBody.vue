<template>
  <tbody ref="tableBody">
    <template v-for="row in props.rows.rows" :key="row._key">
      <tr
        :class="{ disabled: !isRowActive(row), 'main-row': row._expanded != undefined }"
        @dblclick="!props.rows.isEditing.value && props.rows.handlers.edit?.(row)"
        @click="!props.rows.isEditing.value && hasChildren(row) && props.rows.handlers.toggle?.(row)"
      >
        <td
          v-for="(config, fieldKey, index) in props.rows.configs"
          :key="fieldKey"
          :style="config.styleConfig.columnStyle"
          :class="getColumnClasses(fieldKey)"
        >
          <template v-if="rowHasChanges(row)">
            <slot :name="`edit-${fieldKey}`" :row="row" :config="config" :field-key="fieldKey">
              <component
                :is="getEditableComponent(config.type)"
                :value="
                  config.type == ColumnType.LABEL ? config.displayValue(row.entity) : getFieldValue(row, fieldKey)
                "
                :entity="row.entity"
                :field-key="fieldKey"
                :secondary-value="
                  config.phoneConfig?.secondaryField
                    ? getFieldValue(row, String(config.phoneConfig.secondaryField))
                    : ''
                "
                :config="config"
                :select-options="config.selectConfig?.options"
                :search-select-options="
                  typeof config.searchSelectConfig?.options == 'function'
                    ? config.searchSelectConfig.options(row.entity)
                    : config.searchSelectConfig?.options
                "
                :search-select-multiple-options="
                  typeof config.searchSelectMultipleConfig?.options == 'function'
                    ? config.searchSelectMultipleConfig?.options(row.entity)
                    : config.searchSelectMultipleConfig
                "
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
              <div v-if="index === 0" class="main-cell">
                <component v-if="hasChildren(row)" :is="row._expanded ? ChevronDown : ChevronRight" :size="18" />

                <template v-if="config.type === ColumnType.SEARCH_SELECT">
                  <div class="with-info-tooltip">
                    <span>{{ config.displayValue(row.entity) }}</span>

                    <InfoTooltip
                      v-if="getFieldValue(row, fieldKey)"
                      position="left"
                      :title="config.searchSelectConfig?.tooltipTitle?.(getFieldValue(row, fieldKey) as TEntity)"
                      :items="config.searchSelectConfig?.tooltipItems?.(getFieldValue(row, fieldKey) as TEntity)"
                    />
                  </div>
                </template>

                <template v-else>
                  {{ config.displayValue(row.entity) }}
                </template>
              </div>

              <template v-else>
                <template v-if="config.type === ColumnType.SEARCH_SELECT">
                  <div class="with-info-tooltip">
                    <span>{{ config.displayValue(row.entity) }}</span>

                    <InfoTooltip
                      v-if="getFieldValue(row, fieldKey)"
                      position="left"
                      :title="config.searchSelectConfig?.tooltipTitle?.(getFieldValue(row, fieldKey) as TEntity)"
                      :items="config.searchSelectConfig?.tooltipItems?.(getFieldValue(row, fieldKey) as TEntity)"
                    />
                  </div>
                </template>
                <template v-else>
                  {{ config.displayValue(row.entity) }}
                </template>
              </template>
            </slot>
          </template>
        </td>

        <td class="actions-column">
          <div v-if="!rowHasChanges(row)" class="action-buttons">
            <slot name="row-actions" :row="row" :isSubrow="!props.subrows">
              <button
                v-if="props.rows.handlers.delete"
                title="Eliminar"
                :disabled="props.rows.isEditing.value"
                @click="props.rows.handlers.delete(row)"
              >
                <Trash2 :size="16" />
              </button>

              <button
                v-if="props.rows.handlers.edit"
                title="Editar"
                :disabled="props.rows.isEditing.value"
                @click="props.rows.handlers.edit(row)"
              >
                <Pencil :size="16" />
              </button>
            </slot>
          </div>

          <div v-else class="action-buttons editing">
            <button
              v-if="props.rows.handlers.discard"
              title="Descartar alterações"
              @click="props.rows.handlers.discard(row)"
            >
              <Undo2 :size="16" />
            </button>

            <button
              v-if="props.rows.handlers.save"
              title="Guardar alterações"
              :disabled="!isRowValid(row.entity)"
              @click="props.rows.handlers.save(row)"
            >
              <Check :size="16" />
            </button>
          </div>
        </td>
      </tr>

      <tr v-if="row._expanded && props.subrows" class="details-row">
        <td :colspan="totalColumns" class="details-cell">
          <table class="sub-table">
            <colgroup>
              <col
                v-for="config in Object.values(props.subrows.configs)"
                :key="config.label"
                :style="config.styleConfig.columnStyle"
              />
              <col style="width: 130px" />
            </colgroup>
            <EntityTableBody
              :rows="{
                rows: props.subrows.rows(row.entity),
                configs: props.subrows.configs,
                handlers: props.subrows.handlers,
                rowIsActive: props.subrows.rowIsActive,
                isValid: props.subrows.isValid,
                isEditing: props.subrows.isEditing,
              }"
            >
              <!-- @vue-ignore -->
              <template #row-actions="{ row: subrow }">
                <slot name="row-actions" :row="subrow" :isSubrow="true" />
              </template>
            </EntityTableBody>
          </table>
        </td>
      </tr>
    </template>
  </tbody>
</template>

<script
  setup
  lang="ts"
  generic="TSortField extends string, TEntity extends EntityType = EntityType, TSubrow extends EntityType = EntityType"
>
import { Trash2, Pencil, Undo2, Check, ChevronDown, ChevronRight } from 'lucide-vue-next';
import { computed, type Component } from 'vue';
import {
  ColumnType,
  EntityType,
  TableRow,
  EntityTableBodyProps,
  EntityTableBodySubrowProps,
} from '@/types/entity-configs';
import TextInput from './inputs/TextInput.vue';
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
import Label from './inputs/Label.vue';
import EntityTableBody from './EntityTableBody.vue';

interface Props {
  rows: EntityTableBodyProps<TEntity, TSortField>;
  subrows?: EntityTableBodySubrowProps<TEntity, TSubrow>;
}

const props = defineProps<Props>();

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
  [ColumnType.LABEL]: Label,
};

const totalColumns = computed(() => Object.keys(props.rows.configs).length + 1);

function hasChildren(row: TableRow<TEntity>) {
  return !!props.subrows && props.subrows.rows(row.entity).length > 0;
}

function getEditableComponent(type: ColumnType): Component | undefined {
  return editableComponentMap[type];
}

function rowHasChanges(row: TableRow<TEntity>): boolean {
  return row._isNew || row._isEdited;
}

function isRowValid(entity: TEntity): boolean {
  return props.rows.isValid(entity);
}

function isRowActive(row: TableRow<TEntity>): boolean {
  return props.rows.rowIsActive(row);
}

function getColumnClasses(fieldKey: string): Record<string, boolean> {
  return {
    highlight: props.rows.configs[fieldKey].styleConfig.isHighlight ?? false,
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

  props.rows.configs[fieldKey]?.onValueChanged?.(row, value);
}
</script>

<style scoped></style>
