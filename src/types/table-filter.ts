export enum TableFilterKind {
  TEXT,
  SELECT,
  NUMBER_RANGE,
}

export interface TableFilterOption {
  label: string;
  value: string;
}
