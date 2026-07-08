import { clienteApi } from './clienteApi'

const USAR_DATOS_MOCK = true

export async function crearCotizacion(datosCotizacion) {
  if (USAR_DATOS_MOCK) {
    return {
      codigo: `COT-${String(Date.now()).slice(-6)}`,
      estado: 'pendiente',
      datos: datosCotizacion,
    }
  }

  return clienteApi.post('/public/cotizaciones', datosCotizacion)
}
