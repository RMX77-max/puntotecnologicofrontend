<template>
  <nav class="menu-categorias">
    <router-link v-for="categoria in categoriasVisibles" :key="categoria.id" :to="`/categoria/${categoria.slug}`">
      {{ categoria.nombre }}
    </router-link>

    <router-link class="menu-categorias__todos" to="/catalogo">
      Ver catalogo
    </router-link>
  </nav>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  categorias: { type: Array, default: () => [] },
})

const categoriasPrioritarias = [
  'laptops',
  'portatil',
  'procesadores',
  'placa-madre',
  'memoria-ram',
  'monitor',
  'tarjeta-grafica',
  'disco-solido',
  'mouse',
  'teclado',
]

const categoriasVisibles = computed(() => {
  const categoriasOrdenadas = [...props.categorias].sort((a, b) => {
    const indiceA = categoriasPrioritarias.indexOf(a.slug)
    const indiceB = categoriasPrioritarias.indexOf(b.slug)
    const pesoA = indiceA === -1 ? 999 : indiceA
    const pesoB = indiceB === -1 ? 999 : indiceB

    if (pesoA !== pesoB) return pesoA - pesoB
    return a.nombre.localeCompare(b.nombre)
  })

  return categoriasOrdenadas.slice(0, 10)
})
</script>
