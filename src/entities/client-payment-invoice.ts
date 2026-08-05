import { ColumnType, Configs } from '@/types/entity-configs';
import { ClientPaymentSortField } from '@/types/client-payment-type';
import { ClientInvoiceType } from '@/types/client-invoice-type';
import { ClientInvoice } from './client-invoice';
import { formatCurrency } from '@/utils/validation';
import { buildTooltipItems } from '@/utils/tooltipItems';
import { ClientPaymentInvoiceType } from '@/types/client-payment-invoice-type';
import { ClientPayment } from './client-payment';

export class ClientPaymentInvoice {
  static getConfigs(invoiceOptions: ClientInvoiceType[]): Configs<ClientPaymentSortField, ClientPaymentInvoiceType> {
    const clientPaymentConfigs = ClientPayment.getConfigs([]);
    const invoiceConfigs = ClientInvoice.getConfigs([], []);

    return {
      documentId: {
        label: clientPaymentConfigs.documentId.label,
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: clientPaymentConfigs.documentId.styleConfig.columnStyle.width,
          },
        },
        displayValue: () => '',
      },
      type: {
        label: clientPaymentConfigs.type.label,
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: clientPaymentConfigs.type.styleConfig.columnStyle.width,
          },
        },
        displayValue: () => '',
      },
      client: {
        label: clientPaymentConfigs.client.label,
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: clientPaymentConfigs.client.styleConfig.columnStyle.width,
          },
        },
        displayValue: () => '',
      },
      invoice: {
        label: clientPaymentConfigs.paidInvoices.label,
        type: ColumnType.SEARCH_SELECT,
        searchSelectConfig: {
          selected: (clientInvoice: ClientInvoiceType) => clientInvoice.docNumber!,
          options: (
            clientPaymentInvoice: ClientPaymentInvoiceType,
            alreadyUsedOptions?: ClientPaymentInvoiceType[],
          ) => {
            const clientId = clientPaymentInvoice._client?.id;

            if (!clientId) {
              return invoiceOptions;
            }

            const usedIds = new Set(
              alreadyUsedOptions
                ?.filter((row) => row !== clientPaymentInvoice)
                .map((row) => row.invoice?.id)
                .filter(Boolean),
            );

            return invoiceOptions.filter(
              (invoice) => invoice.client?.id === clientPaymentInvoice._client?.id && !usedIds.has(invoice.id),
            );
          },
          optionLines: (clientInvoice: ClientInvoiceType) => [clientInvoice.docNumber!],
          filter: (clientInvoice: ClientInvoiceType) => clientInvoice.docNumber!,
          tooltipTitle: (clientInvoice: ClientInvoiceType) => clientInvoice.docNumber!,
          tooltipItems: (clientInvoice: ClientInvoiceType) => buildTooltipItems(clientInvoice, invoiceConfigs),
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientPaymentInvoice: ClientPaymentInvoiceType) => !clientPaymentInvoice.invoice,
          columnStyle: {
            width: clientPaymentConfigs.paidInvoices.styleConfig.columnStyle.width,
          },
        },
        displayValue: (clientPaymentInvoice: ClientPaymentInvoiceType) => clientPaymentInvoice.invoice?.docNumber,
      },
      paidValue: {
        label: clientPaymentConfigs.totalPaidValue.label,
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientPaymentInvoice: ClientPaymentInvoiceType) => !clientPaymentInvoice.paidValue,
          columnStyle: {
            width: clientPaymentConfigs.totalPaidValue.styleConfig.columnStyle.width,
          },
        },
        displayValue: (clientPaymentInvoice: ClientPaymentInvoiceType) =>
          formatCurrency(clientPaymentInvoice.paidValue),
      },
      paymentDate: {
        label: clientPaymentConfigs.paymentDate.label,
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: clientPaymentConfigs.paymentDate.styleConfig.columnStyle.width,
          },
        },
        displayValue: () => '',
      },
      paymentMethod: {
        label: clientPaymentConfigs.paymentMethod.label,
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: clientPaymentConfigs.paymentMethod.styleConfig.columnStyle.width,
          },
        },
        displayValue: () => '',
      },
      notes: {
        label: clientPaymentConfigs.notes.label,
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: clientPaymentConfigs.notes.styleConfig.columnStyle.width,
          },
        },
        displayValue: () => '',
      },
    };
  }

  static isValid(
    clientPaymentInvoice: ClientPaymentInvoiceType,
    configs: Configs<ClientPaymentSortField, ClientPaymentInvoiceType>,
  ): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(clientPaymentInvoice));
  }
}
