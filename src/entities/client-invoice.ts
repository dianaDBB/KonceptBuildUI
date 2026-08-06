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
          isInvalid: (clientInvoice: ClientInvoiceType) => !clientInvoice.docNumber,
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
        displayValue: (clientInvoice: ClientInvoiceType) => clientInvoice.docNumber,
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
          isInvalid: (clientInvoice: ClientInvoiceType) => !clientInvoice.client,
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
        displayValue: (clientInvoice: ClientInvoiceType) =>
          clientInvoice.client ? `${clientInvoice.client?.code} - ${clientInvoice.client?.companyName}` : undefined,
      },
      work: {
        label: 'Obra',
        type: ColumnType.SEARCH_SELECT,
        searchSelectConfig: {
          selected: (work: WorkType) => `${work.code!}\n${work.name!}`,
          options: (clientInvoice: ClientInvoiceType) => {
            if (!clientInvoice.client?.id) {
              return workOptions;
            }

            return workOptions.filter((work) => work.client?.code === clientInvoice.client?.code);
          },
          optionLines: (work: WorkType) => [work.code!, work.name!],
          filter: (work: WorkType) => `${work.code} ${work.name}`,
          tooltipTitle: (work: WorkType) => work.name!,
          tooltipItems: (work: WorkType) => buildTooltipItems(work, workConfigs),
        },
        styleConfig: {
          showDisabled: (clientInvoice: ClientInvoiceType) => clientInvoice.client == undefined,
          isInvalid: (clientInvoice: ClientInvoiceType) => !clientInvoice.work,
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
        displayValue: (clientInvoice: ClientInvoiceType) =>
          clientInvoice.work ? `${clientInvoice.work?.code} - ${clientInvoice.work?.name}` : undefined,
      },
      description: {
        label: 'Descrição',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (clientInvoice: ClientInvoiceType) => !clientInvoice.description,
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
            valueKey: 'valueWithoutTax',
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
            valueKey: 'appliedTax',
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
            valueKey: 'taxValue',
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
            valueKey: 'totalValue',
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
            valueKey: 'registrationDate',
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
            valueKey: 'dueDate',
          },
        },
        displayValue: (clientInvoice: ClientInvoiceType) => clientInvoice.dueDate,
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
        displayValue: (clientInvoice: ClientInvoiceType) => formatCurrency(clientInvoice.sumCreditNotesWithoutTax),
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
        displayValue: (clientInvoice: ClientInvoiceType) => formatCurrency(clientInvoice.sumCreditNotesWithTax),
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
        displayValue: (clientInvoice: ClientInvoiceType) => formatCurrency(clientInvoice.totalValueNet),
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
        displayValue: (clientInvoice: ClientInvoiceType) => formatCurrency(clientInvoice.totalValueGross),
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
        displayValue: (clientInvoice: ClientInvoiceType) => formatCurrency(clientInvoice.amountReceivedWithoutTax),
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
        displayValue: (clientInvoice: ClientInvoiceType) => formatCurrency(clientInvoice.amountReceivedWithTax),
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
        displayValue: (clientInvoice: ClientInvoiceType) => formatCurrency(clientInvoice.amountDueWithoutTax),
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
        displayValue: (clientInvoice: ClientInvoiceType) => formatCurrency(clientInvoice.amountDueWithTax),
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
        displayValue: (clientInvoice: ClientInvoiceType) => formatIntNumber(clientInvoice.paymentsCount),
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
          classes: (invoice: ClientInvoiceType) => ({
            'invoice-status-paid': invoice.status == 'PAID',
            'invoice-status-partial': invoice.status == 'PARTIAL',
            'invoice-status-delay': invoice.status == 'DELAY',
            'invoice-status-pending': invoice.status == 'PENDING',
          }),
        },
        filterConfig: {
          column: ClientInvoiceSortField.STATUS,
          kind: TableFilterKind.SELECT,
          valueConfig: {
            valueKey: 'status',
          },
        },
        displayValue: (clientInvoice: ClientInvoiceType) =>
          clientInvoice.status ? invoiceStatus[clientInvoice.status].label : undefined,
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
        displayValue: (clientInvoice: ClientInvoiceType) => formatIntNumber(clientInvoice.daysPastDue),
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
          classes: (invoice: ClientInvoiceType) => ({
            'aging-zero-thirty': invoice.aging == 'ZERO_THIRTY',
            'aging-thirty-sixty': invoice.aging == 'THIRTY_SIXTY',
            'aging-sixty-ninty': invoice.aging == 'SIXTY_NINTY',
            'aging-ninty-plus': invoice.aging == 'NINTY_PLUS',
            'aging-not-yet-due': invoice.aging == 'NOT_YET_DUE',
            'aging-paid': invoice.aging == 'PAID',
            'aging-na': invoice.aging == 'NA',
          }),
        },
        filterConfig: {
          column: ClientInvoiceSortField.AGING,
          kind: TableFilterKind.SELECT,
          valueConfig: {
            valueKey: 'aging',
          },
        },
        displayValue: (clientInvoice: ClientInvoiceType) =>
          clientInvoice.aging ? aging[clientInvoice.aging].label : undefined,
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
        displayValue: (clientInvoice: ClientInvoiceType) => clientInvoice.settlementDate,
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
        displayValue: (clientInvoice: ClientInvoiceType) => formatIntNumber(clientInvoice.daysToPay),
      },
    };
  }

  static isValid(clientInvoice: ClientInvoiceType, configs: Configs<ClientInvoiceSortField>): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(clientInvoice));
  }
}
