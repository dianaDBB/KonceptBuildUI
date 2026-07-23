import { ColumnType, EntityConfig } from '@/types/entity-configs';
import { TableFilterKind } from '@/types/table-filter';
import { WorkStatus } from '@/types/work-status';
import { WorkSortField, WorkType } from '@/types/work-type';
import { Client } from './client';
import { Status } from '@/types/status';
import { ClientType } from '@/types/client-type';

export class Work {
  static readonly configs: Record<string, EntityConfig<WorkSortField, ClientType>> = {
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
        options: WorkStatus.OPTIONS,
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
        optionLines: (client: ClientType) => [client.companyName!, client.nif!, client.code!],
        filter: (client: ClientType) => `${client.companyName} ${client.nif} ${client.code}`,
        tooltipTitle: (client: ClientType) => client.companyName!,
        tooltipItems: (client: ClientType) => [
          { label: Client.configs.code.label, value: client.code },
          { label: Client.configs.companyName.label, value: client.companyName },
          { label: Client.configs.address.label, value: client.address },
          { label: Client.configs.postalCode.label, value: client.postalCode },
          { label: Client.configs.city.label, value: client.city },
          { label: Client.configs.district.label, value: client.district },
          { label: Client.configs.nif.label, value: client.nif },
          { label: Client.configs.contact.label, value: client.contact },
          { label: Client.configs.email.label, value: client.email },
          {
            label: Client.configs.phone.label,
            value: `${client.phoneCountryCode ?? ''} ${client.phone ?? ''}`,
          },
          { label: Client.configs.status.label, value: Status.getLabel(client.status) },
          { label: Client.configs.note.label, value: client.note },
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

  static isValid(work: WorkType): boolean {
    return Object.values(Work.configs).every((config) => !config.styleConfig.isInvalid(work));
  }
}
