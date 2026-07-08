import { defineStore } from 'pinia'
import { obtenerProductos } from 'src/services/api/productosServicio'
import { obtenerCategorias } from 'src/services/api/categoriasServicio'
import { obtenerBannersActivos } from 'src/services/api/bannersServicio'

export const useCatalogoStore = defineStore('catalogo', {
  state: () => ({
    productos: [],
    categorias: [],
    banners: [],
    cargando: false,
    error: '',
  }),
  getters: {
    ofertas: (state) => state.productos.filter((producto) => producto.en_oferta),
    productosPopulares: (state) => state.productos.filter((producto) => producto.destacado),
    categoriasDestacadas: (state) => state.categorias.filter((categoria) => categoria.destacada),
  },
  actions: {
    async cargarCatalogo() {
      this.cargando = true
      this.error = ''

      try {
        const [productos, categorias, banners] = await Promise.all([
          obtenerProductos(),
          obtenerCategorias(),
          obtenerBannersActivos(),
        ])

        this.productos = productos
        this.categorias = categorias
        this.banners = banners
      } catch (error) {
        this.error = 'No se pudo cargar el catalogo. Intenta nuevamente.'
        console.error(error)
      } finally {
        this.cargando = false
      }
    },
  },
})
