<template>
  <BaseDialog v-model="show">
    <h2>Editar compensação do colaborador {{ compensation.worker?.name }}</h2>

    <div class="dialog-form">
      <div class="form-group">
        <label>Desde</label>
        <input type="date" :class="{ required: !compensation.validFrom }" v-model="compensation.validFrom" />
      </div>

      <div class="form-group">
        <label>Horas Dia (Padrão)</label>
        <input
          :value="formatNumber(compensation.defaultHours)"
          type="text"
          inputmode="decimal"
          :class="{ required: !compensation.defaultHours }"
          @input="handleNumberInput($event, compensation, 'defaultHours')"
        />
      </div>

      <div class="form-group">
        <label>Valor Hora (€)</label>
        <input
          :value="formatNumber(compensation.hourRate)"
          type="text"
          inputmode="decimal"
          :disabled="compensation.worker?.workerContractType == 'INTERNAL'"
          :class="{ required: compensation.worker?.workerContractType == 'CONTRACTOR' && !compensation.hourRate }"
          @input="handleMoneyInput($event, compensation, 'hourRate')"
        />
      </div>

      <div class="form-group">
        <label>Ordenado Base Mensal (€)</label>
        <input
          :value="formatNumber(compensation.monthlySalary)"
          type="text"
          inputmode="decimal"
          :disabled="compensation.worker?.workerContractType == 'CONTRACTOR'"
          :class="{ required: compensation.worker?.workerContractType == 'INTERNAL' && !compensation.monthlySalary }"
          @input="handleNumberInput($event, compensation, 'monthlySalary')"
        />
      </div>

      <div class="form-group">
        <label>TSU Empresa (%)</label>
        <input
          :value="formatNumber(compensation.tsu)"
          type="text"
          inputmode="decimal"
          :disabled="compensation.worker?.workerContractType == 'CONTRACTOR'"
          :class="{ required: compensation.worker?.workerContractType == 'INTERNAL' && !compensation.tsu }"
          @input="handleMoneyInput($event, compensation, 'tsu')"
        />
      </div>

      <div class="form-group">
        <label>Subsídio Alim. /Dia (€)</label>
        <input
          :value="formatNumber(compensation.mealAllowance)"
          type="text"
          inputmode="decimal"
          :disabled="compensation.worker?.workerContractType == 'CONTRACTOR'"
          :class="{ required: compensation.worker?.workerContractType == 'INTERNAL' && !compensation.mealAllowance }"
          @input="handleMoneyInput($event, compensation, 'mealAllowance')"
        />
      </div>

      <div class="form-group">
        <label>Seguro Ac. Trabalho (€/mês)</label>
        <input
          :value="formatNumber(compensation.accidentInsurance)"
          type="text"
          inputmode="decimal"
          :disabled="compensation.worker?.workerContractType == 'CONTRACTOR'"
          :class="{
            required: compensation.worker?.workerContractType == 'INTERNAL' && !compensation.accidentInsurance,
          }"
          @input="handleMoneyInput($event, compensation, 'accidentInsurance')"
        />
      </div>
    </div>

    <div class="actions">
      <button class="btn" @click="show = false">
        <Delete :size="18" />
        Cancelar
      </button>

      <button class="btn" :disabled="!isValid(compensation)" @click="save">
        <Save :size="18" />
        Guardar
      </button>
    </div>
  </BaseDialog>
</template>

<script setup lang="ts">
import BaseDialog from '@/components/BaseDialog.vue';
import { WorkerCompensationType, WorkerType } from '@/types/worker-type';
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
  save: [WorkerCompensationType];
}>();

const show = computed({
  get: () => props.modelValue,
  set: (v) => emit('update:modelValue', v),
});

const compensation = reactive<Partial<WorkerCompensationType>>({});

watch(
  () => props.worker,
  (worker) => {
    if (!worker) return;

    compensation.worker = worker;
    compensation.validFrom = '';
    compensation.defaultHours = worker.defaultHours;
    compensation.hourRate = worker.hourRate;
    compensation.monthlySalary = worker.monthlySalary;
    compensation.tsu = worker.tsu;
    compensation.mealAllowance = worker.mealAllowance;
    compensation.accidentInsurance = worker.accidentInsurance;
  },
  { immediate: true },
);

function isValid(compensation: WorkerCompensationType): boolean {
  return !!(
    compensation.validFrom &&
    compensation.defaultHours &&
    ((compensation.worker?.workerContractType == 'CONTRACTOR' && compensation.hourRate) ||
      (compensation.worker?.workerContractType == 'INTERNAL' &&
        compensation.monthlySalary &&
        compensation.tsu &&
        compensation.mealAllowance &&
        compensation.accidentInsurance))
  );
}

function save() {
  console.log(JSON.stringify(compensation));
  emit('save', { ...compensation });
}
</script>
