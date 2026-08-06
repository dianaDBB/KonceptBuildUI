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
    const paymentTypeOptions = useConfigs().clientPaymentTypeOptions.value;
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
        displayValue: (payment: ClientPaymentType) => payment.documentId,
      },
      type: {
        label: 'Tipo',
        type: ColumnType.SELECT,
        selectConfig: {
          options: Object.values(paymentTypeOptions),
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (payment: ClientPaymentType) => !payment.type,
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
        displayValue: (payment: ClientPaymentType) =>
          payment.type ? paymentTypeOptions[payment.type].label : undefined,
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
          isInvalid: (payment: ClientPaymentType) => !payment.client,
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
        displayValue: (payment: ClientPaymentType) =>
          payment.client ? `${payment.client?.code} - ${payment.client?.companyName}` : undefined,
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
        displayValue: (payment: ClientPaymentType) =>
          payment.paidInvoices?.map((paidInvoice) => paidInvoice.invoice?.docNumber).join(', '),
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
        displayValue: (payment: ClientPaymentType) =>
          payment.type == 'PAYMENT'
            ? formatCurrency(payment.totalPaidValue)
            : formatCurrency(payment.totalPaidValue ? payment.totalPaidValue * -1 : undefined),
      },
      paymentDate: {
        label: 'Data Transação',
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (payment: ClientPaymentType) => !payment.paymentDate,
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
        displayValue: (payment: ClientPaymentType) => payment.paymentDate,
      },
      paymentMethod: {
        label: 'Método Pagamento',
        type: ColumnType.SELECT,
        selectConfig: {
          options: Object.values(paymentMethodOptions),
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (payment: ClientPaymentType) => !payment.paymentMethod,
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
        displayValue: (payment: ClientPaymentType) =>
          payment.paymentMethod ? paymentMethodOptions[payment.paymentMethod].label : undefined,
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
        displayValue: (payment: ClientPaymentType) => payment.notes,
      },
    };
  }

  static isValid(payment: ClientPaymentType, configs: Configs<ClientPaymentSortField, ClientPaymentType>): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(payment));
  }
}
