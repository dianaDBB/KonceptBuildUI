import { ColumnType, Configs, RangeFilterValueType } from '@/types/entity-configs';
import { TableFilterKind } from '@/types/table-filter';
import { WorkSortField, WorkType } from '@/types/work-type';
import { ClientType } from '@/types/client-type';
import { useConfigs } from '@/composables/useConfigs';
import { Client } from './client';
import { formatCurrency, formatPercentage } from '@/utils/validation';
import { buildTooltipItems } from '@/utils/tooltipItems';

export class Work {
  static getConfigs(clientOptions: ClientType[]): Configs<WorkSortField, WorkType> {
    const workStatusOptions = useConfigs().workStatusOptions.value;
    const clientConfigs = Client.getConfigs();

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
        displayValue: (work: WorkType) => work.code,
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
        displayValue: (work: WorkType) => work.name,
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
        displayValue: (work: WorkType) => (work.status ? workStatusOptions[work.status].label : undefined),
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
            valueKey: 'contractedBudget',
          },
        },
        displayValue: (work: WorkType) => formatCurrency(work.contractedBudget),
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
            valueKey: 'estimatedCost',
          },
        },
        displayValue: (work: WorkType) => formatCurrency(work.estimatedCost),
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
            valueKey: 'estimatedCostMaterials',
          },
        },
        displayValue: (work: WorkType) => formatCurrency(work.estimatedCostMaterials),
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
            valueKey: 'estimatedCostLabor',
          },
        },
        displayValue: (work: WorkType) => formatCurrency(work.estimatedCostLabor),
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
            valueKey: 'estimatedMarginEur',
          },
        },
        displayValue: (work: WorkType) => formatCurrency(work.estimatedMarginEur),
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
            valueKey: 'estimatedMarginPercentual',
          },
        },
        displayValue: (work: WorkType) => formatPercentage(work.estimatedMarginPercentual),
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
          kind: TableFilterKind.DATE_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            valueKey: 'startDate',
          },
        },
        displayValue: (work: WorkType) => work.startDate,
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
          kind: TableFilterKind.DATE_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            valueKey: 'estimatedEndDate',
          },
        },
        displayValue: (work: WorkType) => work.estimatedEndDate,
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
          kind: TableFilterKind.DATE_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            valueKey: 'endDate',
          },
        },
        displayValue: (work: WorkType) => work.endDate,
      },
      client: {
        label: 'Cliente',
        type: ColumnType.SEARCH_SELECT,
        searchSelectConfig: {
          selected: (client: ClientType) => `${client.code!}\n${client.companyName!}`,
          options: clientOptions,
          optionLines: (client: ClientType) => [client.code!, client.companyName!, client.nif!],
          filter: (client: ClientType) => `${client.companyName} ${client.nif} ${client.code}`,
          tooltipTitle: (client: ClientType) => client.companyName!,
          tooltipItems: (client: ClientType) => buildTooltipItems(client, clientConfigs),
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (work: WorkType) => !work.client,
          columnStyle: {
            width: '200px',
          },
        },
        filterConfig: {
          column: WorkSortField.CLIENT,
          kind: TableFilterKind.TEXT,
          info: 'Pode pesquisar por: ID | Nome/Empresa | NIF | Contacto | E-mail | Tlf',
          valueConfig: {
            valueKey: 'client',
          },
        },
        displayValue: (work: WorkType) =>
          work.client ? `${work.client?.code} - ${work.client?.companyName}` : undefined,
      },
    };
  }

  static isValid(work: WorkType, configs: Configs<WorkSortField>): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(work));
  }
}
