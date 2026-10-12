import { defineStore } from 'pinia'

const CLAVE_CARRITO = 'punto_tecnologico_carrito_cotizacion'

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
    actualizarDesdeCotizacion(cotizacion) {
      this.productosCotizacion = this.productosCotizacion.map((actual) => {
        const confirmado = cotizacion.productos.find(
          (item) => Number(item.id) === Number(actual.id),
        )
        return confirmado
          ? { ...confirmado, precio: Number(confirmado.precio), cantidad: actual.cantidad }
          : actual
      })
      this.guardarCarritoLocal()
    },
    productoYaExiste(productoId) {
      return this.productosCotizacion.some((producto) => producto.id === productoId)
    },
    agregarProducto(producto) {
      const productoExistente = this.productosCotizacion.find(
        (registro) => registro.id === producto.id,
      )

      if (productoExistente) {
        productoExistente.cantidad = Math.min(999, productoExistente.cantidad + 1)
        productoExistente.precio = Number(producto.precio)
      } else {
        this.productosCotizacion.push({
          id: producto.id,
          nombre: producto.nombre,
          slug: producto.slug,
          marca: producto.marca,
          categoria: producto.categoria,
          precio: Number(producto.precio || 0),
          moneda: producto.moneda || 'Bs',
          imagen:
            producto.imagenes?.find((imagen) => imagen.principal)?.url ||
            producto.imagenes?.[0]?.url ||
            '',
          cantidad: 1,
        })
      }

      this.guardarCarritoLocal()
    },
    quitarProducto(productoId) {
      this.productosCotizacion = this.productosCotizacion.filter(
        (producto) => producto.id !== productoId,
      )
      this.guardarCarritoLocal()
    },
    aumentarCantidad(productoId) {
      const producto = this.productosCotizacion.find((registro) => registro.id === productoId)
      if (!producto) return

      producto.cantidad = Math.min(999, producto.cantidad + 1)
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
      const numero = Number(cantidad)
      const cantidadValidada = Number.isFinite(numero)
        ? Math.min(999, Math.max(1, Math.trunc(numero)))
        : 1

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
        const guardados = JSON.parse(carritoGuardado)
        const ids = new Set()
        this.productosCotizacion = (Array.isArray(guardados) ? guardados : [])
          .filter((producto) => {
            const id = Number(producto?.id)
            if (!Number.isSafeInteger(id) || id < 1 || ids.has(id)) return false
            ids.add(id)
            return true
          })
          .slice(0, 100)
          .map((producto) => ({
            ...producto,
            id: Number(producto.id),
            cantidad: Number.isFinite(Number(producto.cantidad))
              ? Math.min(999, Math.max(1, Math.trunc(Number(producto.cantidad))))
              : 1,
            precio:
              Number.isFinite(Number(producto.precio)) && Number(producto.precio) >= 0
                ? Number(producto.precio)
                : 0,
          }))
      } catch {
        this.productosCotizacion = []
      }
    },
  },
})
