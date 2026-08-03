import { useConfigs } from '@/composables/useConfigs';
import { ClientSortField, ClientType } from '@/types/client-type';
import { ColumnType, Configs } from '@/types/entity-configs';
import { TableFilterKind } from '@/types/table-filter';
import { isValidEmail, isValidPhone } from '@/utils/validation';

export class Client {
  static getConfigs(): Configs<ClientSortField, ClientType> {
    const statusOptions = useConfigs().statusOptions.value;

    return {
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
        displayValue: (client: ClientType) => client.code,
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
        displayValue: (client: ClientType) => client.companyName,
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
        displayValue: (client: ClientType) => client.address,
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
        displayValue: (client: ClientType) => client.postalCode,
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
        displayValue: (client: ClientType) => client.city,
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
        displayValue: (client: ClientType) => client.district,
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
        displayValue: (client: ClientType) => client.nif,
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
        displayValue: (client: ClientType) => client.contact,
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
        displayValue: (client: ClientType) => client.email,
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
        displayValue: (client: ClientType) =>
          client.phoneCountryCode && client.phone ? `${client.phoneCountryCode} ${client.phone}` : undefined,
      },
      status: {
        label: 'Estado',
        type: ColumnType.SELECT,
        selectConfig: {
          options: Object.values(statusOptions),
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
        displayValue: (client: ClientType) => (client.status ? statusOptions[client.status].label : undefined),
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
        displayValue: (client: ClientType) => client.note,
      },
    };
  }

  static isValid(client: ClientType, configs: Configs<ClientSortField>): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(client));
  }
}
