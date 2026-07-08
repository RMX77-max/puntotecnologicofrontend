<template>
  <div class="imagen-producto" :class="claseImagen" :style="{ aspectRatio: proporcion }">
    <img
      :src="imagenFinal"
      :alt="textoAlternativo"
      loading="lazy"
      @error="marcarImagenConError"
    />
  </div>
</template>

<script setup>
import { toRef } from 'vue'
import { useImagenProducto } from 'src/composables/useImagenProducto'
import 'src/css/components/imagen-producto.css'

const props = defineProps({
  imagenUrl: { type: String, default: '' },
  textoAlternativo: { type: String, default: 'Imagen de producto' },
  claseImagen: { type: String, default: '' },
  usarPlaceholder: { type: Boolean, default: true },
  proporcion: { type: String, default: '4 / 3' },
})

const { imagenFinal, marcarImagenConError } = useImagenProducto(
  toRef(props, 'imagenUrl'),
  props.usarPlaceholder,
)
</script>
