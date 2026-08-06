import { ColumnType, Configs, RangeFilterValueType } from '@/types/entity-configs';
import { TableFilterKind } from '@/types/table-filter';
import { ClientInvoiceSortField } from '@/types/client-invoice-type';
import { formatCurrency, formatPercentage } from '@/utils/validation';
import { ClientCreditNoteType } from '@/types/client-credit-note-type';
import { ClientInvoice } from './client-invoice';

export class ClientCreditNote {
  static getConfigs(): Configs<ClientInvoiceSortField, ClientCreditNoteType> {
    const invoiceConfigs = ClientInvoice.getConfigs([], []);

    return {
      docNumber: {
        label: invoiceConfigs.docNumber.label,
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientCreditNoteType: ClientCreditNoteType) => !clientCreditNoteType.docNumber,
          columnStyle: {
            width: invoiceConfigs.docNumber.styleConfig.columnStyle.width,
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.DOCUMENT_NUMBER,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'docNumber',
          },
          dropdownAlign: 'start',
        },
        displayValue: (clientCreditNoteType: ClientCreditNoteType) => clientCreditNoteType.docNumber,
      },
      client: {
        label: invoiceConfigs.client.label,
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: invoiceConfigs.client.styleConfig.columnStyle.width,
          },
        },
        displayValue: () => '---',
      },
      work: {
        label: invoiceConfigs.work.label,
        type: ColumnType.LABEL,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: invoiceConfigs.work.styleConfig.columnStyle.width,
          },
        },
        displayValue: () => '---',
      },
      description: {
        label: invoiceConfigs.description.label,
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientCreditNoteType: ClientCreditNoteType) => !clientCreditNoteType.description,
          columnStyle: {
            width: invoiceConfigs.description.styleConfig.columnStyle.width,
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.DESCRIPTION,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'description',
          },
        },
        displayValue: (clientCreditNoteType: ClientCreditNoteType) => clientCreditNoteType.description,
      },
      valueWithoutTax: {
        label: invoiceConfigs.valueWithoutTax.label,
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientCreditNoteType: ClientCreditNoteType) => !clientCreditNoteType.valueWithoutTax,
          columnStyle: {
            width: invoiceConfigs.valueWithoutTax.styleConfig.columnStyle.width,
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.VALUE_WITHOUT_TAX,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'valueWithoutTax',
          },
        },
        displayValue: (clientCreditNoteType: ClientCreditNoteType) =>
          formatCurrency(clientCreditNoteType.valueWithoutTax),
      },
      appliedTax: {
        label: invoiceConfigs.appliedTax.label,
        type: ColumnType.PERCENTAGE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientCreditNoteType: ClientCreditNoteType) =>
            clientCreditNoteType.appliedTax == undefined || clientCreditNoteType.appliedTax < 0,
          columnStyle: {
            width: invoiceConfigs.appliedTax.styleConfig.columnStyle.width,
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.APPLIED_TAX,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'appliedTax',
          },
        },
        displayValue: (clientCreditNoteType: ClientCreditNoteType) => formatPercentage(clientCreditNoteType.appliedTax),
      },
      taxValue: {
        label: invoiceConfigs.taxValue.label,
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: invoiceConfigs.taxValue.styleConfig.columnStyle.width,
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.TAX_VALUE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'taxValue',
          },
        },
        displayValue: (clientCreditNoteType: ClientCreditNoteType) => formatCurrency(clientCreditNoteType.taxValue),
      },
      totalValue: {
        label: invoiceConfigs.totalValue.label,
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: invoiceConfigs.totalValue.styleConfig.columnStyle.width,
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.TOTAL_VALUE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'totalValue',
          },
        },
        displayValue: (clientCreditNoteType: ClientCreditNoteType) => formatCurrency(clientCreditNoteType.totalValue),
      },
      registrationDate: {
        label: invoiceConfigs.registrationDate.label,
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientCreditNoteType: ClientCreditNoteType) => !clientCreditNoteType.registrationDate,
          columnStyle: {
            width: invoiceConfigs.registrationDate.styleConfig.columnStyle.width,
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.REGISTRATION_DATE,
          kind: TableFilterKind.DATE_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            valueKey: 'registrationDate',
          },
        },
        displayValue: (clientCreditNoteType: ClientCreditNoteType) => clientCreditNoteType.registrationDate,
      },
      dueDate: {
        label: invoiceConfigs.dueDate.label,
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: () => false,
          columnStyle: {
            width: invoiceConfigs.dueDate.styleConfig.columnStyle.width,
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.DUE_DATE,
          kind: TableFilterKind.DATE_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            valueKey: 'dueDate',
          },
        },
        displayValue: (clientCreditNoteType: ClientCreditNoteType) => clientCreditNoteType.dueDate,
      },
    };
  }

  static isValid(clientCreditNoteType: ClientCreditNoteType, configs: Configs<ClientInvoiceSortField>): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(clientCreditNoteType));
  }
}
