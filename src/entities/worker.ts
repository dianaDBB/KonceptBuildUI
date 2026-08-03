import { ColumnType, Configs, RangeFilterValueType, TableRow } from '@/types/entity-configs';
import { EnumOptions } from '@/types/select-options';
import { TableFilterKind } from '@/types/table-filter';
import { WorkerType, WorkerSortField } from '@/types/worker-type';
import { formatCurrency, formatNumber, formatPercentage, isValidEmail, isValidPhone } from '@/utils/validation';

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
        displayValue: (worker: WorkerType) => worker.code,
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
        displayValue: (worker: WorkerType) => worker.name,
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
        displayValue: (worker: WorkerType) => worker.nif,
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
        displayValue: (worker: WorkerType) => (worker.status ? statusOptions[worker.status].label : undefined),
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
        displayValue: (worker: WorkerType) =>
          worker.phoneCountryCode && worker.phone ? `${worker.phoneCountryCode} ${worker.phone}` : undefined,
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
        displayValue: (worker: WorkerType) => worker.email,
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
        displayValue: (worker: WorkerType) => worker.function,
      },
      'currentWorkerCompensation.hourCost': {
        label: 'Custo Hora (€)',
        additionalInfo: {
          tooltipTitle: 'Custo à hora para a empresa',
          tooltipInfo: [
            'Para colaboradores "Contracto" este valor é calculado com base em 14 meses, tendo em conta o salário, TSU, sub. alimentação e acidentes de trabalho. (média 21 dias úteis)',
            'Para colaboradores "Hora" este valor é igual ao "Valor Hora"',
          ],
        },
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
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'hourCost',
          },
        },
        displayValue: (worker: WorkerType) => formatCurrency(worker.currentWorkerCompensation?.hourCost),
      },
      'currentWorkerCompensation.defaultHours': {
        label: 'Horas Dia (Padrão)',
        type: ColumnType.NUMBER,
        styleConfig: {
          showDisabled: (_worker: WorkerType, row) => !row?._isNew,
          isInvalid: (worker: WorkerType) => !worker.currentWorkerCompensation?.defaultHours,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkerSortField.DEFAULT_HOURS,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'defaultHours',
          },
        },
        displayValue: (worker: WorkerType) => formatNumber(worker.currentWorkerCompensation?.defaultHours),
      },
      workerContractType: {
        label: 'Tipo de Contrato',
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
        displayValue: (worker: WorkerType) =>
          worker.workerContractType ? workerContractTypeOptions[worker.workerContractType].label : undefined,
      },
      'currentWorkerCompensation.hourRate': {
        label: 'Valor Hora (€)',
        additionalInfo: {
          tooltipInfo: [
            'Para colaboradores "Contracto", este valor é calculado com base em 14 meses, tendo em conta apenas o salário (média 21 dias úteis).',
          ],
        },
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: (worker: WorkerType, row) =>
            row?._isNew
              ? !worker.workerContractType || worker.workerContractType === workerContractTypeOptions.INTERNAL.code
              : true,
          isInvalid: (worker: WorkerType) =>
            worker.workerContractType === workerContractTypeOptions.CONTRACTOR.code &&
            !worker.currentWorkerCompensation?.hourRate,
          columnStyle: {
            width: '90px',
          },
        },
        filterConfig: {
          column: WorkerSortField.HOUR_RATE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'hourRate',
          },
        },
        displayValue: (worker: WorkerType) => formatCurrency(worker.currentWorkerCompensation?.hourRate),
      },
      'currentWorkerCompensation.monthlySalary': {
        label: 'Ordenado Base Mensal (€)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: (worker: WorkerType, row) =>
            row?._isNew
              ? !worker.workerContractType || worker.workerContractType === workerContractTypeOptions.CONTRACTOR.code
              : true,
          isInvalid: (worker: WorkerType) =>
            worker.workerContractType === workerContractTypeOptions.INTERNAL.code &&
            !worker.currentWorkerCompensation?.monthlySalary,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkerSortField.MONTHLY_SALARY,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'monthlySalary',
          },
        },
        displayValue: (worker: WorkerType) => formatCurrency(worker.currentWorkerCompensation?.monthlySalary),
      },
      'currentWorkerCompensation.tsu': {
        label: 'TSU Empresa (%)',
        type: ColumnType.PERCENTAGE,
        styleConfig: {
          showDisabled: (worker: WorkerType, row) =>
            row?._isNew
              ? !worker.workerContractType || worker.workerContractType === workerContractTypeOptions.CONTRACTOR.code
              : true,
          isInvalid: (worker: WorkerType) =>
            worker.workerContractType === workerContractTypeOptions.INTERNAL.code &&
            !worker.currentWorkerCompensation?.tsu,
          columnStyle: {
            width: '80px',
          },
        },
        filterConfig: {
          column: WorkerSortField.TSU,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'tsu',
          },
        },
        displayValue: (worker: WorkerType) => formatPercentage(worker.currentWorkerCompensation?.tsu),
      },
      'currentWorkerCompensation.mealAllowance': {
        label: 'Subsídio Alim. /Dia (€)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: (worker: WorkerType, row) =>
            row?._isNew
              ? !worker.workerContractType || worker.workerContractType === workerContractTypeOptions.CONTRACTOR.code
              : true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkerSortField.MEAL_ALLOWANCE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'mealAllowance',
          },
        },
        displayValue: (worker: WorkerType) => formatCurrency(worker.currentWorkerCompensation?.mealAllowance),
      },
      'currentWorkerCompensation.accidentInsurance': {
        label: 'Seguro Ac. Trabalho (€/mês)',
        type: ColumnType.MONEY,
        styleConfig: {
          showDisabled: (worker: WorkerType, row) =>
            row?._isNew
              ? !worker.workerContractType || worker.workerContractType === workerContractTypeOptions.CONTRACTOR.code
              : true,
          isInvalid: () => false,
          columnStyle: {
            width: '100px',
          },
        },
        filterConfig: {
          column: WorkerSortField.ACCIDENT_INSURANCE,
          kind: TableFilterKind.NUMBER_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.NUMBER,
            valueKey: 'accidentInsurance',
          },
        },
        displayValue: (worker: WorkerType) => formatCurrency(worker.currentWorkerCompensation?.accidentInsurance),
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
          kind: TableFilterKind.DATE_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            valueKey: 'startDate',
          },
        },
        displayValue: (worker: WorkerType) => worker.startDate,
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
          kind: TableFilterKind.DATE_RANGE,
          valueConfig: {
            valueType: RangeFilterValueType.DATE,
            valueKey: 'endDateMin',
          },
        },
        displayValue: (worker: WorkerType) => worker.endDate,
      },
    };
  }

  static isValid(worker: WorkerType, configs: Configs<WorkerSortField, WorkerType>): boolean {
    return Object.values(configs).every((config) => !config.styleConfig.isInvalid(worker));
  }
}

function onContractTypeChanged(row: TableRow<WorkerType>) {
  row._isEdited = true;

  const compensation = row.entity.currentWorkerCompensation;
  if (!compensation) return;

  if (row.entity.workerContractType === 'INTERNAL' && compensation.tsu == null) {
    compensation.tsu = 23.75;
  }

  if (row.entity.workerContractType === 'CONTRACTOR') {
    compensation.tsu = undefined;
    compensation.monthlySalary = undefined;
    compensation.mealAllowance = undefined;
    compensation.accidentInsurance = undefined;
  }
}
