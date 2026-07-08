export function validarImagen(urlImagen) {
  if (!urlImagen || typeof urlImagen !== 'string') return false

  return urlImagen.startsWith('http') || urlImagen.startsWith('/') || urlImagen.startsWith('data:')
}
