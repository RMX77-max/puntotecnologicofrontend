<template>
  <article class="item-carrito">
    <ImagenProducto :imagen-url="producto.imagen" :texto-alternativo="producto.nombre" proporcion="1 / 1" />

    <div class="item-carrito__detalle">
      <h3>{{ producto.nombre }}</h3>
      <p>{{ producto.marca?.nombre }} · {{ formatearPrecio(producto.precio, producto.moneda) }}</p>
    </div>

    <q-input
      :model-value="producto.cantidad"
      dense
      outlined
      type="number"
      min="1"
      class="item-carrito__cantidad"
      @update:model-value="$emit('actualizar-cantidad', producto.id, Number($event))"
    />

    <strong>{{ formatearPrecio(producto.precio * producto.cantidad, producto.moneda) }}</strong>

    <q-btn flat round color="negative" icon="delete" @click="$emit('quitar-producto', producto.id)">
      <q-tooltip>Quitar producto</q-tooltip>
    </q-btn>
  </article>
</template>

<script setup>
import ImagenProducto from 'components/catalogo/ImagenProducto.vue'
import { useFormatoMoneda } from 'src/composables/useFormatoMoneda'
import 'src/css/components/carrito.css'

defineProps({
  producto: { type: Object, required: true },
})

defineEmits(['actualizar-cantidad', 'quitar-producto'])

const { formatearPrecio } = useFormatoMoneda()
</script>
