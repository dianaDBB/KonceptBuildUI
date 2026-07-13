export function isValidPhone(phone?: string): boolean {
  return /^[0-9]{9}$/.test(phone ?? '');
}

export function isValidEmail(email?: string): boolean {
  if (!email) {
    return false;
  }

  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

const numberFormatter = new Intl.NumberFormat('pt-PT', {
  useGrouping: true,
  minimumFractionDigits: 2,
  maximumFractionDigits: 2,
});

export function formatCurrency(value?: number | null): string {
  if (value == null) return '-';

  return `${numberFormatter.format(value).replace(/\u00A0/g, '.')} €`;
}

export function formatPercentage(value?: number | null): string {
  if (value == null) return '-';

  return `${numberFormatter.format(value)} %`;
}
