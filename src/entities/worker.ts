import { ColumnType, EntityConfig, TableRow } from '@/types/entity-configs';
import { Status } from '@/types/status';
import { TableFilterKind } from '@/types/table-filter';
import { WorkerType, WorkerContractType, WorkerSortField } from '@/types/worker-type';
import { isValidEmail, isValidPhone } from '@/utils/validation';

export class Worker {
  static readonly configs: Record<string, EntityConfig<WorkerType, WorkerSortField>> = {
    code: {
      label: 'ID',
      type: ColumnType.TEXT,
      showDisabled: (worker: WorkerType) => true,
      isInvalid: (worker: WorkerType) => false,
      filter: {
        column: WorkerSortField.CODE,
        kind: TableFilterKind.TEXT,
        valueKey: 'code',
        dropdownAlign: 'start',
      },
      columnStyle: {
        width: '90px',
      },
    },
    name: {
      label: 'Nome',
      type: ColumnType.TEXT,
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !worker.name,
      isHighlight: true,
      filter: {
        column: WorkerSortField.NAME,
        kind: TableFilterKind.TEXT,
        valueKey: 'name',
        dropdownAlign: 'start',
      },
      columnStyle: {
        width: '150px',
      },
    },
    nif: {
      label: 'NIF',
      type: ColumnType.TEXT,
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !worker.nif,
      filter: {
        column: WorkerSortField.NIF,
        kind: TableFilterKind.TEXT,
        valueKey: 'nif',
        dropdownAlign: 'start',
      },
      columnStyle: {
        width: '95px',
      },
    },
    status: {
      label: 'Estado',
      type: ColumnType.SELECT,
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !worker.status,
      options: Status.OPTIONS,
      filter: {
        column: WorkerSortField.STATUS,
        kind: TableFilterKind.SELECT,
        valueKey: 'status',
      },
      columnStyle: {
        width: '90px',
      },
    },
    phone: {
      label: 'Tlf',
      type: ColumnType.PHONE,
      secondaryField: 'phoneCountryCode',
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !isValidPhone(worker.phone),
      filter: {
        column: WorkerSortField.PHONE,
        kind: TableFilterKind.TEXT,
        valueKey: 'phone',
      },
      columnStyle: {
        width: '140px',
      },
    },
    email: {
      label: 'E-mail',
      type: ColumnType.EMAIL,
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !isValidEmail(worker.email),
      filter: {
        column: WorkerSortField.EMAIL,
        kind: TableFilterKind.TEXT,
        valueKey: 'email',
      },
      columnStyle: {
        width: '150px',
      },
    },
    function: {
      label: 'Função',
      type: ColumnType.TEXT,
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !worker.function,
      filter: {
        column: WorkerSortField.FUNCTION,
        kind: TableFilterKind.TEXT,
        valueKey: 'function',
      },
      columnStyle: {
        width: '100px',
      },
    },
    hourCost: {
      label: 'Valor/Hora Base (€)',
      type: ColumnType.MONEY,
      showDisabled: (worker: WorkerType) => true,
      isInvalid: (worker: WorkerType) => false,
      isHighlight: true,
      filter: {
        column: WorkerSortField.HOUR_COST,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'hourCostMin',
        maxKey: 'hourCostMax',
      },
      columnStyle: {
        width: '100px',
      },
    },
    defaultHours: {
      label: 'Horas Dia (Padrão)',
      type: ColumnType.NUMBER,
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !worker.defaultHours,
      filter: {
        column: WorkerSortField.DEFAULT_HOURS,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'defaultHoursMin',
        maxKey: 'defaultHoursMax',
      },
      columnStyle: {
        width: '100px',
      },
    },
    workerContractType: {
      label: 'Tipo de Contracto',
      type: ColumnType.SELECT,
      onValueChanged: onContractTypeChanged,
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !worker.workerContractType,
      options: WorkerContractType.OPTIONS,
      filter: {
        column: WorkerSortField.WORKER_CONTRACT_TYPE,
        kind: TableFilterKind.SELECT,
        valueKey: 'workerContractType',
      },
      columnStyle: {
        width: '100px',
      },
    },
    hourRate: {
      label: 'Valor Hora (€)',
      type: ColumnType.MONEY,
      showDisabled: (worker: WorkerType) =>
        !worker.workerContractType || worker.workerContractType === WorkerContractType.INTERNAL,
      isInvalid: (worker: WorkerType) =>
        worker.workerContractType === WorkerContractType.CONTRACTOR && !worker.hourRate,
      filter: {
        column: WorkerSortField.HOUR_RATE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'hourRateMin',
        maxKey: 'hourRateMax',
      },
      columnStyle: {
        width: '80px',
      },
    },
    monthlySalary: {
      label: 'Ordenado Base Mensal (€)',
      type: ColumnType.MONEY,
      showDisabled: (worker: WorkerType) =>
        !worker.workerContractType || worker.workerContractType === WorkerContractType.CONTRACTOR,
      isInvalid: (worker: WorkerType) =>
        worker.workerContractType === WorkerContractType.INTERNAL && !worker.monthlySalary,
      filter: {
        column: WorkerSortField.MONTHLY_SALARY,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'monthlySalaryMin',
        maxKey: 'monthlySalaryMax',
      },
      columnStyle: {
        width: '100px',
      },
    },
    tsu: {
      label: 'TSU Empresa (%)',
      type: ColumnType.PERCENTAGE,
      showDisabled: (worker: WorkerType) =>
        !worker.workerContractType || worker.workerContractType === WorkerContractType.CONTRACTOR,
      isInvalid: (worker: WorkerType) => worker.workerContractType === WorkerContractType.INTERNAL && !worker.tsu,
      filter: {
        column: WorkerSortField.TSU,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'tsuMin',
        maxKey: 'tsuMax',
      },
      columnStyle: {
        width: '80px',
      },
    },
    mealAllowance: {
      label: 'Subsídio Alim. /Dia (€)',
      type: ColumnType.MONEY,
      showDisabled: (worker: WorkerType) =>
        !worker.workerContractType || worker.workerContractType === WorkerContractType.CONTRACTOR,
      isInvalid: (worker: WorkerType) =>
        worker.workerContractType === WorkerContractType.INTERNAL && !worker.mealAllowance,
      filter: {
        column: WorkerSortField.MEAL_ALLOWANCE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'mealAllowanceMin',
        maxKey: 'mealAllowanceMax',
      },
      columnStyle: {
        width: '100px',
      },
    },
    accidentInsurance: {
      label: 'Seguro Ac. Trabalho (€/mês)',
      type: ColumnType.MONEY,
      showDisabled: (worker: WorkerType) =>
        !worker.workerContractType || worker.workerContractType === WorkerContractType.CONTRACTOR,
      isInvalid: (worker: WorkerType) =>
        worker.workerContractType === WorkerContractType.INTERNAL && !worker.accidentInsurance,
      filter: {
        column: WorkerSortField.ACCIDENT_INSURANCE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'accidentInsuranceMin',
        maxKey: 'accidentInsuranceMax',
      },
      columnStyle: {
        width: '100px',
      },
    },
    startDate: {
      label: 'Data Admissão',
      type: ColumnType.DATE,
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !worker.startDate,
      filter: {
        column: WorkerSortField.START_DATE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'startDateMin',
        maxKey: 'startDateMax',
      },
      columnStyle: {
        width: '130px',
      },
    },
    endDate: {
      label: 'Data Cessação',
      type: ColumnType.DATE,
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => false,
      filter: {
        column: WorkerSortField.END_DATE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'endDateMin',
        maxKey: 'endDateMax',
      },
      columnStyle: {
        width: '130px',
      },
    },
  };

  static isValid(worker: WorkerType): boolean {
    return Object.values(Worker.configs).every((config) => !config.isInvalid(worker));
  }
}

function onContractTypeChanged(row: TableRow<WorkerType>) {
  row._isEdited = true;

  if (row.entity.workerContractType === WorkerContractType.INTERNAL && row.entity.tsu == null) {
    row.entity.tsu = 23.75;
    row.entity.hourRate = undefined;
  }

  if (row.entity.workerContractType === WorkerContractType.CONTRACTOR) {
    row.entity.tsu = undefined;
    row.entity.monthlySalary = undefined;
    row.entity.mealAllowance = undefined;
    row.entity.accidentInsurance = undefined;
  }
}
