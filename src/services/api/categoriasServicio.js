import { clienteApi } from './clienteApi'
import { categoriasMock } from '../mocks/categoriasMock'

const USAR_DATOS_MOCK = import.meta.env.VITE_USAR_DATOS_MOCK === 'true'

export async function obtenerCategorias() {
  if (USAR_DATOS_MOCK) return categoriasMock

  return clienteApi.get('/public/categorias')
}

export async function obtenerCategoriaPorSlug(slug) {
  if (USAR_DATOS_MOCK) {
    return categoriasMock.find((categoria) => categoria.slug === slug) || null
  }

  return clienteApi.get(`/public/categorias/${slug}`)
}
