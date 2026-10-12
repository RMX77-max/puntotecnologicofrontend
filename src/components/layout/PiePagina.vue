<template>
  <footer class="pie-pagina" id="contacto">
    <div class="pie-pagina__contenido">
      <section class="pie-pagina__marca">
        <h2>{{ configuracion?.nombre_tienda || 'Punto Tecnologico' }}</h2>
        <p>{{ configuracion?.texto_footer || 'Catalogo tecnologico con cotizacion directa por WhatsApp.' }}</p>
      </section>

      <section>
        <h3>Paginas</h3>
        <router-link to="/acerca-de">Acerca de</router-link>
        <router-link to="/novedades">Novedades</router-link>
        <router-link to="/contacto">Contacto</router-link>
      </section>

      <section>
        <h3>Categorias</h3>
        <router-link v-for="categoria in categoriasVisibles" :key="categoria.id" :to="`/categoria/${categoria.slug}`">
          {{ categoria.nombre }}
        </router-link>
        <router-link class="pie-pagina__ver-todo" to="/catalogo">
          Ver todo el catalogo
        </router-link>
      </section>

      <section>
        <h3>Redes</h3>
        <a v-if="configuracion?.redes_sociales?.facebook" :href="configuracion.redes_sociales.facebook" target="_blank" rel="noreferrer">
          Facebook
        </a>
        <a v-if="configuracion?.redes_sociales?.instagram" :href="configuracion.redes_sociales.instagram" target="_blank" rel="noreferrer">
          Instagram
        </a>
        <a v-if="configuracion?.redes_sociales?.tiktok" :href="configuracion.redes_sociales.tiktok" target="_blank" rel="noreferrer">
          TikTok
        </a>
      </section>

      <section>
        <h3>Ubicacion</h3>
        <p>{{ configuracion?.ubicacion?.ciudad || 'Bolivia' }}</p>
        <p>{{ configuracion?.ubicacion?.direccion || 'Consulta disponibilidad y atencion por WhatsApp.' }}</p>
        <a v-if="configuracion?.ubicacion?.enlace_mapa" :href="configuracion.ubicacion.enlace_mapa" target="_blank" rel="noreferrer">
          Como llegar
        </a>
      </section>
    </div>

    <div class="pie-pagina__copyright">
      © {{ anioActual }} {{ configuracion?.nombre_tienda || 'Punto Tecnologico' }}. Todos los derechos reservados.
    </div>
  </footer>
</template>

<script setup>
import { computed } from 'vue'

const anioActual = new Date().getFullYear()

const props = defineProps({
  categorias: { type: Array, default: () => [] },
  configuracion: { type: Object, default: null },
})

const categoriasPrioritarias = [
  'laptops',
  'portatil',
  'procesadores',
  'placa-madre',
  'memoria-ram',
  'monitor',
  'disco-solido',
  'mouse',
  'teclado',
  'audifono',
]

const categoriasVisibles = computed(() => {
  const categoriasOrdenadas = [...props.categorias].sort((a, b) => {
    const indiceA = categoriasPrioritarias.indexOf(a.slug)
    const indiceB = categoriasPrioritarias.indexOf(b.slug)
    const pesoA = indiceA === -1 ? 999 : indiceA
    const pesoB = indiceB === -1 ? 999 : indiceB

    if (pesoA !== pesoB) return pesoA - pesoB
    return a.nombre.localeCompare(b.nombre)
  })

  return categoriasOrdenadas.slice(0, 8)
})
</script>
