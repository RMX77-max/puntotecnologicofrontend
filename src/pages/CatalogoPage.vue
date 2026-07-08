<template>
  <q-page class="pagina-catalogo">
    <header v-revelar="{ efecto: 'subir' }" class="catalogo-hero">
      <div>
        <p>Catalogo</p>
        <h1>Productos tecnologicos para tu proximo setup</h1>
        <span>Filtra por categoria, marca o presupuesto y envia tu cotizacion por WhatsApp.</span>
      </div>
    </header>

    <nav v-revelar="{ efecto: 'subir', retraso: 90 }" class="catalogo-categorias-rapidas">
      <button
        class="catalogo-chip"
        :class="{ 'catalogo-chip--activo': !categoriaSeleccionada }"
        type="button"
        @click="categoriaSeleccionada = ''"
      >
        Todo
      </button>
      <button
        v-for="categoria in catalogoStore.categorias"
        :key="categoria.id"
        class="catalogo-chip"
        :class="{ 'catalogo-chip--activo': categoriaSeleccionada === categoria.slug }"
        type="button"
        @click="categoriaSeleccionada = categoria.slug"
      >
        <q-icon :name="categoria.icono" />
        {{ categoria.nombre }}
      </button>
    </nav>

    <section class="catalogo-layout">
      <FiltrosCatalogo
        v-model:texto-busqueda="textoBusqueda"
        v-model:categoria-seleccionada="categoriaSeleccionada"
        v-model:marca-seleccionada="marcaSeleccionada"
        v-model:precio-maximo="precioMaximo"
        :categorias="catalogoStore.categorias"
        :marcas="marcasDisponibles"
      />

      <div class="catalogo-layout__contenido">
        <div v-revelar="{ efecto: 'subir', retraso: 120 }" class="catalogo-toolbar">
          <q-select
            v-model="ordenSeleccionado"
            dense
            outlined
            emit-value
            map-options
            label="Ordenar"
            :options="opcionesOrden"
            class="catalogo-toolbar__orden"
          />
        </div>

        <q-banner v-if="catalogoStore.error" class="bg-negative text-white rounded-borders">
          {{ catalogoStore.error }}
        </q-banner>

        <div v-if="catalogoStore.cargando" class="estado-catalogo">
          <q-spinner color="primary" size="42px" />
          <span>Cargando productos...</span>
        </div>

        <div v-else-if="!productosFiltrados.length" class="estado-catalogo">
          <q-icon name="inventory_2" size="52px" />
          <span>No hay productos disponibles con esos filtros.</span>
        </div>

        <template v-else>
          <div class="grilla-productos">
            <TarjetaProducto
              v-for="(producto, indice) in elementosPaginados"
              :key="producto.id"
              v-revelar="{ efecto: 'subir', retraso: indice * 70 }"
              :producto="producto"
            />
          </div>

          <q-pagination
            v-if="totalPaginas > 1"
            :model-value="paginaActual"
            :max="totalPaginas"
            direction-links
            color="primary"
            class="catalogo-paginacion"
            @update:model-value="cambiarPagina"
          />
        </template>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import { useMeta } from 'quasar'
import FiltrosCatalogo from 'components/catalogo/FiltrosCatalogo.vue'
import TarjetaProducto from 'components/catalogo/TarjetaProducto.vue'
import { useCatalogoStore } from 'src/stores/catalogoStore'
import { useCatalogo } from 'src/composables/useCatalogo'
import { usePaginacion } from 'src/composables/usePaginacion'
import 'src/css/pages/catalogo.css'

useMeta({ title: 'Catalogo | Mi PC Computadoras' })

const catalogoStore = useCatalogoStore()
const {
  textoBusqueda,
  categoriaSeleccionada,
  marcaSeleccionada,
  precioMaximo,
  marcasDisponibles,
  productosFiltrados,
} = useCatalogo(computed(() => catalogoStore.productos))
const ordenSeleccionado = ref('destacados')
const opcionesOrden = [
  { label: 'Destacados', value: 'destacados' },
  { label: 'Precio menor', value: 'precio-menor' },
  { label: 'Precio mayor', value: 'precio-mayor' },
  { label: 'Ofertas primero', value: 'ofertas' },
]
const productosOrdenados = computed(() => {
  const productos = [...productosFiltrados.value]

  if (ordenSeleccionado.value === 'precio-menor') {
    return productos.sort((a, b) => a.precio - b.precio)
  }

  if (ordenSeleccionado.value === 'precio-mayor') {
    return productos.sort((a, b) => b.precio - a.precio)
  }

  if (ordenSeleccionado.value === 'ofertas') {
    return productos.sort((a, b) => Number(b.en_oferta) - Number(a.en_oferta))
  }

  return productos.sort((a, b) => Number(b.destacado) - Number(a.destacado))
})
const { paginaActual, totalPaginas, elementosPaginados, cambiarPagina, reiniciarPagina } =
  usePaginacion(productosOrdenados, 8)

watch([textoBusqueda, categoriaSeleccionada, marcaSeleccionada, precioMaximo, ordenSeleccionado], reiniciarPagina)
</script>
