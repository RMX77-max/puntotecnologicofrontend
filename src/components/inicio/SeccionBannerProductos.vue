<template>
  <section v-revelar="{ efecto: 'subir' }" class="seccion-banner-productos" :class="clasesSeccion">
    <header class="seccion-banner-productos__encabezado">
      <p>{{ etiqueta }}</p>
      <h2>{{ titulo }}</h2>
    </header>

    <div class="seccion-banner-productos__contenido">
      <router-link
        class="seccion-banner-productos__banner"
        :class="{ 'seccion-banner-productos__banner--con-imagen': Boolean(banner?.imagen_url) }"
        :to="banner?.enlace || enlaceBanner"
      >
        <img
          v-if="banner?.imagen_url"
          :src="banner.imagen_url"
          :alt="banner.titulo || tituloBanner"
        />
        <template v-else>
          <q-icon :name="iconoBanner" size="44px" />
          <div>
            <span>{{ etiquetaBanner }}</span>
            <strong>{{ tituloBanner }}</strong>
            <small>{{ descripcionBanner }}</small>
          </div>
        </template>
      </router-link>

      <div v-if="productos.length" class="seccion-banner-productos__productos">
        <TarjetaProducto
          v-for="(producto, indice) in productos"
          :key="producto.id"
          v-revelar="{ efecto: 'subir', retraso: 90 + indice * 70 }"
          :producto="producto"
        />
      </div>

      <div v-else class="estado-catalogo">
        <q-icon name="inventory_2" size="44px" />
        <span>No hay productos para esta seccion.</span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed } from 'vue'
import TarjetaProducto from 'components/catalogo/TarjetaProducto.vue'

const props = defineProps({
  etiqueta: { type: String, default: 'Seccion' },
  titulo: { type: String, required: true },
  productos: { type: Array, default: () => [] },
  variante: { type: String, default: 'normal' },
  etiquetaBanner: { type: String, default: 'Banner de seccion' },
  tituloBanner: { type: String, default: 'Espacio para banner' },
  descripcionBanner: { type: String, default: 'Aqui ira una imagen promocional relacionada con esta seccion.' },
  enlaceBanner: { type: String, default: '/catalogo' },
  iconoBanner: { type: String, default: 'panorama' },
  banner: { type: Object, default: null },
})

const clasesSeccion = computed(() => ({
  'seccion-banner-productos--compacta': props.variante === 'compacta',
  'seccion-banner-productos--ancha': props.variante === 'ancha',
}))
</script>
