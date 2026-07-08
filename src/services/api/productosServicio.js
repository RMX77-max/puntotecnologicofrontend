import { clienteApi } from './clienteApi'
import { productosMock } from '../mocks/productosMock'

const USAR_DATOS_MOCK = import.meta.env.VITE_USAR_DATOS_MOCK === 'true'

export async function obtenerProductos() {
  if (USAR_DATOS_MOCK) return productosMock.filter((producto) => producto.visible_catalogo)

  return clienteApi.get('/public/productos')
}

export async function obtenerProductoPorSlug(slug) {
  if (USAR_DATOS_MOCK) {
    return productosMock.find((producto) => producto.slug === slug && producto.visible_catalogo) || null
  }

  return clienteApi.get(`/public/productos/${slug}`)
}

export async function obtenerProductosRelacionados(productoBase) {
  const productos = await obtenerProductos()

  return productos
    .filter(
      (producto) =>
        producto.id !== productoBase.id && producto.categoria?.slug === productoBase.categoria?.slug,
    )
    .slice(0, 4)
}
