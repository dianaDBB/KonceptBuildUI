type NumericKeys<T> = {
  [K in keyof T]-?: T[K] extends number | null | undefined ? K : never;
}[keyof T];

const formatter = new Intl.NumberFormat('pt-PT', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function handleNumberInput<T extends Record<string, unknown>, K extends NumericKeys<T>>(
  event: Event,
  obj: T,
  field: K,
) {
  const input = event.target as HTMLInputElement;
  const digits = input.value.replace(/\D/g, '');
  const value = Number(digits) / 100;

  obj[field] = value as T[K];
  input.value = formatter.format(value);
}
