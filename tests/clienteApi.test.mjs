import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { ref } from 'vue'
import { useCatalogo } from '../src/composables/useCatalogo.js'

const fuente = await readFile(new URL('../src/services/api/clienteApi.js', import.meta.url), 'utf8')

async function cargarCliente(env = {}) {
  const configuracion = {
    VITE_API_URL: 'https://local.example/api',
    VITE_API_URL_RESPALDO: 'https://respaldo.example/api',
    VITE_SITIO_CATALOGO: 'mipc',
    ...env,
  }
  const codigo = fuente.replaceAll('import.meta.env', `(${JSON.stringify(configuracion)})`)
  return import(`data:text/javascript;base64,${Buffer.from(codigo).toString('base64')}`)
}

function simularFetch(t, implementacion) {
  const original = globalThis.fetch
  globalThis.fetch = implementacion
  t.after(() => {
    globalThis.fetch = original
  })
}

test('envia el codigo canonico para cada sitio, incluyendo el alias con guion', async () => {
  for (const [codigo, esperado] of [
    ['mipc', 'mipc'],
    ['overcity', 'overcity'],
    ['punto-tecnologico', 'punto_tecnologico'],
    [' MIPC ', 'mipc'],
  ]) {
    const cliente = await cargarCliente({ VITE_SITIO_CATALOGO: codigo })
    assert.equal(cliente.sitioCatalogo, esperado)
    assert.equal(
      cliente.agregarSitioCatalogo('/public/productos'),
      `/public/productos?sitio=${esperado}`,
    )
    assert.equal(
      cliente.agregarSitioCatalogo('/public/productos/laptop-1?detalle=1'),
      `/public/productos/laptop-1?detalle=1&sitio=${esperado}`,
    )
  }
})

test('conserva el precio final entregado por la API', async (t) => {
  const { clienteApi, agregarSitioCatalogo } = await cargarCliente()
  simularFetch(t, async (url) => {
    assert.equal(url, 'https://local.example/api/public/productos?sitio=mipc')
    return new Response(JSON.stringify([{ id: 1, precio: 1150.25 }]), { status: 200 })
  })
  assert.deepEqual(await clienteApi.get(agregarSitioCatalogo('/public/productos')), [
    { id: 1, precio: 1150.25 },
  ])
})

test('expone el error de sitio y no cambia de API ante un rechazo', async (t) => {
  const { clienteApi } = await cargarCliente()
  let llamadas = 0
  simularFetch(t, async () => {
    llamadas += 1
    return new Response(JSON.stringify({ errors: { sitio: ['Sitio inactivo.'] } }), { status: 422 })
  })
  await assert.rejects(clienteApi.get('/public/productos?sitio=mipc'), {
    message: 'Sitio inactivo.',
    status: 422,
  })
  assert.equal(llamadas, 1)
})

test('no obtiene precios de respaldo si falla la lista o el detalle', async (t) => {
  const { clienteApi } = await cargarCliente()
  let llamadas = 0
  simularFetch(t, async () => {
    llamadas += 1
    throw new TypeError('Sin conexion')
  })
  for (const ruta of ['/public/productos?sitio=mipc', '/public/productos/laptop-1?sitio=mipc']) {
    await assert.rejects(clienteApi.get(ruta), /Sin conexion/)
  }
  assert.equal(llamadas, 2)
})

test('no reenvia cotizaciones a otra API tras un fallo de conexion', async (t) => {
  const { clienteApi } = await cargarCliente()
  let llamadas = 0
  simularFetch(t, async () => {
    llamadas += 1
    throw new TypeError('Sin conexion')
  })
  await assert.rejects(
    clienteApi.post('/public/cotizaciones?sitio=mipc', { productos: [] }),
    /Sin conexion/,
  )
  assert.equal(llamadas, 1)
})

test('conserva el respaldo para categorias ante fallos de red', async (t) => {
  t.mock.method(console, 'warn', () => {})
  const { clienteApi } = await cargarCliente()
  const urls = []
  simularFetch(t, async (url) => {
    urls.push(url)
    if (urls.length === 1) throw new TypeError('Sin conexion')
    return new Response('[]', { status: 200 })
  })
  assert.deepEqual(await clienteApi.get('/public/categorias?sitio=mipc'), [])
  assert.deepEqual(urls, [
    'https://local.example/api/public/categorias?sitio=mipc',
    'https://respaldo.example/api/public/categorias?sitio=mipc',
  ])
})

test('un error HTTP no dispara respaldo, aunque no sea un producto', async (t) => {
  const { clienteApi } = await cargarCliente()
  let llamadas = 0
  simularFetch(t, async () => {
    llamadas += 1
    return new Response('No encontrado', { status: 404 })
  })
  await assert.rejects(clienteApi.get('/public/categorias/no-existe?sitio=mipc'), { status: 404 })
  assert.equal(llamadas, 1)
})

test('busqueda, marca, categoria y limite de precio usan el precio publico', () => {
  for (const [precio, cantidadEsperada] of [
    [1000, 1],
    [1100, 1],
    [1150, 0],
  ]) {
    const catalogo = useCatalogo(
      ref([
        {
          id: 1,
          nombre: 'Laptop prueba',
          marca: { nombre: 'Marca prueba' },
          categoria: { slug: 'laptops' },
          precio,
        },
      ]),
    )
    catalogo.textoBusqueda.value = 'laptop'
    catalogo.categoriaSeleccionada.value = 'laptops'
    catalogo.marcaSeleccionada.value = 'Marca prueba'
    catalogo.precioMaximo.value = 1120
    assert.equal(catalogo.productosFiltrados.value.length, cantidadEsperada)
  }
})
