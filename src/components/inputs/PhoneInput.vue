<template>
  <div class="phone-input">
    <input
      :value="secondaryValue"
      inputmode="text"
      pattern="[0-9]{9}"
      maxlength="4"
      placeholder="+351"
      :disabled="isDisabled"
      :class="{ required: isInvalid }"
      class="country-code"
      @input="emit('update:secondaryValue', ($event.target as HTMLInputElement).value)"
    />

    <input
      :value="value"
      type="tel"
      inputmode="numeric"
      pattern="[0-9]{9}"
      maxlength="9"
      :disabled="isDisabled"
      :class="{ required: isInvalid }"
      class="phone-number"
      @input="emit('update:value', ($event.target as HTMLInputElement).value)"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  value: string | number | null | undefined;
  secondaryValue: string | number | null | undefined;
  isDisabled: boolean;
  isInvalid: boolean;
}

defineProps<Props>();

const emit = defineEmits<{
  'update:value': [value: string];
  'update:secondaryValue': [value: string];
}>();
</script>
