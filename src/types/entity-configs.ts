import { TableFilterOption, TableFilterKind } from './table-filter';

export interface EntityConfig<TEntity, TColumn extends string = string> {
  label: string;
  showDisabled: (entity: TEntity) => boolean;
  isInvalid: (entity: TEntity) => boolean;
  options?: TableFilterOption[];
  filter: {
    column: TColumn;
    kind: TableFilterKind;
    valueKey?: string;
    minKey?: string;
    maxKey?: string;
    dropdownAlign?: 'start' | 'end';
  };
}
