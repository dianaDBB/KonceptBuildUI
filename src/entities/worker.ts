import { EntityConfig } from '@/types/entity-configs';
import { Status } from '@/types/status';
import { TableFilterKind } from '@/types/table-filter';
import { WorkerType, WorkerContractType, WorkerSortField } from '@/types/worker-type';
import { isValidEmail, isValidPhone } from '@/utils/validation';

export class Worker {
  static readonly configs: Record<string, EntityConfig<WorkerType, WorkerSortField>> = {
    code: {
      label: 'ID',
      showDisabled: (worker: WorkerType) => true,
      isInvalid: (worker: WorkerType) => false,
      filter: {
        column: WorkerSortField.CODE,
        kind: TableFilterKind.TEXT,
        valueKey: 'code',
        dropdownAlign: 'start',
      },
    },
    name: {
      label: 'Nome',
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !worker.name,
      filter: {
        column: WorkerSortField.NAME,
        kind: TableFilterKind.TEXT,
        valueKey: 'name',
        dropdownAlign: 'start',
      },
    },
    nif: {
      label: 'NIF',
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !worker.nif,
      filter: {
        column: WorkerSortField.NIF,
        kind: TableFilterKind.TEXT,
        valueKey: 'nif',
        dropdownAlign: 'start',
      },
    },
    status: {
      label: 'Estado',
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !worker.status,
      options: Status.OPTIONS,
      filter: {
        column: WorkerSortField.STATUS,
        kind: TableFilterKind.SELECT,
        valueKey: 'status',
      },
    },
    phone: {
      label: 'Tlf',
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !isValidPhone(worker.phone),
      filter: {
        column: WorkerSortField.PHONE,
        kind: TableFilterKind.TEXT,
        valueKey: 'phone',
      },
    },
    email: {
      label: 'E-mail',
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !isValidEmail(worker.email),
      filter: {
        column: WorkerSortField.EMAIL,
        kind: TableFilterKind.TEXT,
        valueKey: 'email',
      },
    },
    function: {
      label: 'Função',
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !worker.function,
      filter: {
        column: WorkerSortField.FUNCTION,
        kind: TableFilterKind.TEXT,
        valueKey: 'function',
      },
    },
    hourCost: {
      label: 'Valor/Hora Base (€)',
      showDisabled: (worker: WorkerType) => true,
      isInvalid: (worker: WorkerType) => false,
      filter: {
        column: WorkerSortField.HOUR_COST,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'hourCostMin',
        maxKey: 'hourCostMax',
      },
    },
    defaultHours: {
      label: 'Horas Dia (Padrão)',
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !worker.defaultHours,
      filter: {
        column: WorkerSortField.DEFAULT_HOURS,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'defaultHoursMin',
        maxKey: 'defaultHoursMax',
      },
    },
    workerContractType: {
      label: 'Tipo de Contracto',
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !worker.workerContractType,
      options: WorkerContractType.OPTIONS,
      filter: {
        column: WorkerSortField.WORKER_CONTRACT_TYPE,
        kind: TableFilterKind.SELECT,
        valueKey: 'workerContractType',
      },
    },
    hourRate: {
      label: 'Valor Hora (€)',
      showDisabled: (worker: WorkerType) => worker.workerContractType === WorkerContractType.INTERNAL,
      isInvalid: (worker: WorkerType) =>
        worker.workerContractType === WorkerContractType.CONTRACTOR && !worker.hourRate,
      filter: {
        column: WorkerSortField.HOUR_RATE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'hourRateMin',
        maxKey: 'hourRateMax',
      },
    },
    monthlySalary: {
      label: 'Ordenado Base Mensal (€)',
      showDisabled: (worker: WorkerType) => worker.workerContractType === WorkerContractType.CONTRACTOR,
      isInvalid: (worker: WorkerType) =>
        worker.workerContractType === WorkerContractType.INTERNAL && !worker.monthlySalary,
      filter: {
        column: WorkerSortField.MONTHLY_SALARY,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'monthlySalaryMin',
        maxKey: 'monthlySalaryMax',
      },
    },
    tsu: {
      label: 'TSU Empresa (%)',
      showDisabled: (worker: WorkerType) => worker.workerContractType === WorkerContractType.CONTRACTOR,
      isInvalid: (worker: WorkerType) => worker.workerContractType === WorkerContractType.INTERNAL && !worker.tsu,
      filter: {
        column: WorkerSortField.TSU,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'tsuMin',
        maxKey: 'tsuMax',
      },
    },
    mealAllowance: {
      label: 'Subsídio Alim. /Dia (€)',
      showDisabled: (worker: WorkerType) => worker.workerContractType === WorkerContractType.CONTRACTOR,
      isInvalid: (worker: WorkerType) =>
        worker.workerContractType === WorkerContractType.INTERNAL && !worker.mealAllowance,
      filter: {
        column: WorkerSortField.MEAL_ALLOWANCE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'mealAllowanceMin',
        maxKey: 'mealAllowanceMax',
      },
    },
    accidentInsurance: {
      label: 'Seguro Ac. Trabalho (€/mês)',
      showDisabled: (worker: WorkerType) => worker.workerContractType === WorkerContractType.CONTRACTOR,
      isInvalid: (worker: WorkerType) =>
        worker.workerContractType === WorkerContractType.INTERNAL && !worker.accidentInsurance,
      filter: {
        column: WorkerSortField.ACCIDENT_INSURANCE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'accidentInsuranceMin',
        maxKey: 'accidentInsuranceMax',
      },
    },
    startDate: {
      label: 'Data Admissão',
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => !worker.startDate,
      filter: {
        column: WorkerSortField.START_DATE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'startDateMin',
        maxKey: 'startDateMax',
      },
    },
    endDate: {
      label: 'Data Cessação',
      showDisabled: (worker: WorkerType) => false,
      isInvalid: (worker: WorkerType) => false,
      filter: {
        column: WorkerSortField.END_DATE,
        kind: TableFilterKind.NUMBER_RANGE,
        minKey: 'endDateMin',
        maxKey: 'endDateMax',
      },
    },
  };

  static isValid(worker: WorkerType): boolean {
    return Object.values(Worker.configs).every((config) => !config.isInvalid(worker));
  }
}
