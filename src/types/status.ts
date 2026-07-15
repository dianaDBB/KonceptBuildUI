export class Status {
  static readonly ACTIVE = 'ACTIVE';
  static readonly INACTIVE = 'INACTIVE';

  static readonly OPTIONS = [
    { value: 'ACTIVE', label: 'Activo' },
    { value: 'INACTIVE', label: 'Inactivo' },
  ];

  static getLabel(value?: string): string {
    return Status.OPTIONS.find((option) => option.value === value)?.label ?? '';
  }
}
