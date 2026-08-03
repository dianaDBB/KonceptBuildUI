import { ColumnType, Configs, RangeFilterValueType } from '@/types/entity-configs';
import { TableFilterKind } from '@/types/table-filter';
import { WorkType } from '@/types/work-type';
import { ClientType } from '@/types/client-type';
import { ClientInvoiceSortField, ClientInvoiceType } from '@/types/client-invoice-type';
import { Client } from './client';
import { Work } from './work';
import { formatCurrency, formatPercentage } from '@/utils/validation';
import { buildTooltipItems } from '@/utils/tooltipItems';

export class ClientInvoice {
  static getConfigs(
    clientOptions: ClientType[],
    workOptions: WorkType[],
  ): Configs<ClientInvoiceSortField, ClientInvoiceType> {
    const clientConfigs = Client.getConfigs();
    const workConfigs = Work.getConfigs(clientOptions);

    return {
      docNumber: {
        label: 'Nº Documento',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientInvoice: ClientInvoiceType) => !clientInvoice.docNumber,
          columnStyle: {
            width: '90px',
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
        displayValue: (clientInvoice: ClientInvoiceType) => clientInvoice.docNumber,
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
          tooltipItems: (client: ClientType) => buildTooltipItems(client, clientConfigs),
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientInvoice: ClientInvoiceType) => !clientInvoice.client,
          columnStyle: {
            width: '200px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.CLIENT_NAME,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'clientName',
          },
          dropdownAlign: 'start',
        },
        displayValue: (clientInvoice: ClientInvoiceType) => clientInvoice.client?.companyName,
      },
      work: {
        label: 'Obra',
        type: ColumnType.SEARCH_SELECT,
        searchSelectConfig: {
          selected: (work: WorkType) => work.name!,
          options: workOptions,
          optionLines: (work: WorkType) => [work.code!, work.name!],
          filter: (work: WorkType) => `${work.code} ${work.name}`,
          tooltipTitle: (work: WorkType) => work.code!,
          tooltipItems: (work: WorkType) => buildTooltipItems(work, workConfigs),
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientInvoice: ClientInvoiceType) => !clientInvoice.work,
          columnStyle: {
            width: '200px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.WORK_NAME,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'workName',
          },
        },
        displayValue: (clientInvoice: ClientInvoiceType) => clientInvoice.work?.name,
      },
      description: {
        label: 'Descrição',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientInvoice: ClientInvoiceType) => !clientInvoice.description,
          columnStyle: {
            width: '200px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.DESCRIPTION,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'description',
          },
        },
        displayValue: (clientInvoice: ClientInvoiceType) => clientInvoice.description,
      },
      valueWithoutTax: {
        label: 'Valor s/IVA (€)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientInvoice: ClientInvoiceType) => !clientInvoice.valueWithoutTax,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.VALUE_WITHOUT_TAX,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'valueWithoutTaxMin',
            maxKey: 'valueWithoutTaxMax',
          },
        },
        displayValue: (clientInvoice: ClientInvoiceType) => formatCurrency(clientInvoice.valueWithoutTax),
      },
      appliedTax: {
        label: 'Taxa IVA (%)',
        type: ColumnType.PERCENTAGE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientInvoice: ClientInvoiceType) =>
            clientInvoice.appliedTax == undefined || clientInvoice.appliedTax < 0,
          columnStyle: {
            width: '80px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.APPLIED_TAX,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'appliedTaxMin',
            maxKey: 'appliedTaxMax',
          },
        },
        displayValue: (clientInvoice: ClientInvoiceType) => formatPercentage(clientInvoice.appliedTax),
      },
      taxValue: {
        label: 'IVA (€)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.TAX_VALUE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'taxValueMin',
            maxKey: 'taxValueMax',
          },
        },
        displayValue: (clientInvoice: ClientInvoiceType) => formatCurrency(clientInvoice.taxValue),
      },
      totalValue: {
        label: 'Valor Total (€) (C/IVA)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.TOTAL_VALUE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'totalValueMin',
            maxKey: 'totalValueMax',
          },
        },
        displayValue: (clientInvoice: ClientInvoiceType) => formatCurrency(clientInvoice.totalValue),
      },
      registrationDate: {
        label: 'Data Registo',
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientInvoice: ClientInvoiceType) => !clientInvoice.registrationDate,
          columnStyle: {
            width: '130px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.REGISTRATION_DATE,
          kind: TableFilterKind.DATE_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            minKey: 'registrationDateMin',
            maxKey: 'registrationDateMax',
          },
        },
        displayValue: (clientInvoice: ClientInvoiceType) => clientInvoice.registrationDate,
      },
      dueDate: {
        label: 'Data Vencimento',
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientInvoice: ClientInvoiceType) => !clientInvoice.dueDate,
          columnStyle: {
            width: '130px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.DUE_DATE,
          kind: TableFilterKind.DATE_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            minKey: 'dueDateMin',
            maxKey: 'dueDateMax',
          },
        },
        displayValue: (clientInvoice: ClientInvoiceType) => clientInvoice.dueDate,
      },
    };
  }

  static isValid(clientInvoice: ClientInvoiceType, configs: Configs<ClientInvoiceSortField>): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(clientInvoice));
  }
}
