<template>
  <BaseDialog v-model="show">
    <h2>Editar compensação do colaborador {{ worker.name }}</h2>

    <div v-if="worker.currentWorkerCompensation" class="dialog-form">
      <div class="form-group">
        <label>Desde</label>
        <input
          type="date"
          :class="{ required: !worker.currentWorkerCompensation.validFrom }"
          v-model="worker.currentWorkerCompensation.validFrom"
        />
      </div>

      <div class="form-group">
        <label>Horas Dia (Padrão)</label>
        <input
          :value="formatNumber(worker.currentWorkerCompensation.defaultHours)"
          type="text"
          inputmode="decimal"
          :class="{ required: !worker.currentWorkerCompensation.defaultHours }"
          @input="handleNumberInput($event, worker.currentWorkerCompensation, 'defaultHours')"
        />
      </div>

      <div class="form-group">
        <label>Valor Hora (€)</label>
        <input
          :value="formatNumber(worker.currentWorkerCompensation.hourRate)"
          type="text"
          inputmode="decimal"
          :disabled="worker.workerContractType == 'INTERNAL'"
          :class="{ required: worker.workerContractType == 'CONTRACTOR' && !worker.currentWorkerCompensation.hourRate }"
          @input="handleMoneyInput($event, worker.currentWorkerCompensation, 'hourRate')"
        />
      </div>

      <div class="form-group">
        <label>Ordenado Base Mensal (€)</label>
        <input
          :value="formatNumber(worker.currentWorkerCompensation.monthlySalary)"
          type="text"
          inputmode="decimal"
          :disabled="worker.workerContractType == 'CONTRACTOR'"
          :class="{
            required: worker.workerContractType == 'INTERNAL' && !worker.currentWorkerCompensation.monthlySalary,
          }"
          @input="handleNumberInput($event, worker.currentWorkerCompensation, 'monthlySalary')"
        />
      </div>

      <div class="form-group">
        <label>TSU Empresa (%)</label>
        <input
          :value="formatNumber(worker.currentWorkerCompensation.tsu)"
          type="text"
          inputmode="decimal"
          :disabled="worker.workerContractType == 'CONTRACTOR'"
          :class="{ required: worker.workerContractType == 'INTERNAL' && !worker.currentWorkerCompensation.tsu }"
          @input="handleMoneyInput($event, worker.currentWorkerCompensation, 'tsu')"
        />
      </div>

      <div class="form-group">
        <label>Subsídio Alim. /Dia (€)</label>
        <input
          :value="formatNumber(worker.currentWorkerCompensation.mealAllowance)"
          type="text"
          inputmode="decimal"
          :disabled="worker.workerContractType == 'CONTRACTOR'"
          :class="{
            required: worker.workerContractType == 'INTERNAL' && !worker.currentWorkerCompensation.mealAllowance,
          }"
          @input="handleMoneyInput($event, worker.currentWorkerCompensation, 'mealAllowance')"
        />
      </div>

      <div class="form-group">
        <label>Seguro Ac. Trabalho (€/mês)</label>
        <input
          :value="formatNumber(worker.currentWorkerCompensation.accidentInsurance)"
          type="text"
          inputmode="decimal"
          :disabled="worker.workerContractType == 'CONTRACTOR'"
          :class="{
            required: worker.workerContractType == 'INTERNAL' && !worker.currentWorkerCompensation.accidentInsurance,
          }"
          @input="handleMoneyInput($event, worker.currentWorkerCompensation, 'accidentInsurance')"
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
import { handleMoneyInput } from '@/utils/handle-money-input';
import { handleNumberInput } from '@/utils/handle-number-input';
import { formatNumber } from '@/utils/validation';
import { Delete, Save } from 'lucide-vue-next';
import { computed, reactive, watch } from 'vue';

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
