<template>
  <div class="phone-input">
    <input
      v-model="entity[secondaryField]"
      inputmode="text"
      pattern="[0-9]{9}"
      maxlength="4"
      placeholder="+351"
      :disabled="isDisabled"
      :class="{ required: isInvalid }"
      class="country-code"
    />

    <input
      v-model="entity[fieldKey]"
      type="tel"
      inputmode="numeric"
      pattern="[0-9]{9}"
      maxlength="9"
      :disabled="isDisabled"
      :class="{ required: isInvalid }"
      class="phone-number"
    />
  </div>
</template>

<script setup lang="ts" generic="TEntity extends Record<string, unknown>">
interface Props {
  entity: TEntity;
  fieldKey: string;
  secondaryField: string;
  isDisabled: boolean;
  isInvalid: boolean;
}

defineProps<Props>();
</script>
