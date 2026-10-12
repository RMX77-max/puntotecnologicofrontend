<template>
  <router-link
    class="tarjeta-categoria"
    :to="`/categoria/${categoria.slug}`"
  >
    <div class="tarjeta-categoria__imagen">
      <img v-if="imagenCategoria" :src="imagenCategoria" :alt="categoria.nombre" loading="lazy" />
      <q-icon v-else :name="categoria.icono || 'category'" size="42px" />
    </div>

    <div class="tarjeta-categoria__contenido">
      <h3>{{ categoria.nombre }}</h3>
      <p>{{ categoria.subtitulo || categoria.descripcion }}</p>
    </div>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import imagenAccesorios from 'assets/imagenes/categorias/accesorios.jpg'
import imagenAdaptador from 'assets/imagenes/categorias/adaptador.jpg'
import imagenAudifonos from 'assets/imagenes/categorias/audifonos.jpg'
import imagenAuriculares from 'assets/imagenes/categorias/auriculares.jpg'
import imagenCamara from 'assets/imagenes/categorias/camara.jpg'
import imagenCargador from 'assets/imagenes/categorias/cargador.jpg'
import imagenCase from 'assets/imagenes/categorias/case.jpg'
import imagenLaptopEstudio from 'assets/imagenes/categorias/laptop estudio.jpg'
import imagenLaptopGaming from 'assets/imagenes/categorias/laptop gaming.jpg'
import imagenMicrofonos from 'assets/imagenes/categorias/microfonos.avif'
import imagenMonitores from 'assets/imagenes/categorias/monitores.avif'
import imagenMouse from 'assets/imagenes/categorias/mouse.avif'
import imagenPadmouse from 'assets/imagenes/categorias/padmouse.jpg'
import imagenSillasMesas from 'assets/imagenes/categorias/sillas-mesas.avif'
import imagenStreaming from 'assets/imagenes/categorias/streaming.jpg'
import imagenTeclados from 'assets/imagenes/categorias/teclados.avif'
import 'src/css/components/tarjeta-producto.css'

const props = defineProps({
  categoria: { type: Object, required: true },
  indice: { type: Number, default: 0 },
})

const imagenesPorCategoria = [
  { claves: ['laptop gamer', 'laptops gamer', 'laptop gaming', 'gaming'], imagen: imagenLaptopGaming },
  { claves: ['laptop estudio', 'laptops estudio', 'estudio'], imagen: imagenLaptopEstudio },
  { claves: ['accesorio', 'accesorios'], imagen: imagenAccesorios },
  { claves: ['adaptador', 'adaptadores'], imagen: imagenAdaptador },
  { claves: ['auricular', 'auriculares'], imagen: imagenAuriculares },
  { claves: ['audifono', 'audifonos'], imagen: imagenAudifonos },
  { claves: ['camara', 'camaras', 'webcam'], imagen: imagenCamara },
  { claves: ['cargador', 'cargadores'], imagen: imagenCargador },
  { claves: ['case', 'cases', 'funda'], imagen: imagenCase },
  { claves: ['microfono', 'microfonos'], imagen: imagenMicrofonos },
  { claves: ['monitor', 'monitores'], imagen: imagenMonitores },
  { claves: ['mouse', 'mouses'], imagen: imagenMouse },
  { claves: ['alfombra', 'padmouse', 'padmouses', 'mousepad'], imagen: imagenPadmouse },
  { claves: ['silla', 'sillas', 'mesa', 'mesas'], imagen: imagenSillasMesas },
  { claves: ['streaming', 'stream'], imagen: imagenStreaming },
  { claves: ['teclado', 'teclados'], imagen: imagenTeclados },
]

function normalizarTexto(texto) {
  return String(texto || '')
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

const imagenCategoria = computed(() => {
  if (props.categoria.imagen_url) return props.categoria.imagen_url

  const textoCategoria = normalizarTexto(`${props.categoria.slug || ''} ${props.categoria.nombre || ''}`)
  const coincidencia = imagenesPorCategoria.find(({ claves }) =>
    claves.some((clave) => textoCategoria.includes(clave)),
  )

  return coincidencia?.imagen || null
})
</script>
