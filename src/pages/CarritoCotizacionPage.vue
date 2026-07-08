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
      <q-btn color="deep-purple-7" label="Ver productos" to="/catalogo" />
    </div>

    <section v-else v-revelar="{ efecto: 'subir', retraso: 80 }" class="carrito-layout">
      <div class="carrito-layout__items">
        <ItemCarrito
          v-for="producto in carritoStore.productosCotizacion"
          :key="producto.id"
          :producto="producto"
          @actualizar-cantidad="carritoStore.actualizarCantidad"
          @quitar-producto="carritoStore.quitarProducto"
        />
      </div>

      <div class="carrito-layout__lateral">
        <ResumenCarrito
          :cantidad-total-productos="carritoStore.cantidadTotalProductos"
          :total-cotizacion="carritoStore.totalCotizacion"
          :moneda="configuracionStore.configuracion?.moneda || 'Bs'"
          @limpiar-carrito="carritoStore.limpiarCarrito"
        />

        <FormularioCotizacion
          :deshabilitado="enviandoCotizacion"
          @enviar-cotizacion="enviarCotizacion"
        />
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useQuasar, useMeta } from 'quasar'
import ItemCarrito from 'components/carrito/ItemCarrito.vue'
import ResumenCarrito from 'components/carrito/ResumenCarrito.vue'
import FormularioCotizacion from 'components/carrito/FormularioCotizacion.vue'
import { useCarritoStore } from 'src/stores/carritoStore'
import { useConfiguracionStore } from 'src/stores/configuracionStore'
import { useWhatsapp } from 'src/composables/useWhatsapp'
import { crearCotizacion } from 'src/services/api/cotizacionesServicio'
import 'src/css/pages/carrito.css'

useMeta({ title: 'Carrito de cotizacion | Mi PC Computadoras' })

const $q = useQuasar()
const carritoStore = useCarritoStore()
const configuracionStore = useConfiguracionStore()
const enviandoCotizacion = ref(false)
const { abrirWhatsapp } = useWhatsapp(computed(() => configuracionStore.configuracion))

async function enviarCotizacion(datosCliente) {
  enviandoCotizacion.value = true

  try {
    const cotizacion = await crearCotizacion({
      productos: carritoStore.productosCotizacion,
      total: carritoStore.totalCotizacion,
      cliente: datosCliente,
    })

    abrirWhatsapp({
      productosCotizacion: carritoStore.productosCotizacion,
      totalCotizacion: carritoStore.totalCotizacion,
      datosCliente,
      codigoCotizacion: cotizacion.codigo,
    })

    $q.notify({ type: 'positive', message: 'Cotizacion preparada para WhatsApp' })
  } finally {
    enviandoCotizacion.value = false
  }
}
</script>
