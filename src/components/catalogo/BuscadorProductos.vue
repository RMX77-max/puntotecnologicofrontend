<template>
  <q-input
    :model-value="modelo"
    outlined
    dense
    clearable
    debounce="250"
    placeholder="Buscar productos, marcas..."
    class="buscador-productos"
    @update:model-value="$emit('update:modelValue', $event || '')"
  >
    <template #prepend>
      <q-icon name="search" />
    </template>
  </q-input>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  modelValue: { type: String, default: '' },
})

defineEmits(['update:modelValue'])

const modelo = computed(() => props.modelValue)
</script>
