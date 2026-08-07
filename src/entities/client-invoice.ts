import { ColumnType, Configs, RangeFilterValueType } from '@/types/entity-configs';
import { TableFilterKind } from '@/types/table-filter';
import { WorkType } from '@/types/work-type';
import { ClientType } from '@/types/client-type';
import { ClientInvoiceSortField, ClientInvoiceType } from '@/types/client-invoice-type';
import { Client } from './client';
import { Work } from './work';
import { formatCurrency, formatIntNumber, formatPercentage } from '@/utils/validation';
import { buildTooltipItems } from '@/utils/tooltipItems';
import { useConfigs } from '@/composables/useConfigs';
import { getAgingClass, getInvoiceStatusClass } from '@/utils/enums-css-class';

export class ClientInvoice {
  static getConfigs(
    clientOptions: ClientType[],
    workOptions: WorkType[],
  ): Configs<ClientInvoiceSortField, ClientInvoiceType> {
    const clientConfigs = Client.getConfigs();
    const workConfigs = Work.getConfigs(clientOptions);
    const invoiceStatus = useConfigs().invoiceStatusOptions.value;
    const aging = useConfigs().agingOptions.value;

    return {
      docNumber: {
        label: 'Nº Documento',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (invoice: ClientInvoiceType) => !invoice.docNumber,
          isHighlight: true,
          columnStyle: {
            width: '140px',
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
        displayValue: (invoice: ClientInvoiceType) => invoice.docNumber,
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
          showDisabled: () => false,
          isInvalid: (invoice: ClientInvoiceType) => !invoice.client,
          columnStyle: {
            width: '200px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.CLIENT,
          kind: TableFilterKind.TEXT,
          info: 'Pode pesquisar por: ID | Nome/Empresa | NIF | Contacto | E-mail | Tlf',
          valueConfig: {
            valueKey: 'client',
          },
          dropdownAlign: 'start',
        },
        displayValue: (invoice: ClientInvoiceType) =>
          invoice.client ? `${invoice.client?.code} - ${invoice.client?.companyName}` : undefined,
      },
      work: {
        label: 'Obra',
        type: ColumnType.SEARCH_SELECT,
        searchSelectConfig: {
          selected: (work: WorkType) => `${work.code!}\n${work.name!}`,
          options: (invoice: ClientInvoiceType) => {
            if (!invoice.client?.id) {
              return workOptions;
            }

            return workOptions.filter((work) => work.client?.code === invoice.client?.code);
          },
          optionLines: (work: WorkType) => [work.code!, work.name!],
          filter: (work: WorkType) => `${work.code} ${work.name}`,
          tooltipTitle: (work: WorkType) => work.name!,
          tooltipItems: (work: WorkType) => buildTooltipItems(work, workConfigs),
        },
        styleConfig: {
          showDisabled: (invoice: ClientInvoiceType) => invoice.client == undefined,
          isInvalid: (invoice: ClientInvoiceType) => !invoice.work,
          columnStyle: {
            width: '200px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.WORK,
          kind: TableFilterKind.TEXT,
          info: 'Pode pesquisar por: Pode pesquisar por: ID | Nome',
          valueConfig: {
            valueKey: 'work',
          },
        },
        displayValue: (invoice: ClientInvoiceType) =>
          invoice.work ? `${invoice.work?.code} - ${invoice.work?.name}` : undefined,
      },
      description: {
        label: 'Descrição',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (invoice: ClientInvoiceType) => !invoice.description,
          columnStyle: {
            width: '250px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.DESCRIPTION,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'description',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => invoice.description,
      },
      valueWithoutTax: {
        label: 'Valor s/IVA (€)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (invoice: ClientInvoiceType) => !invoice.valueWithoutTax,
          columnStyle: {
            width: '100px',
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
        displayValue: (invoice: ClientInvoiceType) => formatCurrency(invoice.valueWithoutTax),
      },
      appliedTax: {
        label: 'Taxa IVA (%)',
        type: ColumnType.PERCENTAGE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (invoice: ClientInvoiceType) => invoice.appliedTax == undefined || invoice.appliedTax < 0,
          columnStyle: {
            width: '80px',
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
        displayValue: (invoice: ClientInvoiceType) => formatPercentage(invoice.appliedTax),
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
            valueKey: 'taxValue',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => formatCurrency(invoice.taxValue),
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
            valueKey: 'totalValue',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => formatCurrency(invoice.totalValue),
      },
      registrationDate: {
        label: 'Data Registo',
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (invoice: ClientInvoiceType) => !invoice.registrationDate,
          columnStyle: {
            width: '130px',
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
        displayValue: (invoice: ClientInvoiceType) => invoice.registrationDate,
      },
      dueDate: {
        label: 'Data Vencimento',
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (invoice: ClientInvoiceType) => !invoice.dueDate,
          columnStyle: {
            width: '130px',
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
        displayValue: (invoice: ClientInvoiceType) => invoice.dueDate,
      },
      sumCreditNotesWithoutTax: {
        label: 'Valor NC Associada (S/IVA)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.SUM_CREDIT_NOTES_WITHOUT_TAX,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'sumCreditNotesWithoutTax',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => formatCurrency(invoice.sumCreditNotesWithoutTax),
      },
      sumCreditNotesWithTax: {
        label: 'Valor NC Associada (C/IVA)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.SUM_CREDIT_NOTES_WITH_TAX,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'sumCreditNotesWithTax',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => formatCurrency(invoice.sumCreditNotesWithTax),
      },
      totalValueNet: {
        label: 'Valor Total Liquido (S/IVA)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.TOTAL_VALUE_NET,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'totalValueNet',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => formatCurrency(invoice.totalValueNet),
      },
      totalValueGross: {
        label: 'Valor Total ILíquido (C/IVA)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.TOTAL_VALUE_GROSS,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'totalValueGross',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => formatCurrency(invoice.totalValueGross),
      },
      amountReceivedWithoutTax: {
        label: 'Valor Recebido (€) (S/IVA)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.AMOUNT_RECEIVED_WITHOUT_TAX,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'amountReceivedWithoutTax',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => formatCurrency(invoice.amountReceivedWithoutTax),
      },
      amountReceivedWithTax: {
        label: 'Valor Recebido (€) (C/IVA)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.AMOUNT_RECEIVED_WITH_TAX,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'amountReceivedWithTax',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => formatCurrency(invoice.amountReceivedWithTax),
      },
      amountDueWithoutTax: {
        label: 'Valor em Falta (€) (S/IVA)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.AMOUNT_DUE_WITHOUT_TAX,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'amountDueWithoutTax',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => formatCurrency(invoice.amountDueWithoutTax),
      },
      amountDueWithTax: {
        label: 'Valor em Falta (€) (C/IVA)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.AMOUNT_DUE_WITH_TAX,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'amountDueWithTax',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => formatCurrency(invoice.amountDueWithTax),
      },
      paymentsCount: {
        label: 'Nº Pag. e Reembolsos',
        type: ColumnType.NUMBER,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.PAYMENTS_COUNT,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'paymentsCount',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => formatIntNumber(invoice.paymentsCount),
      },
      status: {
        label: 'Estado',
        type: ColumnType.SELECT,
        selectConfig: {
          options: Object.values(invoiceStatus),
        },
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
          classes: (invoice: ClientInvoiceType) => getInvoiceStatusClass(invoice.status),
        },
        filterConfig: {
          column: ClientInvoiceSortField.STATUS,
          kind: TableFilterKind.SELECT,
          valueConfig: {
            valueKey: 'status',
          },
        },
        displayValue: (invoice: ClientInvoiceType) =>
          invoice.status ? invoiceStatus[invoice.status].label : undefined,
      },
      daysPastDue: {
        label: 'Dias em Atraso',
        type: ColumnType.NUMBER,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.DAYS_PAST_DUE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'daysPastDue',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => formatIntNumber(invoice.daysPastDue),
      },
      aging: {
        label: 'Aging',
        type: ColumnType.SELECT,
        selectConfig: {
          options: Object.values(aging),
        },
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
          classes: (invoice: ClientInvoiceType) => getAgingClass(invoice.aging),
        },
        filterConfig: {
          column: ClientInvoiceSortField.AGING,
          kind: TableFilterKind.SELECT,
          valueConfig: {
            valueKey: 'aging',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => (invoice.aging ? aging[invoice.aging].label : undefined),
      },
      settlementDate: {
        label: 'Data Liquidação',
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '130px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.SETTLEMENT_DATE,
          kind: TableFilterKind.DATE_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            valueKey: 'settlementDate',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => invoice.settlementDate,
      },
      daysToPay: {
        label: 'Prazo recebimento',
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '130px',
          },
        },
        filterConfig: {
          column: ClientInvoiceSortField.DAYS_TO_PAY,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'daysToPay',
          },
        },
        displayValue: (invoice: ClientInvoiceType) => formatIntNumber(invoice.daysToPay),
      },
    };
  }

  static isValid(invoice: ClientInvoiceType, configs: Configs<ClientInvoiceSortField>): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(invoice));
  }
}
