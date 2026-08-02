import { ColumnType, Configs, RangeFilterValueType } from '@/types/entity-configs';
import { TableFilterKind } from '@/types/table-filter';
import { ClientSortField, ClientType } from '@/types/client-type';
import { EnumOptions } from '@/types/select-options';
import { ClientPaymentSortField, ClientPaymentType } from '@/types/client-payment-type';
import { ClientInvoiceSortField, ClientInvoiceType } from '@/types/client-invoice-type';

export class ClientPayment {
  static getConfigs(
    clientPaymentTypeOptions: EnumOptions,
    statusOptions: EnumOptions,
    clientOptions: ClientType[],
    clientConfigs: Configs<ClientSortField, ClientType>,
    invoiceOptions: ClientInvoiceType[],
    invoiceConfigs: Configs<ClientInvoiceSortField, ClientInvoiceType>,
    paymentMethodOptions: EnumOptions,
  ): Configs<ClientPaymentSortField, ClientPaymentType> {
    return {
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
          column: ClientPaymentSortField.PAYMENT_METHOD,
          kind: TableFilterKind.SELECT,
          valueConfig: {
            valueKey: 'type',
          },
          dropdownAlign: 'start',
        },
      },
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
      },
      invoices: {
        label: 'Nº Documento Relacionado',
        type: ColumnType.SEARCH_SELECT_MULTIPLE,
        searchSelectMultipleConfig: {
          selected: (invoices: ClientInvoiceType[]) => invoices.map((invoice) => invoice.docNumber).join(', '),
          options: invoiceOptions,
          optionKey: (invoice: ClientInvoiceType) => invoice.id!,
          optionLines: (invoice: ClientInvoiceType) => [invoice.docNumber!],
          filter: (invoice: ClientInvoiceType) => `${invoice.docNumber}`,
          tooltipTitle: (invoice: ClientInvoiceType) => invoice.docNumber!,
          tooltipItems: (invoice: ClientInvoiceType) => [
            { label: invoiceConfigs.docNumber.label, value: invoice.docNumber },
            { label: invoiceConfigs.client.label, value: `${invoice.client?.code} - ${invoice.client?.companyName}` },
            { label: invoiceConfigs.work.label, value: `${invoice.work?.code} - ${invoice.work?.name}` },
            { label: invoiceConfigs.description.label, value: invoice.description },
            { label: invoiceConfigs.valueWithoutTax.label, value: invoice.valueWithoutTax },
            { label: invoiceConfigs.appliedTax.label, value: invoice.appliedTax },
            { label: invoiceConfigs.taxValue.label, value: invoice.taxValue },
            { label: invoiceConfigs.totalValue.label, value: invoice.totalValue },
            { label: invoiceConfigs.registrationDate.label, value: invoice.registrationDate },
            { label: invoiceConfigs.dueDate.label, value: invoice.dueDate },
          ],
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientPayment: ClientPaymentType) => !clientPayment.invoices,
          columnStyle: {
            width: '200px',
          },
        },
        filterConfig: {
          column: ClientPaymentSortField.CLIENT_NAME,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'clientName',
          },
          dropdownAlign: 'start',
        },
      },
      client: {
        label: 'Cliente',
        type: ColumnType.SEARCH_SELECT,
        searchSelectConfig: {
          selected: (client: ClientType) => client.companyName!,
          options: clientOptions,
          optionLines: (client: ClientType) => [client.code!, client.companyName!, client.nif!],
          filter: (client: ClientType) => `${client.companyName} ${client.nif} ${client.code}`,
          tooltipTitle: (client: ClientType) => client.companyName!,
          tooltipItems: (client: ClientType) => [
            { label: clientConfigs.code.label, value: client.code },
            { label: clientConfigs.companyName.label, value: client.companyName },
            { label: clientConfigs.address.label, value: client.address },
            { label: clientConfigs.postalCode.label, value: client.postalCode },
            { label: clientConfigs.city.label, value: client.city },
            { label: clientConfigs.district.label, value: client.district },
            { label: clientConfigs.nif.label, value: client.nif },
            { label: clientConfigs.contact.label, value: client.contact },
            { label: clientConfigs.email.label, value: client.email },
            {
              label: clientConfigs.phone.label,
              value: `${client.phoneCountryCode ?? ''} ${client.phone ?? ''}`,
            },
            {
              label: clientConfigs.status.label,
              value: client.status ? statusOptions[client.status].label : client.status,
            },
            { label: clientConfigs.note.label, value: client.note },
          ],
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientPayment: ClientPaymentType) => !clientPayment.client,
          columnStyle: {
            width: '200px',
          },
        },
        filterConfig: {
          column: ClientPaymentSortField.CLIENT_NAME,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'clientName',
          },
          dropdownAlign: 'start',
        },
      },
      paymentDate: {
        label: 'Data Pagamento',
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
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            minKey: 'paymentDateMin',
            maxKey: 'paymentDateMax',
          },
        },
      },
      paidValue: {
        label: 'Valor Pago (€)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientPayment: ClientPaymentType) => !clientPayment.paidValue,
          columnStyle: {
            width: '80px',
          },
        },
        filterConfig: {
          column: ClientPaymentSortField.PAID_VALUE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'paidValueMin',
            maxKey: 'paidValueMax',
          },
        },
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
