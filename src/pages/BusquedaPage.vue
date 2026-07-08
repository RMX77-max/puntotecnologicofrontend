<template>
  <q-page class="pagina-busqueda">
    <header v-revelar="{ efecto: 'subir' }" class="encabezado-pagina">
      <p>Busqueda</p>
      <h1>Resultados para "{{ consulta }}"</h1>
      <span>{{ productosEncontrados.length }} productos encontrados.</span>
    </header>

    <div v-if="!productosEncontrados.length" class="estado-catalogo busqueda-contenido">
      <q-icon name="search_off" size="52px" />
      <span>No encontramos productos para tu busqueda.</span>
      <q-btn color="deep-purple-7" label="Ver catalogo completo" to="/catalogo" />
    </div>

    <div v-else class="grilla-productos busqueda-contenido">
      <TarjetaProducto
        v-for="(producto, indice) in productosEncontrados"
        :key="producto.id"
        v-revelar="{ efecto: 'subir', retraso: indice * 80 }"
        :producto="producto"
      />
    </div>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMeta } from 'quasar'
import TarjetaProducto from 'components/catalogo/TarjetaProducto.vue'
import { useCatalogoStore } from 'src/stores/catalogoStore'
import 'src/css/pages/catalogo.css'

useMeta({ title: 'Buscar productos | Mi PC Computadoras' })

const route = useRoute()
const catalogoStore = useCatalogoStore()
const consulta = computed(() => String(route.query.q || '').trim().toLowerCase())
const productosEncontrados = computed(() =>
  catalogoStore.productos.filter(
    (producto) =>
      producto.nombre.toLowerCase().includes(consulta.value) ||
      producto.marca?.nombre?.toLowerCase().includes(consulta.value) ||
      producto.categoria?.nombre?.toLowerCase().includes(consulta.value),
  ),
)
</script>
