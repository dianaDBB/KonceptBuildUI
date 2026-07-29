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
        label: 'Colaborador',
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
      expectedPay: {
        label: 'Valor Estimado',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: () => true,
          isInvalid: () => false,
          columnStyle: {
            width: '80px',
          },
        },
        filterConfig: {
          column: WageSortField.EXPECTED_PAY,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            minKey: 'expectedPayMin',
            maxKey: 'expectedPayMax',
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
            width: '80px',
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
