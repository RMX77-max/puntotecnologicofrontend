<template>
  <q-page class="pagina-detalle-producto">
    <div v-if="!productoActual" class="estado-catalogo">
      <q-icon name="search_off" size="52px" />
      <span>No encontramos este producto.</span>
      <q-btn color="primary" label="Volver al catalogo" to="/catalogo" />
    </div>

    <template v-else>
      <nav v-revelar="{ efecto: 'subir' }" class="detalle-producto__breadcrumb">
        <router-link to="/">Inicio</router-link>
        <q-icon name="chevron_right" />
        <router-link to="/catalogo">Catalogo</router-link>
        <q-icon name="chevron_right" />
        <router-link :to="`/categoria/${productoActual.categoria?.slug}`">
          {{ productoActual.categoria?.nombre }}
        </router-link>
      </nav>

      <section v-revelar="{ efecto: 'subir', retraso: 80 }" class="detalle-producto">
        <GaleriaProducto :producto="productoActual" />

        <div class="detalle-producto__contenido">
          <div class="detalle-producto__meta">
            <span>{{ productoActual.marca?.nombre }}</span>
            <span>{{ productoActual.categoria?.nombre }}</span>
            <span v-if="productoActual.en_oferta">Oferta</span>
          </div>

          <h1>{{ productoActual.nombre }}</h1>
          <p>{{ productoActual.descripcion_corta }}</p>

          <div class="detalle-producto__panel-compra">
            <div class="detalle-producto__precio">
              <span>Precio referencial</span>
              <strong>{{ formatearPrecio(productoActual.precio, productoActual.moneda) }}</strong>
            </div>

            <EstadoProducto :stock-publico="productoActual.stock_publico" />

            <div class="detalle-producto__acciones">
              <q-btn
                unelevated
                color="deep-purple-7"
                icon="add_shopping_cart"
                label="Agregar a cotizacion"
                @click="agregarProducto"
              />
              <q-btn
                outline
                color="positive"
                icon="chat"
                label="Cotizar por WhatsApp"
                @click="cotizarProducto"
              />
            </div>

            <div class="detalle-producto__beneficios">
              <article>
                <q-icon name="verified" />
                <span>Producto revisado</span>
              </article>
              <article>
                <q-icon name="support_agent" />
                <span>Asesoria directa</span>
              </article>
              <article>
                <q-icon name="local_shipping" />
                <span>Delivery coordinado</span>
              </article>
            </div>
          </div>

          <section class="detalle-producto__bloque">
            <h2>Especificaciones</h2>
            <dl>
              <div v-for="especificacion in productoActual.especificaciones" :key="especificacion.titulo">
                <dt>{{ especificacion.titulo }}</dt>
                <dd>{{ especificacion.valor }}</dd>
              </div>
            </dl>
          </section>

          <section class="detalle-producto__bloque">
            <h2>Delivery</h2>
            <article v-for="opcionDelivery in configuracionStore.configuracion?.delivery" :key="opcionDelivery.titulo">
              <strong>{{ opcionDelivery.titulo }}</strong>
              <span>{{ opcionDelivery.descripcion }}</span>
            </article>
          </section>
        </div>
      </section>

      <section
        v-if="productosRelacionados.length"
        v-revelar="{ efecto: 'subir' }"
        class="seccion-contenido detalle-relacionados"
      >
        <div v-revelar="{ efecto: 'subir', retraso: 90 }" class="seccion-contenido__encabezado">
          <div>
            <p>Relacionados</p>
            <h2>Tambien podria interesarte</h2>
          </div>
        </div>
        <div class="grilla-productos">
          <TarjetaProducto
            v-for="(producto, indice) in productosRelacionados"
            :key="producto.id"
            v-revelar="{ efecto: 'subir', retraso: indice * 80 }"
            :producto="producto"
          />
        </div>
      </section>
    </template>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useQuasar, useMeta } from 'quasar'
import { useRoute } from 'vue-router'
import GaleriaProducto from 'components/catalogo/GaleriaProducto.vue'
import EstadoProducto from 'components/catalogo/EstadoProducto.vue'
import TarjetaProducto from 'components/catalogo/TarjetaProducto.vue'
import { useCatalogoStore } from 'src/stores/catalogoStore'
import { useCarritoStore } from 'src/stores/carritoStore'
import { useConfiguracionStore } from 'src/stores/configuracionStore'
import { useFormatoMoneda } from 'src/composables/useFormatoMoneda'
import { useWhatsapp } from 'src/composables/useWhatsapp'
import 'src/css/pages/detalle-producto.css'

const route = useRoute()
const $q = useQuasar()
const catalogoStore = useCatalogoStore()
const carritoStore = useCarritoStore()
const configuracionStore = useConfiguracionStore()
const { formatearPrecio } = useFormatoMoneda()
const { abrirWhatsapp } = useWhatsapp(computed(() => configuracionStore.configuracion))

const productoActual = computed(() =>
  catalogoStore.productos.find((producto) => producto.slug === route.params.slug),
)
const productosRelacionados = computed(() =>
  catalogoStore.productos
    .filter(
      (producto) =>
        producto.id !== productoActual.value?.id &&
        producto.categoria?.slug === productoActual.value?.categoria?.slug,
    )
    .slice(0, 4),
)

useMeta(() => ({ title: `${productoActual.value?.nombre || 'Producto'} | Mi PC Computadoras` }))

function agregarProducto() {
  carritoStore.agregarProducto(productoActual.value)
  $q.notify({ type: 'positive', message: 'Producto agregado a la cotizacion' })
}

function cotizarProducto() {
  abrirWhatsapp({
    productosCotizacion: [{ ...productoActual.value, cantidad: 1 }],
    totalCotizacion: productoActual.value.precio,
    datosCliente: {},
  })
}
</script>
