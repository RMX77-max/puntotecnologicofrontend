export function formatearPrecio(valor, moneda = 'Bs') {
  const numero = Number(valor || 0)

  return `${moneda} ${new Intl.NumberFormat('es-BO', {
    maximumFractionDigits: 0,
  }).format(numero)}`
}
