<template>
  <q-page class="pagina-carrito">
    <header v-revelar="{ efecto: 'subir' }" class="encabezado-pagina">
      <p>Cotizacion</p>
      <h1>Carrito de cotizacion</h1>
      <span>Revisa cantidades y envia tu consulta por WhatsApp.</span>
    </header>

    <div v-if="!carritoStore.productosCotizacion.length" class="estado-catalogo">
      <q-icon name="shopping_cart" size="52px" />
      <span>Tu carrito esta vacio.</span>
      <q-btn color="primary" label="Ver productos" to="/catalogo" />
    </div>

    <section v-else v-revelar="{ efecto: 'subir', retraso: 80 }" class="carrito-layout">
      <div class="carrito-layout__items" :inert="enviandoCotizacion">
        <ItemCarrito
          v-for="producto in carritoStore.productosCotizacion"
          :key="producto.id"
          :producto="producto"
          @actualizar-cantidad="carritoStore.actualizarCantidad"
          @quitar-producto="carritoStore.quitarProducto"
        />
      </div>

      <div class="carrito-layout__lateral">
        <q-linear-progress v-if="actualizandoPrecios" indeterminate />
        <p class="text-caption">
          Los precios se confirman al preparar la cotización. No se reserva inventario.
        </p>
        <q-banner v-if="errorPrecios" class="bg-red-1 text-red-10" role="alert">
          {{ errorPrecios }}
          <template #action>
            <q-btn
              flat
              label="Reintentar"
              :disable="enviandoCotizacion"
              @click="actualizarPrecios"
            />
          </template>
        </q-banner>
        <q-banner v-if="urlWhatsapp" class="bg-green-1 text-green-10">
          Cotización preparada.
          <a :href="urlWhatsapp" target="_blank" rel="noopener noreferrer">Abrir WhatsApp</a>
        </q-banner>
        <ResumenCarrito
          :cantidad-total-productos="carritoStore.cantidadTotalProductos"
          :total-cotizacion="carritoStore.totalCotizacion"
          :moneda="configuracionStore.configuracion?.moneda || 'Bs'"
          :inert="enviandoCotizacion"
          @limpiar-carrito="carritoStore.limpiarCarrito"
        />

        <FormularioCotizacion
          :deshabilitado="enviandoCotizacion || actualizandoPrecios || !!errorPrecios"
          @enviar-cotizacion="enviarCotizacion"
        />
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { computed, ref, watch, onBeforeUnmount } from 'vue'
import { useQuasar, useMeta } from 'quasar'
import ItemCarrito from 'components/carrito/ItemCarrito.vue'
import ResumenCarrito from 'components/carrito/ResumenCarrito.vue'
import FormularioCotizacion from 'components/carrito/FormularioCotizacion.vue'
import { useCarritoStore } from 'src/stores/carritoStore'
import { useConfiguracionStore } from 'src/stores/configuracionStore'
import { useWhatsapp } from 'src/composables/useWhatsapp'
import { previsualizarCotizacion } from 'src/services/api/cotizacionesServicio'
import 'src/css/pages/carrito.css'

useMeta({ title: 'Carrito de cotizacion | Punto Tecnologico' })

const $q = useQuasar()
const carritoStore = useCarritoStore()
const configuracionStore = useConfiguracionStore()
const enviandoCotizacion = ref(false)
const actualizandoPrecios = ref(false)
const errorPrecios = ref('')
const urlWhatsapp = ref('')
let revisionPrecios = 0
const { abrirWhatsapp } = useWhatsapp(computed(() => configuracionStore.configuracion))

async function enviarCotizacion(datosCliente) {
  if (enviandoCotizacion.value || actualizandoPrecios.value || errorPrecios.value) return
  enviandoCotizacion.value = true
  urlWhatsapp.value = ''

  try {
    const { cotizacion, url } = await abrirWhatsapp({
      productosCotizacion: carritoStore.productosCotizacion,
      datosCliente,
    })
    carritoStore.actualizarDesdeCotizacion(cotizacion)
    urlWhatsapp.value = url

    $q.notify({ type: 'positive', message: 'Cotizacion preparada para WhatsApp' })
  } catch (error) {
    $q.notify({ type: 'negative', message: error.message || 'No se pudo confirmar la cotización.' })
  } finally {
    enviandoCotizacion.value = false
  }
}

async function actualizarPrecios() {
  const revision = ++revisionPrecios
  errorPrecios.value = ''
  urlWhatsapp.value = ''
  if (!carritoStore.productosCotizacion.length) {
    actualizandoPrecios.value = false
    return
  }
  actualizandoPrecios.value = true
  try {
    const cotizacion = await previsualizarCotizacion(carritoStore.productosCotizacion)
    if (revision === revisionPrecios) carritoStore.actualizarDesdeCotizacion(cotizacion)
  } catch (error) {
    if (revision === revisionPrecios)
      errorPrecios.value = error.message || 'No se pudieron actualizar los precios.'
  } finally {
    if (revision === revisionPrecios) actualizandoPrecios.value = false
  }
}

watch(
  () => carritoStore.productosCotizacion.map((item) => `${item.id}:${item.cantidad}`).join('|'),
  actualizarPrecios,
  { immediate: true },
)
onBeforeUnmount(() => {
  revisionPrecios += 1
})
</script>
