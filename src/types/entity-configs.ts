import { StyleValue } from 'vue';
import { TableFilterKind } from './table-filter';
import { SelectOption } from './select-options';
import { UUID } from 'crypto';
import { TooltipItem } from '@/composables/InfoTooltip.vue';

export interface EntityType {
  id?: UUID;
  code?: string;
}

export interface TableRow<TEntity extends EntityType = EntityType> {
  entity: TEntity;
  _key: string;
  _isNew: boolean;
  _isEdited: boolean;
  _original?: TEntity;
}

export enum ColumnType {
  TEXT,
  NUMBER,
  MONEY,
  DATE,
  SELECT,
  SEARCH_SELECT,
  EMAIL,
  PHONE,
  PERCENTAGE,
}

export type Configs<TSortField extends string = string, TEntity extends EntityType = EntityType> = Record<
  string,
  EntityConfig<TSortField, TEntity>
>;

export interface EntityConfig<TSortField extends string = string, TEntity extends EntityType = EntityType> {
  label: string;
  additionalInfo?: {
    tooltipTitle?: string;
    tooltipItems?: TooltipItem[];
    tooltipInfo?: string[];
  };
  type: ColumnType;
  onValueChanged?: (row: TableRow, value: unknown) => void;

  selectConfig?: SelectConfig;
  searchSelectConfig?: SearchSelectConfig<TEntity>;
  phoneConfig?: PhoneConfig<TEntity>;

  styleConfig: StyleConfig;

  filterConfig?: FilterConfig<TSortField>;
}

export interface StyleConfig {
  showDisabled: (entity: EntityType, row?: TableRow<EntityType>) => boolean;
  isInvalid: (entity: EntityType) => boolean;
  isHighlight?: boolean;
  columnStyle: StyleValue;
}

export interface SearchSelectConfig<TEntity extends EntityType = EntityType> {
  selected: (option: TEntity) => string;
  optionLines: (option: TEntity) => string[];
  filter?: (option: TEntity) => string;
  tooltipTitle?: (value: TEntity) => string;
  tooltipItems?: (value: TEntity) => {
    label: string;
    value?: string | number | null;
  }[];
}

export interface SelectConfig {
  options: SelectOption[];
}

export interface PhoneConfig<TEntity extends EntityType = EntityType> {
  secondaryField: keyof TEntity;
}

export interface FilterConfig<TSortField extends string = string> {
  column: TSortField;
  kind: TableFilterKind;
  valueConfig: SingleFilterConfig | RangeFilterConfig;
  dropdownAlign?: 'start' | 'end';
}

export interface SingleFilterConfig {
  valueKey: string;
}

export enum RangeFilterValueType {
  NUMBER = 'NUMBER',
  DATE = 'DATE',
}

export interface RangeFilterConfig {
  valueType: RangeFilterValueType;
  minKey: string;
  maxKey: string;
}
