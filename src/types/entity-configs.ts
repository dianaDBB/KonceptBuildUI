import { StyleValue } from 'vue';
import { TableFilterKind } from './table-filter';
import { SelectOption } from './select-options';

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

export interface EntityConfig<TEntity, TColumn extends string = string> {
  label: string;
  type: ColumnType;
  secondaryField?: string;
  onValueChanged?: (row: TableRow<TEntity>, value: unknown) => void;

  showDisabled: (entity: TEntity) => boolean;
  isInvalid: (entity: TEntity) => boolean;
  isHighlight?: boolean;
  enum?: any;
  options?: SelectOption[];
  searchSelect?: SearchSelectConfig<any>;

  filter: {
    column: TColumn;
    kind: TableFilterKind;
    valueKey?: string;
    minKey?: string;
    maxKey?: string;
    dropdownAlign?: 'start' | 'end';
  };

  columnStyle: StyleValue;
}

export interface TableRow<T> {
  entity: T;
  _key: string;
  _isNew: boolean;
  _isEdited: boolean;
  _original?: T;
}

export interface SearchSelectConfig<TOption> {
  options: TOption[];
  selected: (option: TOption) => string;
  optionLines: (option: TOption) => string[];
  filter?: (option: TOption) => string;
  tooltipTitle?: (value: any) => string;
  tooltipItems?: (value: any) => {
    label: string;
    value?: string | number | null;
  }[];
}
