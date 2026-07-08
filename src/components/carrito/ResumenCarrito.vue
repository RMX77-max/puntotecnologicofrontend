<template>
  <aside class="resumen-carrito">
    <h2>Resumen</h2>
    <div>
      <span>Productos</span>
      <strong>{{ cantidadTotalProductos }}</strong>
    </div>
    <div>
      <span>Total aproximado</span>
      <strong>{{ formatearPrecio(totalCotizacion, moneda) }}</strong>
    </div>
    <q-btn
      outline
      color="negative"
      icon="delete_sweep"
      label="Limpiar carrito"
      :disable="cantidadTotalProductos === 0"
      @click="$emit('limpiar-carrito')"
    />
  </aside>
</template>

<script setup>
import { useFormatoMoneda } from 'src/composables/useFormatoMoneda'
import 'src/css/components/carrito.css'

defineProps({
  cantidadTotalProductos: { type: Number, default: 0 },
  totalCotizacion: { type: Number, default: 0 },
  moneda: { type: String, default: 'Bs' },
})

defineEmits(['limpiar-carrito'])

const { formatearPrecio } = useFormatoMoneda()
</script>
