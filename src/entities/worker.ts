import { ColumnType, Configs, TableRow } from '@/types/entity-configs';
import { EnumOptions } from '@/types/select-options';
import { TableFilterKind } from '@/types/table-filter';
import { WorkerType, WorkerSortField } from '@/types/worker-type';
import { isValidEmail, isValidPhone } from '@/utils/validation';

export class Worker {
  static getConfigs(
    statusOptions: EnumOptions,
    workerContractTypeOptions: EnumOptions,
  ): Configs<WorkerSortField, WorkerType> {
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
          column: WorkerSortField.CODE,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'code',
          },
          dropdownAlign: 'start',
        },
      },
      name: {
        label: 'Nome',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (worker: WorkerType) => !worker.name,
          isHighlight: true,
          columnStyle: {
            width: '150px',
          },
        },
        filterConfig: {
          column: WorkerSortField.NAME,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'name',
          },
          dropdownAlign: 'start',
        },
      },
      nif: {
        label: 'NIF',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (worker: WorkerType) => !worker.nif,
          columnStyle: {
            width: '95px',
          },
        },
        filterConfig: {
          column: WorkerSortField.NIF,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'nif',
          },
          dropdownAlign: 'start',
        },
      },
      status: {
        label: 'Estado',
        type: ColumnType.SELECT,
        selectConfig: {
          options: Object.values(statusOptions),
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (worker: WorkerType) => !worker.status,
          columnStyle: {
            width: '90px',
          },
        },
        filterConfig: {
          column: WorkerSortField.STATUS,
          kind: TableFilterKind.SELECT,
          valueConfig: {
            valueKey: 'status',
          },
        },
      },
      phone: {
        label: 'Tlf',
        type: ColumnType.PHONE,
        phoneConfig: {
          secondaryField: 'phoneCountryCode',
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (worker: WorkerType) => !isValidPhone(worker.phone),
          columnStyle: {
            width: '140px',
          },
        },
        filterConfig: {
          column: WorkerSortField.PHONE,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'phone',
          },
        },
      },
      email: {
        label: 'E-mail',
        type: ColumnType.EMAIL,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (worker: WorkerType) => !isValidEmail(worker.email),
          columnStyle: {
            width: '150px',
          },
        },
        filterConfig: {
          column: WorkerSortField.EMAIL,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'email',
          },
        },
      },
      function: {
        label: 'Função',
        type: ColumnType.TEXT,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (worker: WorkerType) => !worker.function,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkerSortField.FUNCTION,
          kind: TableFilterKind.TEXT,
          valueConfig: {
            valueKey: 'function',
          },
        },
      },
      hourCost: {
        label: 'Valor/Hora Base (€)',
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
          column: WorkerSortField.HOUR_COST,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            minKey: 'hourCostMin',
            maxKey: 'hourCostMax',
          },
        },
      },
      defaultHours: {
        label: 'Horas Dia (Padrão)',
        type: ColumnType.NUMBER,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (worker: WorkerType) => !worker.defaultHours,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkerSortField.DEFAULT_HOURS,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            minKey: 'defaultHoursMin',
            maxKey: 'defaultHoursMax',
          },
        },
      },
      workerContractType: {
        label: 'Tipo de Contracto',
        type: ColumnType.SELECT,
        onValueChanged: onContractTypeChanged,
        selectConfig: {
          options: Object.values(workerContractTypeOptions),
        },
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (worker: WorkerType) => !worker.workerContractType,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkerSortField.WORKER_CONTRACT_TYPE,
          kind: TableFilterKind.SELECT,
          valueConfig: {
            valueKey: 'workerContractType',
          },
        },
      },
      hourRate: {
        label: 'Valor Hora (€)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: (worker: WorkerType) =>
            !worker.workerContractType || worker.workerContractType === workerContractTypeOptions.INTERNAL.code,
          isInvalid: (worker: WorkerType) =>
            worker.workerContractType === workerContractTypeOptions.CONTRACTOR.code && !worker.hourRate,
          columnStyle: {
            width: '80px',
          },
        },
        filterConfig: {
          column: WorkerSortField.HOUR_RATE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            minKey: 'hourRateMin',
            maxKey: 'hourRateMax',
          },
        },
      },
      monthlySalary: {
        label: 'Ordenado Base Mensal (€)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: (worker: WorkerType) =>
            !worker.workerContractType || worker.workerContractType === workerContractTypeOptions.CONTRACTOR.code,
          isInvalid: (worker: WorkerType) =>
            worker.workerContractType === workerContractTypeOptions.INTERNAL.code && !worker.monthlySalary,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkerSortField.MONTHLY_SALARY,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            minKey: 'monthlySalaryMin',
            maxKey: 'monthlySalaryMax',
          },
        },
      },
      tsu: {
        label: 'TSU Empresa (%)',
        type: ColumnType.PERCENTAGE,
        styleConfig: {
          showDisabled: (worker: WorkerType) =>
            !worker.workerContractType || worker.workerContractType === workerContractTypeOptions.CONTRACTOR.code,
          isInvalid: (worker: WorkerType) =>
            worker.workerContractType === workerContractTypeOptions.INTERNAL.code && !worker.tsu,
          columnStyle: {
            width: '80px',
          },
        },
        filterConfig: {
          column: WorkerSortField.TSU,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            minKey: 'tsuMin',
            maxKey: 'tsuMax',
          },
        },
      },
      mealAllowance: {
        label: 'Subsídio Alim. /Dia (€)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: (worker: WorkerType) =>
            !worker.workerContractType || worker.workerContractType === workerContractTypeOptions.CONTRACTOR.code,
          isInvalid: (worker: WorkerType) =>
            worker.workerContractType === workerContractTypeOptions.INTERNAL.code && !worker.mealAllowance,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkerSortField.MEAL_ALLOWANCE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            minKey: 'mealAllowanceMin',
            maxKey: 'mealAllowanceMax',
          },
        },
      },
      accidentInsurance: {
        label: 'Seguro Ac. Trabalho (€/mês)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: (worker: WorkerType) =>
            !worker.workerContractType || worker.workerContractType === workerContractTypeOptions.CONTRACTOR.code,
          isInvalid: (worker: WorkerType) =>
            worker.workerContractType === workerContractTypeOptions.INTERNAL.code && !worker.accidentInsurance,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkerSortField.ACCIDENT_INSURANCE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            minKey: 'accidentInsuranceMin',
            maxKey: 'accidentInsuranceMax',
          },
        },
      },
      startDate: {
        label: 'Data Admissão',
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: (worker: WorkerType) => !worker.startDate,
          columnStyle: {
            width: '130px',
          },
        },
        filterConfig: {
          column: WorkerSortField.START_DATE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            minKey: 'startDateMin',
            maxKey: 'startDateMax',
          },
        },
      },
      endDate: {
        label: 'Data Cessação',
        type: ColumnType.DATE,
        styleConfig: {
          showDisabled: () => false,
          isInvalid: () => false,
          columnStyle: {
            width: '130px',
          },
        },
        filterConfig: {
          column: WorkerSortField.END_DATE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            minKey: 'endDateMin',
            maxKey: 'endDateMax',
          },
        },
      },
    };
  }

  static isValid(worker: WorkerType, configs: Configs<WorkerSortField, WorkerType>): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(worker));
  }
}

function onContractTypeChanged(row: TableRow<WorkerType>) {
  row._isEdited = true;

  if (row.entity.workerContractType === 'INTERNAL' && row.entity.tsu == null) {
    row.entity.tsu = 23.75;
    row.entity.hourRate = undefined;
  }

  if (row.entity.workerContractType === 'CONTRACTOR') {
    row.entity.tsu = undefined;
    row.entity.monthlySalary = undefined;
    row.entity.mealAllowance = undefined;
    row.entity.accidentInsurance = undefined;
  }
}
