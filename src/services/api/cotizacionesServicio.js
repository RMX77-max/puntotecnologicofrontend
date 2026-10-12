import { agregarSitioCatalogo, clienteApi, sitioCatalogo } from './clienteApi.js'

function lineasSolicitud(productos) {
  return productos.map(({ id, cantidad }) => ({ id, cantidad }))
}

function verificarRespuesta(cotizacion, productos) {
  if (
    cotizacion?.sitio !== sitioCatalogo ||
    !Array.isArray(cotizacion.productos) ||
    cotizacion.productos.length !== productos.length ||
    cotizacion.total == null ||
    !Number.isFinite(Number(cotizacion.total)) ||
    Number(cotizacion.total) < 0
  )
    throw new Error('La API no confirmó los precios de esta cotización.')

  for (const producto of productos) {
    const confirmado = cotizacion.productos.find((item) => Number(item.id) === Number(producto.id))
    if (
      !confirmado ||
      Number(confirmado.cantidad) !== Number(producto.cantidad) ||
      confirmado.precio == null ||
      confirmado.subtotal == null ||
      !Number.isFinite(Number(confirmado.precio)) ||
      Number(confirmado.precio) < 0 ||
      !Number.isFinite(Number(confirmado.subtotal)) ||
      Number(confirmado.subtotal) < 0
    ) {
      throw new Error('La API no confirmó todos los productos de la cotización.')
    }
  }
  return cotizacion
}

export async function previsualizarCotizacion(productos) {
  const lineas = lineasSolicitud(productos)
  const respuesta = await clienteApi.post(
    agregarSitioCatalogo('/public/cotizaciones/previsualizar'),
    {
      productos: lineas,
    },
  )
  return verificarRespuesta(respuesta, lineas)
}

export async function crearCotizacion({ productos, cliente }) {
  const lineas = lineasSolicitud(productos)
  const respuesta = await clienteApi.post(agregarSitioCatalogo('/public/cotizaciones'), {
    productos: lineas,
    cliente: {
      nombre: cliente.nombre,
      telefono: cliente.telefono,
      observaciones: cliente.observaciones,
    },
  })
  verificarRespuesta(respuesta, lineas)
  if (!respuesta.codigo) throw new Error('La API no devolvió el código de cotización.')
  return respuesta
}
