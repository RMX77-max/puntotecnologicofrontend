import { clienteApi } from './clienteApi'
import { bannersMock } from '../mocks/bannersMock'

const USAR_DATOS_MOCK = import.meta.env.VITE_USAR_DATOS_MOCK === 'true'
const SITIO_CATALOGO = import.meta.env.VITE_SITIO_CATALOGO || 'mipc'

export async function obtenerBannersActivos() {
  if (USAR_DATOS_MOCK) {
    return bannersMock.filter((banner) => banner.activo).sort((a, b) => a.orden - b.orden)
  }

  return clienteApi.get(`/public/banners?sitio=${encodeURIComponent(SITIO_CATALOGO)}`)
}
