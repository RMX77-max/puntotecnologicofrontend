import { obtenerProductos } from './productosServicio'
import { obtenerCategorias } from './categoriasServicio'
import { obtenerBannersActivos } from './bannersServicio'

export async function obtenerCatalogoInicio() {
  const [productos, categorias, banners] = await Promise.all([
    obtenerProductos(),
    obtenerCategorias(),
    obtenerBannersActivos(),
  ])

  return {
    banners,
    categoriasDestacadas: categorias.filter((categoria) => categoria.destacada),
    ofertas: productos.filter((producto) => producto.en_oferta),
    productosPopulares: productos.filter((producto) => producto.destacado),
  }
}
