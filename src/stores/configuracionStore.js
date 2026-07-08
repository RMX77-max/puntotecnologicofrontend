import { defineStore } from 'pinia'
import { obtenerConfiguracionSitio } from 'src/services/api/configuracionServicio'

export const useConfiguracionStore = defineStore('configuracionSitio', {
  state: () => ({
    configuracion: null,
    cargando: false,
    error: '',
  }),
  actions: {
    async cargarConfiguracion() {
      if (this.configuracion) return

      this.cargando = true
      this.error = ''

      try {
        this.configuracion = await obtenerConfiguracionSitio()
      } catch (error) {
        this.error = 'No se pudo cargar la configuracion del sitio.'
        console.error(error)
      } finally {
        this.cargando = false
      }
    },
  },
})
