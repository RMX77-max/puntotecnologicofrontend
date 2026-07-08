<template>
  <q-page class="pagina-categoria">
    <header v-revelar="{ efecto: 'subir' }" class="encabezado-pagina">
      <p>Categoria</p>
      <h1>{{ categoriaActual?.nombre || 'Categoria no encontrada' }}</h1>
      <span>{{ categoriaActual?.descripcion || 'Revisa el catalogo completo para ver mas productos.' }}</span>
    </header>

    <div v-if="!categoriaActual" class="estado-catalogo">
      <q-icon name="category" size="52px" />
      <span>No encontramos esta categoria.</span>
      <q-btn color="deep-purple-7" label="Ir al catalogo" to="/catalogo" />
    </div>

    <div v-else-if="!productosCategoria.length" class="estado-catalogo">
      <q-icon name="inventory_2" size="52px" />
      <span>No hay productos publicados en esta categoria.</span>
    </div>

    <div v-else class="grilla-productos">
      <TarjetaProducto
        v-for="(producto, indice) in productosCategoria"
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
import 'src/css/pages/categoria.css'

const route = useRoute()
const catalogoStore = useCatalogoStore()
const slugCategoria = computed(() => route.params.slug)
const categoriaActual = computed(() =>
  catalogoStore.categorias.find((categoria) => categoria.slug === slugCategoria.value),
)
const productosCategoria = computed(() =>
  catalogoStore.productos.filter((producto) => producto.categoria?.slug === slugCategoria.value),
)

useMeta(() => ({
  title: `${categoriaActual.value?.nombre || 'Categoria'} | Mi PC Computadoras`,
}))
</script>
