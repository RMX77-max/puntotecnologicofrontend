const urlBaseApi = import.meta.env.VITE_API_URL || 'http://localhost/Tiendabackend/public/api'

async function solicitarApi(ruta, opciones = {}) {
  const respuesta = await fetch(`${urlBaseApi}${ruta}`, {
    headers: {
      Accept: 'application/json',
      'Content-Type': 'application/json',
      ...opciones.headers,
    },
    ...opciones,
  })

  if (!respuesta.ok) {
    throw new Error(`Error API ${respuesta.status}`)
  }

  return respuesta.json()
}

export const clienteApi = {
  get: (ruta) => solicitarApi(ruta),
  post: (ruta, datos) =>
    solicitarApi(ruta, {
      method: 'POST',
      body: JSON.stringify(datos),
    }),
}
