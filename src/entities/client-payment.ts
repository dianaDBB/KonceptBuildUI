import { ColumnType, Configs, RangeFilterValueType } from '@/types/entity-configs';
import { TableFilterKind } from '@/types/table-filter';
import { ClientType } from '@/types/client-type';
import { ClientPaymentSortField, ClientPaymentType } from '@/types/client-payment-type';
import { useConfigs } from '@/composables/useConfigs';
import { Client } from './client';
import { formatCurrency } from '@/utils/validation';
import { buildTooltipItems } from '@/utils/tooltipItems';

export class ClientPayment {
  static getConfigs(clientOptions: ClientType[]): Configs<ClientPaymentSortField, ClientPaymentType> {
    const clientPaymentTypeOptions = useConfigs().clientPaymentTypeOptions.value;
    const paymentMethodOptions = useConfigs().paymentMethodOptions.value;

    const clientConfigs = Client.getConfigs();

    return {
      documentId: {
        label: 'ID Documento',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '80px',
          },
        },
        filterConfig: {
          column: ClientPaymentSortField.DOCUMENT_ID,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'documentId',
          },
          dropdownAlign: 'start',
        },
        displayValue: (clientPayment: ClientPaymentType) => clientPayment.documentId,
      },
      type: {
        label: 'Tipo',
        type: ColumnType.SELECT,
        selectConfig: {
          options: Object.values(clientPaymentTypeOptions),
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientPayment: ClientPaymentType) => !clientPayment.type,
          columnStyle: {
            width: '80px',
          },
        },
        filterConfig: {
          column: ClientPaymentSortField.PAYMENT_TYPE,
          kind: TableFilterKind.SELECT,
          valueConfig: {
            valueKey: 'type',
          },
          dropdownAlign: 'start',
        },
        displayValue: (clientPayment: ClientPaymentType) =>
          clientPayment.type ? clientPaymentTypeOptions[clientPayment.type].label : undefined,
      },
      client: {
        label: 'Cliente',
        type: ColumnType.SEARCH_SELECT,
        searchSelectConfig: {
          selected: (client: ClientType) => `${client.code!}\n${client.companyName!}`,
          options: () => clientOptions,
          optionLines: (client: ClientType) => [client.code!, client.companyName!, client.nif!],
          filter: (client: ClientType) => `${client.companyName} ${client.nif} ${client.code}`,
          tooltipTitle: (client: ClientType) => client.companyName!,
          tooltipItems: (client: ClientType) => buildTooltipItems(client, clientConfigs),
        },
        styleConfig: {
          showDisabled: () => true,
          isInvalid: (clientPayment: ClientPaymentType) => !clientPayment.client,
          columnStyle: {
            width: '200px',
          },
        },
        filterConfig: {
          column: ClientPaymentSortField.CLIENT,
          kind: TableFilterKind.TEXT,
          info: 'Pode pesquisar por: ID | Nome/Empresa | NIF | Contacto | E-mail | Tlf',
          valueConfig: {
            valueKey: 'client',
          },
          dropdownAlign: 'start',
        },
        displayValue: (clientPayment: ClientPaymentType) =>
          clientPayment.client ? `${clientPayment.client?.code} - ${clientPayment.client?.companyName}` : undefined,
      },
      paidInvoices: {
        label: 'Documentos Relacionados',
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '200px',
          },
        },
        // TODO: add the filter
        displayValue: (clientPayment: ClientPaymentType) =>
          clientPayment.paidInvoices?.map((paidInvoice) => paidInvoice.invoice?.docNumber).join(', '),
      },
      totalPaidValue: {
        label: 'Valor Pago (€)',
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '80px',
          },
        },
        filterConfig: {
          column: ClientPaymentSortField.TOTAL_PAID_VALUE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'paidValue',
          },
        },
        displayValue: (clientPayment: ClientPaymentType) =>
          clientPayment.type == 'PAYMENT'
            ? formatCurrency(clientPayment.totalPaidValue)
            : formatCurrency(clientPayment.totalPaidValue ? clientPayment.totalPaidValue * -1 : undefined),
      },
      paymentDate: {
        label: 'Data Transação',
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientPayment: ClientPaymentType) => !clientPayment.paymentDate,
          columnStyle: {
            width: '130px',
          },
        },
        filterConfig: {
          column: ClientPaymentSortField.PAYMENT_DATE,
          kind: TableFilterKind.DATE_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            valueKey: 'paymentDate',
          },
        },
        displayValue: (clientPayment: ClientPaymentType) => clientPayment.paymentDate,
      },
      paymentMethod: {
        label: 'Método Pagamento',
        type: ColumnType.SELECT,
        selectConfig: {
          options: Object.values(paymentMethodOptions),
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientPayment: ClientPaymentType) => !clientPayment.paymentMethod,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: ClientPaymentSortField.PAYMENT_METHOD,
          kind: TableFilterKind.SELECT,
          valueConfig: {
            valueKey: 'paymentMethod',
          },
        },
        displayValue: (clientPayment: ClientPaymentType) =>
          clientPayment.paymentMethod ? paymentMethodOptions[clientPayment.paymentMethod].label : undefined,
      },
      notes: {
        label: 'Notas',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: () => false,
          columnStyle: {
            width: '200px',
          },
        },
        filterConfig: {
          column: ClientPaymentSortField.NOTES,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'notes',
          },
        },
        displayValue: (clientPayment: ClientPaymentType) => clientPayment.notes,
      },
    };
  }

  static isValid(
    clientPayment: ClientPaymentType,
    configs: Configs<ClientPaymentSortField, ClientPaymentType>,
  ): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(clientPayment));
  }
}
