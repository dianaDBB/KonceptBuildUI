import { ColumnType, EntityConfig } from '@/types/entity-configs';
import { TableFilterKind } from '@/types/table-filter';
import { WorkStatus } from '@/types/work-status';
import { WorkSortField, WorkType } from '@/types/work-type';
import { Client } from './client';
import { Status } from '@/types/status';

export class Work {
  static readonly configs: Record<string, EntityConfig<WorkType, WorkSortField>> = {
    code: {
      label: 'ID',
      type: ColumnType.TEXT,
      showDisabled: (work: WorkType) => true,
      isInvalid: (work: WorkType) => false,
      filter: {
        column: WorkSortField.CODE,
        kind: TableFilterKind.TEXT,
        valueKey: 'code',
        dropdownAlign: 'start',
      },
      columnStyle: {
        width: '90px',
      },
    },
    name: {
      label: 'Nome da Obra',
      type: ColumnType.TEXT,
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.name,
      filter: {
        column: WorkSortField.NAME,
        kind: TableFilterKind.TEXT,
        valueKey: 'name',
        dropdownAlign: 'start',
      },
      columnStyle: {
        width: '150px',
      },
    },
    status: {
      label: 'Estado',
      type: ColumnType.SELECT,
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.status,
      options: WorkStatus.OPTIONS,
      filter: {
        column: WorkSortField.STATUS,
        kind: TableFilterKind.SELECT,
        valueKey: 'status',
        dropdownAlign: 'start',
      },
      columnStyle: {
        width: '100px',
      },
    },
    contractedBudget: {
      label: 'Orçamento Adjudicado (€)',
      type: ColumnType.MONEY,
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.contractedBudget,
      filter: {
        column: WorkSortField.CONTRACTED_BUDGET,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'contractedBudgetMin',
        maxKey: 'contractedBudgetMax',
      },
      columnStyle: {
        width: '100px',
      },
    },
    estimatedCost: {
      label: 'Custo Previsto (€)',
      type: ColumnType.MONEY,
      showDisabled: (work: WorkType) => true,
      isInvalid: (work: WorkType) => false,
      filter: {
        column: WorkSortField.ESTIMATED_COST,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'estimatedCostMin',
        maxKey: 'estimatedCostMax',
      },
      columnStyle: {
        width: '100px',
      },
    },
    estimatedCostMaterials: {
      label: 'Custo Previsto Materiais (€)',
      type: ColumnType.MONEY,
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.estimatedCostMaterials,
      filter: {
        column: WorkSortField.ESTIMATED_COST_MATERIALS,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'estimatedCostMaterialMin',
        maxKey: 'estimatedCostMaterialMax',
      },
      columnStyle: {
        width: '100px',
      },
    },
    estimatedCostLabor: {
      label: 'Custo Previsto Mão-Obra (€)',
      type: ColumnType.MONEY,
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.estimatedCostLabor,
      filter: {
        column: WorkSortField.ESTIMATED_COST_LABOR,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'estimatedCostLaborMin',
        maxKey: 'estimatedCostLaborMax',
      },
      columnStyle: {
        width: '100px',
      },
    },
    estimatedMarginEur: {
      label: 'Margem Prevista (€)',
      type: ColumnType.MONEY,
      showDisabled: (work: WorkType) => true,
      isInvalid: (work: WorkType) => false,
      filter: {
        column: WorkSortField.ESTIMATED_MARGIN_EUR,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'estimatedMarginEurMin',
        maxKey: 'estimatedMarginEurMax',
      },
      columnStyle: {
        width: '100px',
      },
    },
    estimatedMarginPercentual: {
      label: 'Margem Prevista (%)',
      type: ColumnType.PERCENTAGE,
      showDisabled: (work: WorkType) => true,
      isInvalid: (work: WorkType) => false,
      filter: {
        column: WorkSortField.ESTIMATED_MARGIN_PERCENTUAL,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'estimatedMarginPercentualMin',
        maxKey: 'estimatedMarginPercentualMax',
      },
      columnStyle: {
        width: '130px',
      },
    },
    startDate: {
      label: 'Data início',
      type: ColumnType.DATE,
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.startDate,
      filter: {
        column: WorkSortField.START_DATE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'startDateMin',
        maxKey: 'startDateMax',
      },
      columnStyle: {
        width: '130px',
      },
    },
    estimatedEndDate: {
      label: 'Data Fim Prevista',
      type: ColumnType.DATE,
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.estimatedEndDate,
      filter: {
        column: WorkSortField.ESTIMATED_END_DATE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'estimatedEndDateMin',
        maxKey: 'estimatedEndDateMax',
      },
      columnStyle: {
        width: '130px',
      },
    },
    endDate: {
      label: 'Data Fim',
      type: ColumnType.DATE,
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => false,
      filter: {
        column: WorkSortField.END_DATE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'endDateMin',
        maxKey: 'endDateMax',
      },
      columnStyle: {
        width: '130px',
      },
    },
    client: {
      label: 'Cliente',
      type: ColumnType.SEARCH_SELECT,
      showDisabled: (work: WorkType) => false,
      isInvalid: (work: WorkType) => !work.client,
      filter: {
        column: WorkSortField.CLIENT_NAME,
        kind: TableFilterKind.TEXT,
        valueKey: 'clientName',
      },
      columnStyle: {
        width: '200px',
      },

      searchSelect: {
        options: [],
        selected: (client) => client.companyName,
        optionLines: (client) => [client.companyName, client.nif, client.code],
        filter: (client) => `${client.companyName} ${client.nif} ${client.code}`,
        tooltipTitle: (client) => client.companyName,
        tooltipItems: (client) => [
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
    },
  };

  static isValid(work: WorkType): boolean {
    return Object.values(Work.configs).every((config) => !config.isInvalid(work));
  }
}
