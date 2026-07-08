import { ref, computed } from 'vue'
import placeholderProducto from 'assets/imagenes/placeholders/producto-placeholder.svg'
import { validarImagen } from 'src/utils/validarImagen'

export function useImagenProducto(imagenUrl, usarPlaceholder = true) {
  const imagenConError = ref(false)

  const imagenFinal = computed(() => {
    if (!imagenConError.value && validarImagen(imagenUrl.value || imagenUrl)) {
      return imagenUrl.value || imagenUrl
    }

    return usarPlaceholder ? placeholderProducto : ''
  })

  function marcarImagenConError() {
    imagenConError.value = true
  }

  function reiniciarImagen() {
    imagenConError.value = false
  }

  // TODO: adaptar resolucion de imagenes a CDN o storage externo de Laravel.
  return {
    imagenFinal,
    imagenConError,
    marcarImagenConError,
    reiniciarImagen,
  }
}
