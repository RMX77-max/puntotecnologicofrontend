import { agregarSitioCatalogo, clienteApi } from './clienteApi'
import { bannersMock } from '../mocks/bannersMock'

const USAR_DATOS_MOCK = import.meta.env.VITE_USAR_DATOS_MOCK === 'true'

export async function obtenerBannersActivos() {
  if (USAR_DATOS_MOCK) {
    return bannersMock.filter((banner) => banner.activo).sort((a, b) => a.orden - b.orden)
  }

  return clienteApi.get(agregarSitioCatalogo('/public/banners'))
}
