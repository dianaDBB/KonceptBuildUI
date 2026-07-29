import Holidays from 'date-holidays';

const holidays = new Holidays('PT');

export const years = [
  2026, 2027, 2028, 2029, 2030, 2031, 2032, 2033, 2034, 2035, 2036, 2037, 2038, 2039, 2040, 2041, 2042, 2043, 2044,
  2045, 2046, 2047, 2048, 2050,
];

export const months = [
  { label: 'Janeiro', value: 1 },
  { label: 'Fevereiro', value: 2 },
  { label: 'Março', value: 3 },
  { label: 'Abril', value: 4 },
  { label: 'Maio', value: 5 },
  { label: 'Junho', value: 6 },
  { label: 'Julho', value: 7 },
  { label: 'Agosto', value: 8 },
  { label: 'Setembro', value: 9 },
  { label: 'Outubro', value: 10 },
  { label: 'Novembro', value: 11 },
  { label: 'Dexembro', value: 12 },
];

export const monthNames = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dexembro',
];

const weekdayNames = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

export function getFormatedMonth(month: number) {
  return String(month).padStart(2, '0');
}

export function getFormatedDay(day: number) {
  return String(day).padStart(2, '0');
}

export function getDate(year: number, month: number, day: number) {
  return `${year}-${getFormatedMonth(month)}-${getFormatedDay(day)}`;
}

export function getWeekday(year: number, month: number, day: number): string {
  return weekdayNames[new Date(year, month - 1, day).getDay()];
}

export function isWeekend(year: number, month: number, day: number): boolean {
  const date = new Date(year, month - 1, day);

  return date.getDay() === 0 || date.getDay() === 6;
}

export function isHoliday(year: number, month: number, day: number): boolean {
  return !!holidays.isHoliday(new Date(year, month - 1, day));
}

export function isToday(year: number, month: number, day: number): boolean {
  const today = new Date();

  return year === today.getFullYear() && month === today.getMonth() + 1 && day === today.getDate();
}
