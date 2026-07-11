export enum TableFilterKind {
  TEXT,
  SELECT,
  NUMBER_RANGE,
}

export interface TableFilterOption {
  label: string;
  value: string;
}

export interface TableColumnFilterConfig<TColumn extends string = string> {
  column: TColumn;
  label: string;
  kind: TableFilterKind;
  dropdownAlign?: 'start' | 'end';
  valueKey?: string;
  minKey?: string;
  maxKey?: string;
  options?: TableFilterOption[];
}
