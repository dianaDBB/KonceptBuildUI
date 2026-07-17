import { ClientSortField, ClientType } from '@/types/client-type';
import { EntityConfig } from '@/types/entity-configs';
import { Status } from '@/types/status';
import { TableFilterKind } from '@/types/table-filter';
import { isValidEmail, isValidPhone } from '@/utils/validation';

export class Client {
  static readonly configs: Record<string, EntityConfig<ClientType, ClientSortField>> = {
    code: {
      label: 'ID',
      showDisabled: (client: ClientType) => true,
      isInvalid: (client: ClientType) => false,
      filter: {
        column: ClientSortField.CODE,
        kind: TableFilterKind.TEXT,
        valueKey: 'code',
        dropdownAlign: 'start',
      },
    },
    companyName: {
      label: 'Nome / Empresa',
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => !client.companyName,
      filter: {
        column: ClientSortField.COMPANY_NAME,
        kind: TableFilterKind.TEXT,
        valueKey: 'companyName',
        dropdownAlign: 'start',
      },
    },
    address: {
      label: 'Morada',
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => false,
      filter: {
        column: ClientSortField.ADDRESS,
        kind: TableFilterKind.TEXT,
        valueKey: 'address',
        dropdownAlign: 'start',
      },
    },
    postalCode: {
      label: 'Código Postal',
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => false,
      filter: {
        column: ClientSortField.POSTAL_CODE,
        kind: TableFilterKind.TEXT,
        valueKey: 'postalCode',
      },
    },
    city: {
      label: 'Localidade',
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => false,
      filter: {
        column: ClientSortField.CITY,
        kind: TableFilterKind.TEXT,
        valueKey: 'city',
      },
    },
    district: {
      label: 'Distrito',
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => false,
      filter: {
        column: ClientSortField.DISTRICT,
        kind: TableFilterKind.TEXT,
        valueKey: 'district',
      },
    },
    nif: {
      label: 'NIF',
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => !client.nif,
      filter: {
        column: ClientSortField.NIF,
        kind: TableFilterKind.TEXT,
        valueKey: 'nif',
      },
    },
    contact: {
      label: 'Contacto',
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => !client.contact,
      filter: {
        column: ClientSortField.CONTACT,
        kind: TableFilterKind.TEXT,
        valueKey: 'contact',
      },
    },
    email: {
      label: 'E-mail',
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => !isValidEmail(client.email),
      filter: {
        column: ClientSortField.EMAIL,
        kind: TableFilterKind.TEXT,
        valueKey: 'email',
      },
    },
    phone: {
      label: 'Tlf',
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => !isValidPhone(client.phone),
      filter: {
        column: ClientSortField.PHONE,
        kind: TableFilterKind.TEXT,
        valueKey: 'phone',
      },
    },
    status: {
      label: 'Estado',
      options: Status.OPTIONS,
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => !client.status,
      filter: {
        column: ClientSortField.STATUS,
        kind: TableFilterKind.SELECT,
        valueKey: 'status',
      },
    },
    note: {
      label: 'Notas',
      showDisabled: (client: ClientType) => false,
      isInvalid: (client: ClientType) => false,
      filter: {
        column: ClientSortField.NOTE,
        kind: TableFilterKind.TEXT,
        valueKey: 'note',
      },
    },
  };

  static isValid(client: ClientType): boolean {
    return Object.values(Client.configs).every((config) => !config.isInvalid(client));
  }
}
