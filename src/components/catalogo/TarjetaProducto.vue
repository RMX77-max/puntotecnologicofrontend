<template>
  <article class="tarjeta-producto">
    <router-link :to="`/producto/${producto.slug}`" class="tarjeta-producto__imagen">
      <div class="tarjeta-producto__badges">
        <span v-if="producto.en_oferta" class="tarjeta-producto__badge tarjeta-producto__badge--oferta">
          Oferta
        </span>
        <span v-if="producto.destacado" class="tarjeta-producto__badge tarjeta-producto__badge--nuevo">
          Popular
        </span>
      </div>

      <ImagenProducto
        :imagen-url="imagenPrincipal"
        :texto-alternativo="producto.nombre"
        proporcion="5 / 4"
      />

      <div class="tarjeta-producto__overlay">
        <span>Ver producto</span>
      </div>
    </router-link>

    <div class="tarjeta-producto__contenido">
      <div class="tarjeta-producto__meta">
        <span class="tarjeta-producto__marca">{{ producto.marca?.nombre || 'Marca por confirmar' }}</span>
        <EstadoProducto :stock-publico="producto.stock_publico" />
      </div>

      <h3>{{ producto.nombre }}</h3>
      <p class="tarjeta-producto__categoria">{{ producto.categoria?.nombre || 'Categoria general' }}</p>
      <p class="tarjeta-producto__descripcion">{{ producto.descripcion_corta }}</p>

      <div class="tarjeta-producto__compra">
        <div>
          <span>Precio</span>
          <strong>{{ formatearPrecio(producto.precio, producto.moneda) }}</strong>
        </div>
        <button class="tarjeta-producto__boton-carrito" type="button" @click="agregarProducto">
          <q-icon name="add_shopping_cart" size="22px" />
          <q-tooltip>Agregar a cotizacion</q-tooltip>
        </button>
      </div>

      <div class="tarjeta-producto__acciones">
        <router-link class="tarjeta-producto__accion tarjeta-producto__accion--detalle" :to="`/producto/${producto.slug}`">
          Ver detalle
        </router-link>
        <button class="tarjeta-producto__accion tarjeta-producto__accion--cotizar" type="button" @click="agregarProducto">
          <q-icon name="chat" size="18px" />
          Cotizar
        </button>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar } from 'quasar'
import ImagenProducto from './ImagenProducto.vue'
import EstadoProducto from './EstadoProducto.vue'
import { useCarritoStore } from 'src/stores/carritoStore'
import { useFormatoMoneda } from 'src/composables/useFormatoMoneda'
import 'src/css/components/tarjeta-producto.css'

const props = defineProps({
  producto: { type: Object, required: true },
})

const $q = useQuasar()
const carritoStore = useCarritoStore()
const { formatearPrecio } = useFormatoMoneda()

const imagenPrincipal = computed(
  () => props.producto.imagenes?.find((imagen) => imagen.principal)?.url || props.producto.imagenes?.[0]?.url || '',
)

function agregarProducto() {
  carritoStore.agregarProducto(props.producto)
  $q.notify({ type: 'positive', message: 'Producto agregado a la cotizacion' })
}
</script>
