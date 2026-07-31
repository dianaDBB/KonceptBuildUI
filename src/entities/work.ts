import { ColumnType, Configs, RangeFilterValueType } from '@/types/entity-configs';
import { TableFilterKind } from '@/types/table-filter';
import { WorkSortField, WorkType } from '@/types/work-type';
import { ClientSortField, ClientType } from '@/types/client-type';
import { EnumOptions } from '@/types/select-options';

export class Work {
  static getConfigs(
    statusOptions: EnumOptions,
    workStatusOptions: EnumOptions,
    clientOptions: ClientType[],
    clientConfigs: Configs<ClientSortField, ClientType>,
  ): Configs<WorkSortField, ClientType> {
    return {
      code: {
        label: 'ID',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '90px',
          },
        },
        filterConfig: {
          column: WorkSortField.CODE,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'code',
          },
          dropdownAlign: 'start',
        },
      },
      name: {
        label: 'Nome da Obra',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (work: WorkType) => !work.name,
          columnStyle: {
            width: '150px',
          },
        },
        filterConfig: {
          column: WorkSortField.NAME,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'name',
          },
          dropdownAlign: 'start',
        },
      },
      status: {
        label: 'Estado',
        type: ColumnType.SELECT,
        selectConfig: {
          options: Object.values(workStatusOptions),
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (work: WorkType) => !work.status,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkSortField.STATUS,
          kind: TableFilterKind.SELECT,
          valueConfig: {
            valueKey: 'status',
          },
          dropdownAlign: 'start',
        },
      },
      contractedBudget: {
        label: 'Orçamento Adjudicado (€)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (work: WorkType) => !work.contractedBudget,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkSortField.CONTRACTED_BUDGET,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'contractedBudgetMin',
            maxKey: 'contractedBudgetMax',
          },
        },
      },
      estimatedCost: {
        label: 'Custo Previsto (€)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          isHighlight: true,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkSortField.ESTIMATED_COST,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'estimatedCostMin',
            maxKey: 'estimatedCostMax',
          },
        },
      },
      estimatedCostMaterials: {
        label: 'Custo Previsto Materiais (€)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (work: WorkType) => !work.estimatedCostMaterials,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkSortField.ESTIMATED_COST_MATERIALS,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'estimatedCostMaterialMin',
            maxKey: 'estimatedCostMaterialMax',
          },
        },
      },
      estimatedCostLabor: {
        label: 'Custo Previsto Mão-Obra (€)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (work: WorkType) => !work.estimatedCostLabor,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkSortField.ESTIMATED_COST_LABOR,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'estimatedCostLaborMin',
            maxKey: 'estimatedCostLaborMax',
          },
        },
      },
      estimatedMarginEur: {
        label: 'Margem Prevista (€)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          isHighlight: true,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkSortField.ESTIMATED_MARGIN_EUR,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'estimatedMarginEurMin',
            maxKey: 'estimatedMarginEurMax',
          },
        },
      },
      estimatedMarginPercentual: {
        label: 'Margem Prevista (%)',
        type: ColumnType.PERCENTAGE,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          isHighlight: true,
          columnStyle: {
            width: '130px',
          },
        },
        filterConfig: {
          column: WorkSortField.ESTIMATED_MARGIN_PERCENTUAL,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'estimatedMarginPercentualMin',
            maxKey: 'estimatedMarginPercentualMax',
          },
        },
      },
      startDate: {
        label: 'Data início',
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (work: WorkType) => !work.startDate,
          columnStyle: {
            width: '130px',
          },
        },
        filterConfig: {
          column: WorkSortField.START_DATE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            minKey: 'startDateMin',
            maxKey: 'startDateMax',
          },
        },
      },
      estimatedEndDate: {
        label: 'Data Fim Prevista',
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (work: WorkType) => !work.estimatedEndDate,
          columnStyle: {
            width: '130px',
          },
        },
        filterConfig: {
          column: WorkSortField.ESTIMATED_END_DATE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            minKey: 'estimatedEndDateMin',
            maxKey: 'estimatedEndDateMax',
          },
        },
      },
      endDate: {
        label: 'Data Fim',
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: () => false,
          columnStyle: {
            width: '130px',
          },
        },
        filterConfig: {
          column: WorkSortField.END_DATE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            minKey: 'endDateMin',
            maxKey: 'endDateMax',
          },
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
          column: WorkSortField.CLIENT_NAME,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'clientName',
          },
        },
      },
    };
  }

  static isValid(work: WorkType, configs: Configs<WorkSortField, WorkType>): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(work));
  }
}
