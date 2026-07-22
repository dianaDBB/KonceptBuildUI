import { ClientSortField, ClientType } from '@/types/client-type';
import { ColumnType, EntityConfig } from '@/types/entity-configs';
import { Status } from '@/types/status';
import { TableFilterKind } from '@/types/table-filter';
import { isValidEmail, isValidPhone } from '@/utils/validation';

export class Client {
  static readonly configs: Record<string, EntityConfig<ClientSortField, ClientType>> = {
    code: {
      label: 'ID',
      type: ColumnType.TEXT,
      styleConfig: {
        showDisabled: () => true,
        isInvalid: () => false,
        columnStyle: {
          width: '90px',
        },
      },
      filterConfig: {
        column: ClientSortField.CODE,
        kind: TableFilterKind.TEXT,
        valueConfig: {
          valueKey: 'code',
        },
        dropdownAlign: 'start',
      },
    },
    companyName: {
      label: 'Nome / Empresa',
      type: ColumnType.TEXT,
      styleConfig: {
        showDisabled: () => false,
        isInvalid: (client: ClientType) => !client.companyName,
        columnStyle: {
          width: '150px',
        },
      },
      filterConfig: {
        column: ClientSortField.COMPANY_NAME,
        kind: TableFilterKind.TEXT,
        valueConfig: {
          valueKey: 'companyName',
        },
        dropdownAlign: 'start',
      },
    },
    address: {
      label: 'Morada',
      type: ColumnType.TEXT,
      styleConfig: {
        showDisabled: () => false,
        isInvalid: () => false,
        columnStyle: {
          width: '150px',
        },
      },
      filterConfig: {
        column: ClientSortField.ADDRESS,
        kind: TableFilterKind.TEXT,
        valueConfig: {
          valueKey: 'address',
        },
        dropdownAlign: 'start',
      },
    },
    postalCode: {
      label: 'Código Postal',
      type: ColumnType.TEXT,
      styleConfig: {
        showDisabled: () => false,
        isInvalid: () => false,
        columnStyle: {
          width: '95px',
        },
      },
      filterConfig: {
        column: ClientSortField.POSTAL_CODE,
        kind: TableFilterKind.TEXT,
        valueConfig: {
          valueKey: 'postalCode',
        },
      },
    },
    city: {
      label: 'Localidade',
      type: ColumnType.TEXT,
      styleConfig: {
        showDisabled: () => false,
        isInvalid: () => false,
        columnStyle: {
          width: '95px',
        },
      },
      filterConfig: {
        column: ClientSortField.CITY,
        kind: TableFilterKind.TEXT,
        valueConfig: {
          valueKey: 'city',
        },
      },
    },
    district: {
      label: 'Distrito',
      type: ColumnType.TEXT,
      styleConfig: {
        showDisabled: () => false,
        isInvalid: () => false,
        columnStyle: {
          width: '95px',
        },
      },
      filterConfig: {
        column: ClientSortField.DISTRICT,
        kind: TableFilterKind.TEXT,
        valueConfig: {
          valueKey: 'district',
        },
      },
    },
    nif: {
      label: 'NIF',
      type: ColumnType.TEXT,
      styleConfig: {
        showDisabled: () => false,
        isInvalid: (client: ClientType) => !client.nif,
        columnStyle: {
          width: '95px',
        },
      },
      filterConfig: {
        column: ClientSortField.NIF,
        kind: TableFilterKind.TEXT,
        valueConfig: {
          valueKey: 'nif',
        },
      },
    },
    contact: {
      label: 'Contacto',
      type: ColumnType.TEXT,
      styleConfig: {
        showDisabled: () => false,
        isInvalid: (client: ClientType) => !client.contact,
        columnStyle: {
          width: '150px',
        },
      },
      filterConfig: {
        column: ClientSortField.CONTACT,
        kind: TableFilterKind.TEXT,
        valueConfig: {
          valueKey: 'contact',
        },
      },
    },
    email: {
      label: 'E-mail',
      type: ColumnType.EMAIL,
      styleConfig: {
        showDisabled: () => false,
        isInvalid: (client: ClientType) => !isValidEmail(client.email),
        columnStyle: {
          width: '150px',
        },
      },
      filterConfig: {
        column: ClientSortField.EMAIL,
        kind: TableFilterKind.TEXT,
        valueConfig: {
          valueKey: 'email',
        },
      },
    },
    phone: {
      label: 'Tlf',
      type: ColumnType.PHONE,
      phoneConfig: {
        secondaryField: 'phoneCountryCode',
      },
      styleConfig: {
        showDisabled: () => false,
        isInvalid: (client: ClientType) => !isValidPhone(client.phone),
        columnStyle: {
          width: '140px',
        },
      },
      filterConfig: {
        column: ClientSortField.PHONE,
        kind: TableFilterKind.TEXT,
        valueConfig: {
          valueKey: 'phone',
        },
      },
    },
    status: {
      label: 'Estado',
      type: ColumnType.SELECT,
      selectConfig: {
        options: Status.OPTIONS,
      },
      styleConfig: {
        showDisabled: () => false,
        isInvalid: (client: ClientType) => !client.status,
        columnStyle: {
          width: '90px',
        },
      },
      filterConfig: {
        column: ClientSortField.STATUS,
        kind: TableFilterKind.SELECT,
        valueConfig: {
          valueKey: 'status',
        },
      },
    },
    note: {
      label: 'Notas',
      type: ColumnType.TEXT,
      styleConfig: {
        showDisabled: () => false,
        isInvalid: () => false,
        columnStyle: {
          width: '100px',
        },
      },
      filterConfig: {
        column: ClientSortField.NOTE,
        kind: TableFilterKind.TEXT,
        valueConfig: {
          valueKey: 'note',
        },
      },
    },
  };

  static isValid(client: ClientType): boolean {
    return Object.values(Client.configs).every((config) => !config.styleConfig.isInvalid(client));
  }
}
