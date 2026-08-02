import { ColumnType, Configs, RangeFilterValueType } from '@/types/entity-configs';
import { TableFilterKind } from '@/types/table-filter';
import { WorkSortField, WorkType } from '@/types/work-type';
import { ClientSortField, ClientType } from '@/types/client-type';
import { ClientInvoiceSortField, ClientInvoiceType } from '@/types/client-invoice-type';
import { EnumOptions } from '@/types/select-options';

export class ClientInvoice {
  static getConfigs(
    statusOptions: EnumOptions,
    clientOptions: ClientType[],
    clientConfigs: Configs<ClientSortField, ClientType>,
    workOptions: WorkType[],
    workConfigs: Configs<WorkSortField, WorkType>,
  ): Configs<ClientInvoiceSortField, ClientInvoiceType> {
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
          isInvalid: (work: WorkType) => !work.client,
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
          tooltipItems: (work: WorkType) => [
            { label: workConfigs.code.label, value: work.code },
            { label: workConfigs.name.label, value: work.name },
            { label: workConfigs.status.label, value: work.status },
            { label: workConfigs.contractedBudget.label, value: work.contractedBudget },
            { label: workConfigs.estimatedCost.label, value: work.estimatedCost },
            { label: workConfigs.estimatedCostMaterials.label, value: work.estimatedCostMaterials },
            { label: workConfigs.estimatedCostLabor.label, value: work.estimatedCostLabor },
            { label: workConfigs.estimatedMarginEur.label, value: work.estimatedMarginEur },
            { label: workConfigs.estimatedMarginPercentual.label, value: work.estimatedMarginPercentual },
            { label: workConfigs.startDate.label, value: work.startDate },
            { label: workConfigs.estimatedEndDate.label, value: work.estimatedEndDate },
            { label: workConfigs.endDate.label, value: work.endDate },
          ],
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (work: WorkType) => !work.client,
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
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            minKey: 'registrationDateMin',
            maxKey: 'registrationDateMax',
          },
        },
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
          column: ClientInvoiceSortField.REGISTRATION_DATE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            minKey: 'dueDateMin',
            maxKey: 'dueDateMax',
          },
        },
      },
    };
  }

  static isValid(
    clientInvoice: ClientInvoiceType,
    configs: Configs<ClientInvoiceSortField, ClientInvoiceType>,
  ): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(clientInvoice));
  }
}
