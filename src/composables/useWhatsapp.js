import { computed } from 'vue'
import { construirMensajeWhatsapp } from '../utils/construirMensajeWhatsapp.js'
import { crearCotizacion, previsualizarCotizacion } from '../services/api/cotizacionesServicio.js'

export function useWhatsapp(configuracionSitio) {
  const numeroWhatsapp = computed(() =>
    String(configuracionSitio.value?.whatsapp_principal || '').replace(/\D/g, ''),
  )

  function construirUrlWhatsapp(datosMensaje) {
    const mensaje = construirMensajeWhatsapp({ ...datosMensaje, moneda: 'Bs' })
    return `https://wa.me/${numeroWhatsapp.value}?text=${encodeURIComponent(mensaje)}`
  }

  async function abrirWhatsapp({ productosCotizacion, datosCliente = {} }) {
    if (!/^\d{8,15}$/.test(numeroWhatsapp.value)) {
      throw new Error('El número de WhatsApp de la tienda no está configurado.')
    }
    // Abrir durante el clic evita el bloqueo habitual tras una consulta asincrona.
    const ventana = window.open('about:blank', '_blank')
    if (ventana) ventana.opener = null
    try {
      const cotizacion = datosCliente.nombre
        ? await crearCotizacion({ productos: productosCotizacion, cliente: datosCliente })
        : await previsualizarCotizacion(productosCotizacion)
      const url = construirUrlWhatsapp({
        productosCotizacion: cotizacion.productos,
        totalCotizacion: cotizacion.total,
        datosCliente: cotizacion.cliente,
        codigoCotizacion: cotizacion.codigo,
      })
      if (ventana && !ventana.closed) ventana.location.replace(url)
      return { cotizacion, url }
    } catch (error) {
      if (ventana && !ventana.closed) ventana.close()
      throw error
    }
  }

  return { numeroWhatsapp, construirUrlWhatsapp, abrirWhatsapp }
}
