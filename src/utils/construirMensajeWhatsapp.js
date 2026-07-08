import { formatearPrecio } from './formatearPrecio'

export function construirMensajeWhatsapp({
  productosCotizacion,
  totalCotizacion,
  datosCliente,
  codigoCotizacion,
  moneda = 'Bs',
}) {
  const lineasProductos = productosCotizacion
    .map((productoCarrito, indice) => {
      const subtotal = productoCarrito.precio * productoCarrito.cantidad

      return `${indice + 1}. ${productoCarrito.nombre}
   Cantidad: ${productoCarrito.cantidad}
   Precio unitario: ${formatearPrecio(productoCarrito.precio, moneda)}
   Subtotal: ${formatearPrecio(subtotal, moneda)}`
    })
    .join('\n\n')

  const lineasCliente = [
    datosCliente.nombre ? `Nombre: ${datosCliente.nombre}` : '',
    datosCliente.telefono ? `Telefono: ${datosCliente.telefono}` : '',
    datosCliente.observaciones ? `Observaciones: ${datosCliente.observaciones}` : '',
  ].filter(Boolean)

  return [
    'Hola, quiero cotizar estos productos:',
    '',
    lineasProductos,
    '',
    `Total aproximado: ${formatearPrecio(totalCotizacion, moneda)}`,
    codigoCotizacion ? `Codigo de cotizacion: ${codigoCotizacion}` : '',
    '',
    ...lineasCliente,
  ]
    .filter((linea) => linea !== '')
    .join('\n')
}
