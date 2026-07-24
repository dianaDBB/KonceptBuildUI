export interface SelectOption {
  code: string;
  label: string;
}

export type EnumOptions = { [k: string]: SelectOption };
