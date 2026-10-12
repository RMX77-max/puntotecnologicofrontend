export function formatearPrecio(valor, moneda = 'Bs') {
  const numero = Number(valor || 0)

  return `${moneda} ${new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(numero)}`
}
