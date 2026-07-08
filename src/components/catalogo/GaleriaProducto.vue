<template>
  <section class="galeria-producto">
    <ImagenProducto :imagen-url="imagenSeleccionada" :texto-alternativo="producto.nombre" proporcion="1 / 1" />

    <div v-if="imagenes.length" class="galeria-producto__miniaturas">
      <button
        v-for="imagen in imagenes"
        :key="imagen.id"
        class="galeria-producto__miniatura"
        :class="{ 'galeria-producto__miniatura--activa': imagen.url === imagenSeleccionada }"
        type="button"
        @click="imagenSeleccionada = imagen.url"
      >
        <ImagenProducto :imagen-url="imagen.url" :texto-alternativo="imagen.alt" proporcion="1 / 1" />
      </button>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import ImagenProducto from './ImagenProducto.vue'
import 'src/css/components/galeria-producto.css'

const props = defineProps({
  producto: { type: Object, required: true },
})

const imagenes = computed(() => props.producto.imagenes || [])
const imagenSeleccionada = ref('')

watch(
  imagenes,
  (nuevasImagenes) => {
    imagenSeleccionada.value =
      nuevasImagenes.find((imagen) => imagen.principal)?.url || nuevasImagenes[0]?.url || ''
  },
  { immediate: true },
)
</script>
