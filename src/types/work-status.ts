export class WorkStatus {
  static readonly STARTED = 'STARTED';
  static readonly IN_PROGRESS = 'IN_PROGRESS';
  static readonly DONE = 'DONE';
  static readonly SUSPENDED = 'SUSPENDED';

  static readonly OPTIONS = [
    { value: 'STARTED', label: 'Iniciada' },
    { value: 'IN_PROGRESS', label: 'Em Curso' },
    { value: 'DONE', label: 'Concluída' },
    { value: 'SUSPENDED', label: 'Suspensa' },
  ];

  static getLabel(value?: string): string {
    return WorkStatus.OPTIONS.find((option) => option.value === value)?.label ?? '';
  }
}
