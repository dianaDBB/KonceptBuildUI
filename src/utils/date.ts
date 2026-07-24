import Holidays from 'date-holidays';

const holidays = new Holidays('PT');

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
