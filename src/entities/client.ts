import { ClientSortField, ClientType } from '@/types/client-type';
import { ColumnType, EntityConfig } from '@/types/entity-configs';
import { Status } from '@/types/status';
import { TableFilterKind } from '@/types/table-filter';
import { isValidEmail, isValidPhone } from '@/utils/validation';

export class Client {
  static readonly configs: Record<string, EntityConfig<ClientType, ClientSortField>> = {
    code: {
      label: 'ID',
      type: ColumnType.TEXT,
      showDisabled: (client: ClientType) => true,
      isInvalid: (client: ClientType) => false,
      filter: {
        column: ClientSortField.CODE,
        kind: TableFilterKind.TEXT,
        valueKey: 'code',
        dropdownAlign: 'start',
      },
      columnStyle: {
        width: '90px',
      },
    },
    companyName: {
      label: 'Nome / Empresa',
      type: ColumnType.TEXT,
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => !client.companyName,
      filter: {
        column: ClientSortField.COMPANY_NAME,
        kind: TableFilterKind.TEXT,
        valueKey: 'companyName',
        dropdownAlign: 'start',
      },
      columnStyle: {
        width: '150px',
      },
    },
    address: {
      label: 'Morada',
      type: ColumnType.TEXT,
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => false,
      filter: {
        column: ClientSortField.ADDRESS,
        kind: TableFilterKind.TEXT,
        valueKey: 'address',
        dropdownAlign: 'start',
      },
      columnStyle: {
        width: '150px',
      },
    },
    postalCode: {
      label: 'Código Postal',
      type: ColumnType.TEXT,
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => false,
      filter: {
        column: ClientSortField.POSTAL_CODE,
        kind: TableFilterKind.TEXT,
        valueKey: 'postalCode',
      },
      columnStyle: {
        width: '95px',
      },
    },
    city: {
      label: 'Localidade',
      type: ColumnType.TEXT,
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => false,
      filter: {
        column: ClientSortField.CITY,
        kind: TableFilterKind.TEXT,
        valueKey: 'city',
      },
      columnStyle: {
        width: '95px',
      },
    },
    district: {
      label: 'Distrito',
      type: ColumnType.TEXT,
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => false,
      filter: {
        column: ClientSortField.DISTRICT,
        kind: TableFilterKind.TEXT,
        valueKey: 'district',
      },
      columnStyle: {
        width: '95px',
      },
    },
    nif: {
      label: 'NIF',
      type: ColumnType.TEXT,
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => !client.nif,
      filter: {
        column: ClientSortField.NIF,
        kind: TableFilterKind.TEXT,
        valueKey: 'nif',
      },
      columnStyle: {
        width: '95px',
      },
    },
    contact: {
      label: 'Contacto',
      type: ColumnType.TEXT,
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => !client.contact,
      filter: {
        column: ClientSortField.CONTACT,
        kind: TableFilterKind.TEXT,
        valueKey: 'contact',
      },
      columnStyle: {
        width: '150px',
      },
    },
    email: {
      label: 'E-mail',
      type: ColumnType.EMAIL,
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => !isValidEmail(client.email),
      filter: {
        column: ClientSortField.EMAIL,
        kind: TableFilterKind.TEXT,
        valueKey: 'email',
      },
      columnStyle: {
        width: '150px',
      },
    },
    phone: {
      label: 'Tlf',
      type: ColumnType.PHONE,
      secondaryField: 'phoneCountryCode',
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => !isValidPhone(client.phone),
      filter: {
        column: ClientSortField.PHONE,
        kind: TableFilterKind.TEXT,
        valueKey: 'phone',
      },
      columnStyle: {
        width: '140px',
      },
    },
    status: {
      label: 'Estado',
      options: Status.OPTIONS,
      type: ColumnType.SELECT,
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => !client.status,
      filter: {
        column: ClientSortField.STATUS,
        kind: TableFilterKind.SELECT,
        valueKey: 'status',
      },
      columnStyle: {
        width: '90px',
      },
    },
    note: {
      label: 'Notas',
      type: ColumnType.TEXT,
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => false,
      filter: {
        column: ClientSortField.NOTE,
        kind: TableFilterKind.TEXT,
        valueKey: 'note',
      },
      columnStyle: {
        width: '100px',
      },
    },
  };

  static isValid(client: ClientType): boolean {
    return Object.values(Client.configs).every((config) => !config.isInvalid(client));
  }
}
