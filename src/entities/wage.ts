import { ColumnType, Configs, RangeFilterValueType } from '@/types/entity-configs';
import { TableFilterKind } from '@/types/table-filter';
import { EnumOptions } from '@/types/select-options';
import { WageSortField, WageType } from '@/types/wage-type';

export class Wage {
  static getConfigs(paymentMethodOptions: EnumOptions): Configs<WageSortField, WageType> {
    return {
      code: {
        label: 'ID',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WageSortField.CODE,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'code',
          },
          dropdownAlign: 'start',
        },
      },
      year: {
        label: 'Ano',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '50px',
          },
        },
        filterConfig: {
          column: WageSortField.YEAR,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'yearMin',
            maxKey: 'yearMax',
          },
        },
      },
      month: {
        label: 'Mês',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '50px',
          },
        },
        filterConfig: {
          column: WageSortField.MONTH,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'monthMin',
            maxKey: 'monthMax',
          },
        },
      },
      workerCode: {
        label: 'ID Colaborador',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '80px',
          },
        },
        filterConfig: {
          column: WageSortField.WORKER_CODE,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'workerCode',
          },
        },
      },
      workerName: {
        label: 'Nome Colaborador',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WageSortField.WORKER_NAME,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'workerName',
          },
        },
      },
      expectedWage: {
        label: 'Salário Estimado',
        type: ColumnType.MONEY,
        additionalInfo: {
          tooltipTitle: 'Salário estimado',
          tooltipInfo: [
            'Colaboradores Internos: salário mensal + custo horas extra - custo horas não pagas + sub. alimentação * dias úteis mês',
            'Colaboradores Externos: total de horas * valor hora',
          ],
        },
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WageSortField.EXPECTED_WAGE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'expectedWageMin',
            maxKey: 'expectedWageMax',
          },
        },
      },
      expectedExtraHours: {
        label: 'Custo Estimado Horas Extras',
        type: ColumnType.MONEY,
        additionalInfo: {
          tooltipTitle: 'Custo estimado horas extras',
          tooltipInfo: [
            'Colaboradores Internos: horas extras * valor hora',
            'Colaboradores Externos: horas extras * valor hora',
          ],
        },
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WageSortField.EXPECTED_EXTRA_HOURS,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'expectedExtraHoursMin',
            maxKey: 'expectedExtraHoursMax',
          },
        },
      },
      expectedDeductions: {
        label: 'Custo Estimado Horas Não Pagas',
        type: ColumnType.MONEY,
        additionalInfo: {
          tooltipTitle: 'Custo estimado horas não pagas',
          tooltipInfo: ['Colaboradores Internos: horas não pagas * valor hora', 'Colaboradores Externos: N/A'],
        },
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WageSortField.EXPECTED_DEDUCTIONS,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'expectedDeductionsMin',
            maxKey: 'expectedDeductionsMax',
          },
        },
      },
      expectedInternalCost: {
        label: 'Custo Interno Estimado',
        type: ColumnType.MONEY,
        additionalInfo: {
          tooltipTitle: 'Custo interno estimado',
          tooltipInfo: [
            'Colaboradores Internos: salário estimado + acidentes de trabalho + valor TSU (sobre o salário base)',
            'Colaboradores Externos: salário estimado',
          ],
        },
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WageSortField.EXPECTED_DEDUCTIONS,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'expectedInternalCostMin',
            maxKey: 'expectedInternalCostMax',
          },
        },
      },
      paidValue: {
        label: 'Valor Pago',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (wage: WageType) => !wage.paidValue,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WageSortField.PAID_VALUE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'paidValueMin',
            maxKey: 'paidValueMax',
          },
        },
      },
      paidDate: {
        label: 'Data Pagamento',
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (wage: WageType) => !wage.paidDate,
          columnStyle: {
            width: '80px',
          },
        },
        filterConfig: {
          column: WageSortField.PAID_VALUE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            minKey: 'paidDateMin',
            maxKey: 'paidDateMax',
          },
        },
      },
      paymentMethod: {
        label: 'Método Pagamento',
        type: ColumnType.SELECT,
        selectConfig: {
          options: Object.values(paymentMethodOptions),
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (wage: WageType) => !wage.paymentMethod,
          columnStyle: {
            width: '90px',
          },
        },
        filterConfig: {
          column: WageSortField.PAYMENT_METHOD,
          kind: TableFilterKind.SELECT,
          valueConfig: {
            valueKey: 'paymentMethod',
          },
        },
      },
      notes: {
        label: 'Notas',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: () => false,
          columnStyle: {
            width: '150px',
          },
        },
        filterConfig: {
          column: WageSortField.NOTES,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'notes',
          },
        },
      },
    };
  }

  static isValid(wage: WageType, configs: Configs<WageSortField, WageType>): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(wage));
  }
}
