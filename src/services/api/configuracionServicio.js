import { agregarSitioCatalogo, clienteApi } from './clienteApi'
import { configuracionMock } from '../mocks/configuracionMock'

const USAR_DATOS_MOCK = import.meta.env.VITE_USAR_DATOS_MOCK === 'true'

export async function obtenerConfiguracionSitio() {
  if (USAR_DATOS_MOCK) return configuracionMock

  return clienteApi.get(agregarSitioCatalogo('/public/configuracion'))
}
