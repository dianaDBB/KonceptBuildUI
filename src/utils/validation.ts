export function isValidPhone(phone?: string): boolean {
  return /^[0-9]{9}$/.test(phone ?? '');
}

export function isValidPhoneCountryCode(phoneCountryCode?: string): boolean {
  return /^\+[1-9]\d{0,2}$/.test(phoneCountryCode ?? '');
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

const intNumberFormatter = new Intl.NumberFormat('pt-PT', {
  useGrouping: true,
  minimumFractionDigits: 0,
  maximumFractionDigits: 0,
});

export function formatNumber(value?: number | null): string {
  return value == null ? '' : numberFormatter.format(value);
}

export function formatIntNumber(value?: number | null): string {
  return value == null ? '' : intNumberFormatter.format(value);
}

export function formatCurrency(value?: number | null): string {
  return value == null ? '-' : `${numberFormatter.format(value).replace(/\u00A0/g, ' ')} €`;
}

export function formatPercentage(value?: number | null): string {
  return value == null ? '-' : `${numberFormatter.format(value)} %`;
}
