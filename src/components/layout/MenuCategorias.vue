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
  'procesadores',
  'placa-madre',
  'memoria-ram',
  'monitor',
  'tarjeta-grafica',
  'disco-solido',
  'mouse',
  'teclado',
]

const categoriasRespaldo = [
  { id: 'respaldo-laptops', nombre: 'Laptops', slug: 'laptops' },
  { id: 'respaldo-procesadores', nombre: 'Procesadores', slug: 'procesadores' },
  { id: 'respaldo-placa-madre', nombre: 'Placa madre', slug: 'placa-madre' },
  { id: 'respaldo-memoria-ram', nombre: 'Memoria RAM', slug: 'memoria-ram' },
  { id: 'respaldo-monitor', nombre: 'Monitor', slug: 'monitor' },
  { id: 'respaldo-tarjeta-grafica', nombre: 'Tarjeta grafica', slug: 'tarjeta-grafica' },
  { id: 'respaldo-disco-solido', nombre: 'Disco solido', slug: 'disco-solido' },
  { id: 'respaldo-mouse', nombre: 'Mouse', slug: 'mouse' },
  { id: 'respaldo-teclado', nombre: 'Teclado', slug: 'teclado' },
]

function obtenerGrupoCategoria(categoria) {
  const texto = `${categoria.slug || ''} ${categoria.nombre || ''}`.toLowerCase()

  if (texto.includes('laptop') || texto.includes('portatil') || texto.includes('portátil')) {
    return 'laptops'
  }

  return categoria.slug || categoria.nombre
}

const categoriasVisibles = computed(() => {
  const categoriasUnicas = []
  const gruposUsados = new Set()
  const categoriasBase = props.categorias.length ? props.categorias : categoriasRespaldo

  categoriasBase.forEach((categoria) => {
    const grupo = obtenerGrupoCategoria(categoria)

    if (gruposUsados.has(grupo)) return

    gruposUsados.add(grupo)
    categoriasUnicas.push(categoria)
  })

  const categoriasOrdenadas = categoriasUnicas.sort((a, b) => {
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
