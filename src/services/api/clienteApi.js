const urlBaseApi = import.meta.env.VITE_API_URL || 'http://localhost/Tiendabackend/public/api'
const urlBaseApiRespaldo = import.meta.env.VITE_API_URL_RESPALDO || ''
export const sitioCatalogo = (import.meta.env.VITE_SITIO_CATALOGO || 'punto_tecnologico')
  .trim()
  .toLowerCase()
  .replace(/-/g, '_')

export function agregarSitioCatalogo(ruta) {
  if (!sitioCatalogo) return ruta

  const separador = ruta.includes('?') ? '&' : '?'
  return `${ruta}${separador}sitio=${encodeURIComponent(sitioCatalogo)}`
}

async function solicitarConBaseUrl(baseUrl, ruta, opciones = {}) {
  const controlador = new AbortController()
  const temporizador = setTimeout(() => controlador.abort(), 8000)
  const { headers, ...opcionesFetch } = opciones

  try {
    const respuesta = await fetch(`${baseUrl}${ruta}`, {
      ...opcionesFetch,
      signal: controlador.signal,
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        ...headers,
      },
    })

    if (!respuesta.ok) {
      const datosError = await respuesta.json().catch(() => null)
      const error = new Error(
        datosError?.errors?.sitio?.[0] || datosError?.message || `Error API ${respuesta.status}`,
      )
      error.status = respuesta.status
      throw error
    }

    return respuesta.json()
  } finally {
    clearTimeout(temporizador)
  }
}

async function solicitarApi(ruta, opciones = {}) {
  try {
    return await solicitarConBaseUrl(urlBaseApi, ruta, opciones)
  } catch (error) {
    // Productos y cotizaciones deben usar los precios del backend configurado.
    const requierePrecioConfirmado = /^\/public\/(productos|cotizaciones)(\/|\?|$)/.test(ruta)
    if (
      requierePrecioConfirmado ||
      error.status ||
      opciones.method === 'POST' ||
      !urlBaseApiRespaldo ||
      urlBaseApiRespaldo === urlBaseApi
    ) {
      throw error
    }

    console.warn('API local no disponible, usando API de respaldo.', error)
    return solicitarConBaseUrl(urlBaseApiRespaldo, ruta, opciones)
  }
}

export const clienteApi = {
  get: (ruta) => solicitarApi(ruta),
  post: (ruta, datos) =>
    solicitarApi(ruta, {
      method: 'POST',
      body: JSON.stringify(datos),
    }),
}
