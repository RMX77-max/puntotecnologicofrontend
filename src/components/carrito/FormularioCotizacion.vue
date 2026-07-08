<template>
  <q-form class="formulario-cotizacion" @submit.prevent="$emit('enviar-cotizacion', datosCliente)">
    <h2>Datos para cotizar</h2>

    <q-input v-model="datosCliente.nombre" outlined label="Nombre" :rules="[(valor) => !!valor || 'Ingresa tu nombre']" />
    <q-input v-model="datosCliente.telefono" outlined label="Telefono opcional" />
    <q-input
      v-model="datosCliente.observaciones"
      outlined
      type="textarea"
      label="Observaciones"
      autogrow
    />

    <q-btn
      unelevated
      color="positive"
      icon="send"
      label="Enviar cotizacion por WhatsApp"
      type="submit"
      :disable="deshabilitado"
    />
  </q-form>
</template>

<script setup>
import { reactive } from 'vue'
import 'src/css/components/carrito.css'

defineProps({
  deshabilitado: { type: Boolean, default: false },
})

defineEmits(['enviar-cotizacion'])

const datosCliente = reactive({
  nombre: '',
  telefono: '',
  observaciones: '',
})
</script>
