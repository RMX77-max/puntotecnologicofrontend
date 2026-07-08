import { computed } from 'vue'
import { construirMensajeWhatsapp } from 'src/utils/construirMensajeWhatsapp'

export function useWhatsapp(configuracionSitio) {
  const numeroWhatsapp = computed(() => configuracionSitio.value?.whatsapp_principal || '')

  function construirUrlWhatsapp(datosMensaje) {
    const mensaje = construirMensajeWhatsapp({
      ...datosMensaje,
      moneda: configuracionSitio.value?.moneda || 'Bs',
    })

    return `https://wa.me/${numeroWhatsapp.value}?text=${encodeURIComponent(mensaje)}`
  }

  function abrirWhatsapp(datosMensaje) {
    window.open(construirUrlWhatsapp(datosMensaje), '_blank', 'noopener,noreferrer')
  }

  return {
    numeroWhatsapp,
    construirUrlWhatsapp,
    abrirWhatsapp,
  }
}
