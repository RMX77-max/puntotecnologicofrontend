<template>
  <q-badge
    rounded
    :class="estadoDisponible ? 'estado-producto--disponible' : 'estado-producto--consulta'"
    class="estado-producto"
  >
    {{ textoEstado }}
  </q-badge>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  stockPublico: { type: Object, default: () => ({}) },
})

const estadoDisponible = computed(() => Boolean(props.stockPublico?.disponible))
const textoEstado = computed(() => props.stockPublico?.texto || 'Consultar')
</script>
