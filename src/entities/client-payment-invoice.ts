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
    const paymentConfigs = ClientPayment.getConfigs([]);
    const invoiceConfigs = ClientInvoice.getConfigs([], []);

    return {
      documentId: {
        label: paymentConfigs.documentId.label,
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: paymentConfigs.documentId.styleConfig.columnStyle.width,
          },
        },
        displayValue: () => '',
      },
      type: {
        label: paymentConfigs.type.label,
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: paymentConfigs.type.styleConfig.columnStyle.width,
          },
        },
        displayValue: () => '',
      },
      client: {
        label: paymentConfigs.client.label,
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: paymentConfigs.client.styleConfig.columnStyle.width,
          },
        },
        displayValue: () => '',
      },
      invoice: {
        label: paymentConfigs.paidInvoices.label,
        type: ColumnType.SEARCH_SELECT,
        searchSelectConfig: {
          selected: (invoice: ClientInvoiceType) => invoice.docNumber!,
          options: (paymentInvoice: ClientPaymentInvoiceType, alreadyUsedOptions?: ClientPaymentInvoiceType[]) => {
            const clientId = paymentInvoice._client?.id;

            if (!clientId) {
              return invoiceOptions;
            }

            const usedIds = new Set(
              alreadyUsedOptions
                ?.filter((row) => row !== paymentInvoice)
                .map((row) => row.invoice?.id)
                .filter(Boolean),
            );

            return invoiceOptions.filter(
              (invoice) => invoice.client?.id === paymentInvoice._client?.id && !usedIds.has(invoice.id),
            );
          },
          optionLines: (invoice: ClientInvoiceType) => [invoice.docNumber!],
          filter: (invoice: ClientInvoiceType) => invoice.docNumber!,
          tooltipTitle: (invoice: ClientInvoiceType) => invoice.docNumber!,
          tooltipItems: (invoice: ClientInvoiceType) => buildTooltipItems(invoice, invoiceConfigs),
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (paymentInvoice: ClientPaymentInvoiceType) => !paymentInvoice.invoice,
          columnStyle: {
            width: paymentConfigs.paidInvoices.styleConfig.columnStyle.width,
          },
        },
        displayValue: (paymentInvoice: ClientPaymentInvoiceType) => paymentInvoice.invoice?.docNumber,
      },
      paidValue: {
        label: paymentConfigs.totalPaidValue.label,
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (paymentInvoice: ClientPaymentInvoiceType) => !paymentInvoice.paidValue,
          columnStyle: {
            width: paymentConfigs.totalPaidValue.styleConfig.columnStyle.width,
          },
        },
        displayValue: (paymentInvoice: ClientPaymentInvoiceType) => formatCurrency(paymentInvoice.paidValue),
      },
      paymentDate: {
        label: paymentConfigs.paymentDate.label,
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: paymentConfigs.paymentDate.styleConfig.columnStyle.width,
          },
        },
        displayValue: () => '',
      },
      paymentMethod: {
        label: paymentConfigs.paymentMethod.label,
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: paymentConfigs.paymentMethod.styleConfig.columnStyle.width,
          },
        },
        displayValue: () => '',
      },
      notes: {
        label: paymentConfigs.notes.label,
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: paymentConfigs.notes.styleConfig.columnStyle.width,
          },
        },
        displayValue: () => '',
      },
    };
  }

  static isValid(
    paymentInvoice: ClientPaymentInvoiceType,
    configs: Configs<ClientPaymentSortField, ClientPaymentInvoiceType>,
  ): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(paymentInvoice));
  }
}
