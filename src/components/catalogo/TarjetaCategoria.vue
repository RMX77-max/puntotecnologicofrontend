<template>
  <router-link
    class="tarjeta-categoria"
    :to="`/categoria/${categoria.slug}`"
  >
    <div class="tarjeta-categoria__imagen">
      <img v-if="categoria.imagen_url" :src="categoria.imagen_url" :alt="categoria.nombre" loading="lazy" />
      <q-icon v-else :name="categoria.icono || 'category'" size="42px" />
    </div>

    <div class="tarjeta-categoria__contenido">
      <h3>{{ categoria.nombre }}</h3>
      <p>{{ categoria.subtitulo || categoria.descripcion }}</p>
    </div>
  </router-link>
</template>

<script setup>
import 'src/css/components/tarjeta-producto.css'

defineProps({
  categoria: { type: Object, required: true },
  indice: { type: Number, default: 0 },
})
</script>
