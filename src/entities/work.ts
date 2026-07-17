import { EntityConfig } from '@/types/entity-configs';
import { TableFilterKind } from '@/types/table-filter';
import { WorkStatus } from '@/types/work-status';
import { WorkSortField, WorkType } from '@/types/work-type';

export class Work {
  static readonly configs: Record<string, EntityConfig<WorkType, WorkSortField>> = {
    code: {
      label: 'ID',
      showDisabled: (work: WorkType) => true,
      isInvalid: (work: WorkType) => false,
      filter: {
        column: WorkSortField.CODE,
        kind: TableFilterKind.TEXT,
        valueKey: 'code',
        dropdownAlign: 'start',
      },
    },
    name: {
      label: 'Nome da Obra',
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.name,
      filter: {
        column: WorkSortField.NAME,
        kind: TableFilterKind.TEXT,
        valueKey: 'name',
        dropdownAlign: 'start',
      },
    },
    status: {
      label: 'Estado',
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.status,
      options: WorkStatus.OPTIONS,
      filter: {
        column: WorkSortField.STATUS,
        kind: TableFilterKind.SELECT,
        valueKey: 'status',
        dropdownAlign: 'start',
      },
    },
    contractedBudget: {
      label: 'Orçamento Adjudicado (€)',
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.contractedBudget,
      filter: {
        column: WorkSortField.CONTRACTED_BUDGET,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'contractedBudgetMin',
        maxKey: 'contractedBudgetMax',
      },
    },
    estimatedCost: {
      label: 'Custo Previsto (€)',
      showDisabled: (work: WorkType) => true,
      isInvalid: (work: WorkType) => false,
      filter: {
        column: WorkSortField.ESTIMATED_COST,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'estimatedCostMin',
        maxKey: 'estimatedCostMax',
      },
    },
    estimatedCostMaterials: {
      label: 'Custo Previsto Materiais (€)',
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.estimatedCostMaterials,
      filter: {
        column: WorkSortField.ESTIMATED_COST_MATERIALS,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'estimatedCostMaterialMin',
        maxKey: 'estimatedCostMaterialMax',
      },
    },
    estimatedCostLabor: {
      label: 'Custo Previsto Mão-Obra (€)',
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.estimatedCostLabor,
      filter: {
        column: WorkSortField.ESTIMATED_COST_LABOR,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'estimatedCostLaborMin',
        maxKey: 'estimatedCostLaborMax',
      },
    },
    estimatedMarginEur: {
      label: 'Margem Prevista (€)',
      showDisabled: (work: WorkType) => true,
      isInvalid: (work: WorkType) => false,
      filter: {
        column: WorkSortField.ESTIMATED_MARGIN_EUR,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'estimatedMarginEurMin',
        maxKey: 'estimatedMarginEurMax',
      },
    },
    estimatedMarginPercentual: {
      label: 'Margem Prevista (%)',
      showDisabled: (work: WorkType) => true,
      isInvalid: (work: WorkType) => false,
      filter: {
        column: WorkSortField.ESTIMATED_MARGIN_PERCENTUAL,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'estimatedMarginPercentualMin',
        maxKey: 'estimatedMarginPercentualMax',
      },
    },
    startDate: {
      label: 'Data início',
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.startDate,
      filter: {
        column: WorkSortField.START_DATE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'startDateMin',
        maxKey: 'startDateMax',
      },
    },
    estimatedEndDate: {
      label: 'Data Fim Prevista',
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.estimatedEndDate,
      filter: {
        column: WorkSortField.ESTIMATED_END_DATE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'estimatedEndDateMin',
        maxKey: 'estimatedEndDateMax',
      },
    },
    endDate: {
      label: 'Data Fim',
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => false,
      filter: {
        column: WorkSortField.END_DATE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'endDateMin',
        maxKey: 'endDateMax',
      },
    },
    clientName: {
      label: 'Cliente',
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.client,
      filter: {
        column: WorkSortField.CLIENT_NAME,
        kind: TableFilterKind.TEXT,
        valueKey: 'clientName',
      },
    },
  };

  static isValid(work: WorkType): boolean {
    return Object.values(Work.configs).every((config) => !config.isInvalid(work));
  }
}
