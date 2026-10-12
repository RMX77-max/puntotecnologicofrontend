import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import test from 'node:test'
import { ref } from 'vue'
import { createPinia, setActivePinia } from 'pinia'

const raiz = new URL('../', import.meta.url)
const entorno = { VITE_API_URL: 'https://api.example.test/api', VITE_SITIO_CATALOGO: 'mipc' }
const modulos = new Map()

// Cargar los modulos reales, sustituyendo solamente las variables que Vite inyecta.
async function urlModulo(ruta) {
  const url = new URL(ruta, raiz)
  if (modulos.has(url.href)) return modulos.get(url.href)
  let codigo = (await readFile(url, 'utf8')).replaceAll(
    'import.meta.env',
    `(${JSON.stringify(entorno)})`,
  )
  for (const coincidencia of [...codigo.matchAll(/from\s+['"]([^'"]+)['"]/g)]) {
    const nombre = coincidencia[1]
    const dependencia = nombre.startsWith('.')
      ? await urlModulo(new URL(nombre, url))
      : import.meta.resolve(nombre)
    codigo = codigo.replace(coincidencia[0], `from '${dependencia}'`)
  }
  const resultado = `data:text/javascript;base64,${Buffer.from(codigo).toString('base64')}`
  modulos.set(url.href, resultado)
  return resultado
}

const { crearCotizacion, previsualizarCotizacion } = await import(
  await urlModulo('src/services/api/cotizacionesServicio.js')
)
const { useWhatsapp } = await import(await urlModulo('src/composables/useWhatsapp.js'))
const { useCarritoStore } = await import(await urlModulo('src/stores/carritoStore.js'))
const { formatearPrecio } = await import(await urlModulo('src/utils/formatearPrecio.js'))

const productos = [{ id: 1, cantidad: 2, precio: 0.01, nombre: 'Manipulado' }]
const confirmada = {
  sitio: 'mipc',
  codigo: 'COT-prueba',
  total: '2300.50',
  moneda: 'Bs',
  productos: [
    { id: 1, cantidad: 2, precio: '1150.25', subtotal: '2300.50', nombre: 'Laptop real' },
  ],
  cliente: { nombre: 'Cliente confirmado' },
}

function simular(t, objeto, propiedad, valor) {
  const original = objeto[propiedad]
  objeto[propiedad] = valor
  t.after(() => {
    objeto[propiedad] = original
  })
}

function respuesta(datos = confirmada, status = 200) {
  return new Response(JSON.stringify(datos), { status })
}

test('envia solo identificadores, cantidades y cliente al crear la cotizacion', async (t) => {
  simular(t, globalThis, 'fetch', async (url, opciones) => {
    assert.equal(url, 'https://api.example.test/api/public/cotizaciones?sitio=mipc')
    assert.deepEqual(JSON.parse(opciones.body), {
      productos: [{ id: 1, cantidad: 2 }],
      cliente: { nombre: 'Cliente' },
    })
    return respuesta(confirmada, 201)
  })
  assert.equal(
    (await crearCotizacion({ productos, total: 0.01, cliente: { nombre: 'Cliente' } })).total,
    '2300.50',
  )
})

test('rechaza respuestas de otro sitio o sin precios confirmados', async (t) => {
  for (const datos of [
    { ...confirmada, sitio: 'overcity' },
    { codigo: 'COT-antiguo' },
    { ...confirmada, productos: [] },
  ]) {
    simular(t, globalThis, 'fetch', async () => respuesta(datos))
    await assert.rejects(previsualizarCotizacion(productos), /no confirmó/)
  }
})

test('WhatsApp usa los productos, importes y codigo confirmados por el backend', async (t) => {
  let destino = ''
  const ventana = {
    opener: {},
    closed: false,
    location: {
      replace(url) {
        destino = url
      },
    },
    close() {},
  }
  simular(t, globalThis, 'window', { open: () => ventana })
  simular(t, globalThis, 'fetch', async () => respuesta(confirmada, 201))
  const { abrirWhatsapp } = useWhatsapp(ref({ whatsapp_principal: '+591 70000000' }))
  const resultado = await abrirWhatsapp({
    productosCotizacion: productos,
    datosCliente: { nombre: 'Cliente' },
  })
  const mensaje = new URL(destino).searchParams.get('text')
  assert.equal(ventana.opener, null)
  assert.ok(mensaje.includes('Laptop real'))
  assert.ok(mensaje.includes(formatearPrecio('1150.25')))
  assert.ok(mensaje.includes(formatearPrecio('2300.50')))
  assert.ok(mensaje.includes('COT-prueba'))
  assert.ok(!mensaje.includes('Manipulado'))
  assert.equal(resultado.cotizacion.total, '2300.50')
})

test('el detalle consulta precios antes de construir WhatsApp y ofrece enlace si se bloquea la ventana', async (t) => {
  simular(t, globalThis, 'window', { open: () => null })
  simular(t, globalThis, 'fetch', async (url) => {
    assert.ok(url.includes('/cotizaciones/previsualizar?sitio=mipc'))
    return respuesta({ ...confirmada, codigo: null, cliente: [] })
  })
  const { abrirWhatsapp } = useWhatsapp(ref({ whatsapp_principal: '59170000000' }))
  const resultado = await abrirWhatsapp({ productosCotizacion: productos })
  assert.ok(resultado.url.startsWith('https://wa.me/59170000000?text='))
})

test('un rechazo de la API cierra la ventana y no abre WhatsApp', async (t) => {
  let cerrada = false
  simular(t, globalThis, 'window', {
    open: () => ({
      closed: false,
      close() {
        cerrada = true
      },
      location: {
        replace() {
          assert.fail('No debe navegar')
        },
      },
    }),
  })
  simular(t, globalThis, 'fetch', async () =>
    respuesta({ message: 'Producto no disponible.' }, 422),
  )
  const { abrirWhatsapp } = useWhatsapp(ref({ whatsapp_principal: '59170000000' }))
  await assert.rejects(abrirWhatsapp({ productosCotizacion: productos }), /Producto no disponible/)
  assert.equal(cerrada, true)
})

test('el carrito descarta entradas invalidas y reemplaza precios antiguos por los confirmados', (t) => {
  let guardado = JSON.stringify([
    null,
    { id: 1, cantidad: 2, precio: 0.01 },
    { id: 1, cantidad: 7 },
    { id: -2 },
  ])
  simular(t, globalThis, 'localStorage', {
    getItem: () => guardado,
    setItem: (_clave, valor) => {
      guardado = valor
    },
  })
  setActivePinia(createPinia())
  const carrito = useCarritoStore()
  carrito.cargarCarritoLocal()
  assert.equal(carrito.productosCotizacion.length, 1)
  carrito.actualizarDesdeCotizacion(confirmada)
  assert.equal(carrito.totalCotizacion, 2300.5)
  assert.equal(JSON.parse(guardado)[0].precio, 1150.25)
  carrito.actualizarCantidad(1, 1.8)
  assert.equal(carrito.productosCotizacion[0].cantidad, 1)
})

test('los precios conservan dos decimales en las tarjetas y mensajes', () => {
  const esperado = new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(1150.25)
  assert.equal(formatearPrecio(1150.25), `Bs ${esperado}`)
  assert.ok(formatearPrecio(0.06).endsWith('06'))
})
