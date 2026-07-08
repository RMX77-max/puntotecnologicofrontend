<template>
  <aside class="filtros-catalogo">
    <div class="filtros-catalogo__encabezado">
      <q-icon name="tune" />
      <div>
        <strong>Filtros</strong>
        <span>Encuentra el producto ideal</span>
      </div>
    </div>

    <BuscadorProductos
      :model-value="textoBusqueda"
      @update:model-value="$emit('update:textoBusqueda', $event)"
    />

    <q-select
      :model-value="categoriaSeleccionada"
      :options="opcionesCategorias"
      emit-value
      map-options
      outlined
      dense
      clearable
      label="Categoria"
      @update:model-value="$emit('update:categoriaSeleccionada', $event || '')"
    />

    <q-select
      :model-value="marcaSeleccionada"
      :options="opcionesMarcas"
      outlined
      dense
      clearable
      label="Marca"
      @update:model-value="$emit('update:marcaSeleccionada', $event || '')"
    />

    <q-input
      :model-value="precioMaximo"
      outlined
      dense
      type="number"
      min="0"
      label="Precio maximo"
      @update:model-value="$emit('update:precioMaximo', Number($event) || null)"
    >
      <template #prepend>
        <q-icon name="payments" />
      </template>
    </q-input>

    <q-btn
      flat
      color="primary"
      icon="restart_alt"
      label="Limpiar filtros"
      @click="limpiarFiltros"
    />
  </aside>
</template>

<script setup>
import { computed } from 'vue'
import BuscadorProductos from './BuscadorProductos.vue'

const props = defineProps({
  textoBusqueda: { type: String, default: '' },
  categoriaSeleccionada: { type: String, default: '' },
  marcaSeleccionada: { type: String, default: '' },
  precioMaximo: { type: Number, default: null },
  categorias: { type: Array, default: () => [] },
  marcas: { type: Array, default: () => [] },
})

const emit = defineEmits([
  'update:textoBusqueda',
  'update:categoriaSeleccionada',
  'update:marcaSeleccionada',
  'update:precioMaximo',
])

const opcionesCategorias = computed(() =>
  props.categorias.map((categoria) => ({ label: categoria.nombre, value: categoria.slug })),
)
const opcionesMarcas = computed(() => props.marcas)

function limpiarFiltros() {
  emit('update:textoBusqueda', '')
  emit('update:categoriaSeleccionada', '')
  emit('update:marcaSeleccionada', '')
  emit('update:precioMaximo', null)
}
</script>
