import { CSSProperties, Ref } from 'vue';
import { TableFilterKind } from './table-filter';
import { SelectOption } from './select-options';
import { UUID } from 'crypto';
import { TooltipItem } from '@/components/InfoTooltip.vue';

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
  _expanded?: boolean;
  _parentId?: string;
}

export interface EntityTableBodyProps<TEntity extends EntityType, TSortField extends string = string> {
  rows: TableRow<TEntity>[];
  configs: Record<string, EntityConfig<TSortField>>;
  handlers: RowHandlers<TEntity>;
  rowIsActive: (row: TableRow<TEntity>) => boolean;
  isValid: (entity: TEntity) => boolean;
  isEditing: Ref<boolean>;
}

export interface EntityTableBodySubrowProps<TParent extends EntityType, TSubrow extends EntityType>
  extends Omit<EntityTableBodyProps<TSubrow>, 'rows'> {
  rows(parent: TParent): TableRow<TSubrow>[];
}

export interface RowHandlers<TEntity extends EntityType = EntityType> {
  edit?(row: TableRow<TEntity>): void;
  save?(row: TableRow<TEntity>): void;
  delete?(row: TableRow<TEntity>): void;
  discard?(row: TableRow<TEntity>): void;
  toggle?(row: TableRow<TEntity>): void;
}

export enum ColumnType {
  TEXT,
  NUMBER,
  MONEY,
  DATE,
  SELECT,
  SEARCH_SELECT,
  SEARCH_SELECT_MULTIPLE,
  EMAIL,
  PHONE,
  PERCENTAGE,
  LABEL,
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
  searchSelectMultipleConfig?: SearchSelectMultipleConfig<TEntity>;
  phoneConfig?: PhoneConfig<TEntity>;

  styleConfig: StyleConfig;

  filterConfig?: FilterConfig<TSortField>;

  displayValue: (entity: EntityType) => string | number | undefined;
}

export interface StyleConfig {
  showDisabled: (entity: EntityType, row?: TableRow<EntityType>) => boolean;
  isInvalid: (entity: EntityType) => boolean;
  isHighlight?: boolean;
  columnStyle: CSSProperties;
  classes?: string | Record<string, boolean> | ((entity: EntityType) => string | Record<string, boolean> | undefined);
}

export interface SearchSelectConfig<TEntity extends EntityType = EntityType> {
  selected: (option: TEntity) => string;
  options: (entity: TEntity, alreadyUsedOptions?: TEntity[]) => TEntity[];
  optionLines: (option: TEntity) => string[];
  filter?: (option: TEntity) => string;
  tooltipTitle?: (value: TEntity) => string;
  tooltipItems?: (value: TEntity) => {
    label: string;
    value?: string | number | undefined;
  }[];
}

export interface SearchSelectMultipleConfig<TEntity extends EntityType = EntityType> {
  selected: (options: TEntity[]) => string;
  options: (entity: EntityType) => TEntity[];
  optionKey?: (option: TEntity) => string;
  optionLines: (option: TEntity) => string[];
  filter?: (option: TEntity) => string;
  tooltipTitle?: (value: TEntity) => string;
  tooltipItems?: (value: TEntity) => {
    label: string;
    value?: string | number | undefined;
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
  info?: string;
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
  valueKey: string;
}

export interface RangeFilter {
  min?: string | number | undefined;
  max?: string | number | undefined;
}
