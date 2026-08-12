<template>
  <BaseDialog v-model="show">
    <h2>Editar compensação do colaborador {{ worker.name }}</h2>

    <div v-if="worker.currentWorkerCompensation" class="dialog-form">
      <div class="form-group">
        <label>Desde</label>
        <DateInput
          :value="worker.currentWorkerCompensation.validFrom!"
          :is-invalid="!worker.currentWorkerCompensation.validFrom"
          :is-disabled="false"
          @update:value="worker.currentWorkerCompensation.validFrom = $event"
        />
      </div>

      <div class="form-group">
        <label>Horas Dia (Padrão)</label>
        <NumberInput
          :entity="worker.currentWorkerCompensation"
          :value="worker.currentWorkerCompensation.defaultHours!"
          :is-invalid="!worker.currentWorkerCompensation.defaultHours"
          :is-disabled="false"
          field-key="defaultHours"
          @update:value="worker.currentWorkerCompensation.defaultHours = $event"
        />
      </div>

      <div class="form-group">
        <label>Valor Hora (€)</label>
        <MoneyInput
          :entity="worker.currentWorkerCompensation"
          :value="worker.currentWorkerCompensation.hourRate!"
          :is-invalid="worker.workerContractType == 'CONTRACTOR' && !worker.currentWorkerCompensation.hourRate"
          :is-disabled="worker.workerContractType == 'INTERNAL'"
          field-key="hourRate"
          @update:value="worker.currentWorkerCompensation.hourRate = $event"
        />
      </div>

      <div class="form-group">
        <label>Ordenado Base Mensal (€)</label>
        <MoneyInput
          :entity="worker.currentWorkerCompensation"
          :value="worker.currentWorkerCompensation.monthlySalary!"
          :is-invalid="worker.workerContractType == 'INTERNAL' && !worker.currentWorkerCompensation.monthlySalary"
          :is-disabled="worker.workerContractType == 'CONTRACTOR'"
          field-key="monthlySalary"
          @update:value="worker.currentWorkerCompensation.monthlySalary = $event"
        />
      </div>

      <div class="form-group">
        <label>TSU Empresa (%)</label>
        <PercentageInput
          :entity="worker.currentWorkerCompensation"
          :value="worker.currentWorkerCompensation.tsu!"
          :is-invalid="worker.workerContractType == 'INTERNAL' && !worker.currentWorkerCompensation.tsu"
          :is-disabled="worker.workerContractType == 'CONTRACTOR'"
          field-key="tsu"
          @update:value="worker.currentWorkerCompensation.tsu = $event"
        />
      </div>

      <div class="form-group">
        <label>Subsídio Alim. /Dia (€)</label>
        <MoneyInput
          :entity="worker.currentWorkerCompensation"
          :value="worker.currentWorkerCompensation.mealAllowance!"
          :is-invalid="worker.workerContractType == 'INTERNAL' && !worker.currentWorkerCompensation.mealAllowance"
          :is-disabled="worker.workerContractType == 'CONTRACTOR'"
          field-key="mealAllowance"
          @update:value="worker.currentWorkerCompensation.mealAllowance = $event"
        />
      </div>

      <div class="form-group">
        <label>Seguro Ac. Trabalho (€/mês)</label>
        <MoneyInput
          :entity="worker.currentWorkerCompensation"
          :value="worker.currentWorkerCompensation.accidentInsurance!"
          :is-invalid="worker.workerContractType == 'INTERNAL' && !worker.currentWorkerCompensation.accidentInsurance"
          :is-disabled="worker.workerContractType == 'CONTRACTOR'"
          field-key="accidentInsurance"
          @update:value="worker.currentWorkerCompensation.accidentInsurance = $event"
        />
      </div>
    </div>

    <div class="actions">
      <button class="btn" @click="show = false">
        <Delete :size="18" />
        Cancelar
      </button>

      <button class="btn" :disabled="!isValid()" @click="save">
        <Save :size="18" />
        Guardar
      </button>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog.vue';
import { WorkerType } from '@/types/worker-type';
import { Delete, Save } from 'lucide-vue-next';
import { computed, reactive, watch } from 'vue';
import DateInput from './inputs/DateInput.vue';
import NumberInput from './inputs/NumberInput.vue';
import PercentageInput from './inputs/PercentageInput.vue';
import MoneyInput from './inputs/MoneyInput.vue';

const props = defineProps<{
  modelValue: boolean;
  worker: WorkerType | null;
}>();

const emit = defineEmits<{
  'update:modelValue': [boolean];
  save: [WorkerType];
}>();

const show = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const worker = reactive<WorkerType>({} as WorkerType);

watch(
  () => props.worker,
  (newWorker) => {
    if (!newWorker) return;

    Object.assign(worker, JSON.parse(JSON.stringify(newWorker)));

    worker.currentWorkerCompensation!.validFrom = '';
  },
  {
    immediate: true,
  },
);

function isValid(): boolean {
  const compensation = worker.currentWorkerCompensation;

  if (!compensation) return false;

  if (!compensation.validFrom || !compensation.defaultHours) {
    return false;
  }

  if (worker.workerContractType === 'CONTRACTOR') {
    return !!compensation.hourRate;
  }

  return !!(
    compensation.monthlySalary &&
    compensation.tsu &&
    compensation.mealAllowance &&
    compensation.accidentInsurance
  );
}

function save() {
  emit('save', { ...worker });
}
</script>
