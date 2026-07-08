import { defineStore } from 'pinia'

const CLAVE_CARRITO = 'mipc_carrito_cotizacion'

export const useCarritoStore = defineStore('carritoCotizacion', {
  state: () => ({
    productosCotizacion: [],
  }),
  getters: {
    cantidadTotalProductos: (state) =>
      state.productosCotizacion.reduce((total, producto) => total + producto.cantidad, 0),
    totalCotizacion: (state) =>
      state.productosCotizacion.reduce(
        (total, producto) => total + producto.precio * producto.cantidad,
        0,
      ),
  },
  actions: {
    productoYaExiste(productoId) {
      return this.productosCotizacion.some((producto) => producto.id === productoId)
    },
    agregarProducto(producto) {
      const productoExistente = this.productosCotizacion.find((registro) => registro.id === producto.id)

      if (productoExistente) {
        productoExistente.cantidad += 1
      } else {
        this.productosCotizacion.push({
          id: producto.id,
          nombre: producto.nombre,
          slug: producto.slug,
          marca: producto.marca,
          categoria: producto.categoria,
          precio: Number(producto.precio || 0),
          moneda: producto.moneda || 'Bs',
          imagen: producto.imagenes?.find((imagen) => imagen.principal)?.url || producto.imagenes?.[0]?.url || '',
          cantidad: 1,
        })
      }

      this.guardarCarritoLocal()
    },
    quitarProducto(productoId) {
      this.productosCotizacion = this.productosCotizacion.filter((producto) => producto.id !== productoId)
      this.guardarCarritoLocal()
    },
    aumentarCantidad(productoId) {
      const producto = this.productosCotizacion.find((registro) => registro.id === productoId)
      if (!producto) return

      producto.cantidad += 1
      this.guardarCarritoLocal()
    },
    disminuirCantidad(productoId) {
      const producto = this.productosCotizacion.find((registro) => registro.id === productoId)
      if (!producto) return

      producto.cantidad -= 1

      if (producto.cantidad <= 0) {
        this.quitarProducto(productoId)
        return
      }

      this.guardarCarritoLocal()
    },
    actualizarCantidad(productoId, cantidad) {
      const producto = this.productosCotizacion.find((registro) => registro.id === productoId)
      const cantidadValidada = Math.max(1, Number(cantidad || 1))

      if (!producto) return
      producto.cantidad = cantidadValidada
      this.guardarCarritoLocal()
    },
    limpiarCarrito() {
      this.productosCotizacion = []
      this.guardarCarritoLocal()
    },
    guardarCarritoLocal() {
      localStorage.setItem(CLAVE_CARRITO, JSON.stringify(this.productosCotizacion))
    },
    cargarCarritoLocal() {
      const carritoGuardado = localStorage.getItem(CLAVE_CARRITO)
      if (!carritoGuardado) return

      try {
        this.productosCotizacion = JSON.parse(carritoGuardado)
      } catch {
        this.productosCotizacion = []
      }
    },
  },
})
