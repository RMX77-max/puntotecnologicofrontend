<template>
  <q-page class="pagina-informativa">
    <header class="encabezado-pagina">
      <p>Informacion</p>
      <h1>{{ tituloPagina }}</h1>
      <span>Contenido preparado para administrarse desde el backend mas adelante.</span>
    </header>

    <section class="pagina-informativa__contenido">
      <q-icon name="edit_note" size="54px" />
      <p>
        Esta seccion queda como base para paginas publicas como Acerca de, FEXCO / novedades
        y Contacto. Luego puede conectarse a contenido editable desde Laravel.
      </p>
    </section>
  </q-page>
</template>

<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import { useMeta } from 'quasar'
import 'src/css/pages/informativa.css'

const route = useRoute()
const titulos = {
  'acerca-de': 'Acerca de',
  novedades: 'FEXCO / novedades',
  contacto: 'Contacto',
}
const tituloPagina = computed(() => titulos[route.params.slug] || 'Pagina informativa')

useMeta(() => ({ title: `${tituloPagina.value} | Punto Tecnologico` }))
</script>
