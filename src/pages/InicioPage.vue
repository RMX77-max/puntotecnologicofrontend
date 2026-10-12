<template>
  <q-page class="pagina-inicio pagina-inicio--punto">
    <q-inner-loading :showing="catalogoStore.cargando" color="primary" />

    <BannerPromocional :banners="bannersPrincipales" />

    <section v-revelar="{ efecto: 'subir' }" class="seccion-contenido punto-zonas-home">
      <div v-revelar="{ efecto: 'subir', retraso: 80 }" class="seccion-contenido__encabezado">
        <div>
          <p>Zonas gamer</p>
          <h2>Busca por setup, categoria o componente</h2>
        </div>
      </div>

      <div class="punto-zonas-home__grid">
        <router-link
          v-for="(zona, indice) in zonasGamer"
          :key="zona.texto"
          v-revelar="{ efecto: 'subir', retraso: 110 + indice * 65 }"
          :to="zona.enlace"
          class="punto-zonas-home__item"
        >
          <q-icon :name="zona.icono" size="28px" />
          <span>{{ zona.texto }}</span>
          <small>{{ zona.descripcion }}</small>
        </router-link>
      </div>
    </section>

    <SeccionBannerProductos
      etiqueta="Promociones y ofertas"
      titulo="Ofertas activas"
      :productos="productosOfertas"
      etiqueta-banner="Banners"
      titulo-banner="Promociones principales"
      descripcion-banner="Espacio para banners de temporada, combos gamer y descuentos destacados."
      icono-banner="local_offer"
      variante="compacta"
      :banner="bannerOfertas"
    />

    <section v-revelar="{ efecto: 'subir' }" class="seccion-contenido ultimas-busquedas-home">
      <div v-revelar="{ efecto: 'subir', retraso: 80 }" class="seccion-contenido__encabezado">
        <div>
          <p>Ultimas busquedas</p>
          <h2>Accesos rapidos</h2>
        </div>
      </div>

      <div class="ultimas-busquedas-home__lista">
        <router-link
          v-for="busqueda in busquedasRapidas"
          :key="busqueda.texto"
          :to="busqueda.enlace"
          class="ultimas-busquedas-home__item"
        >
          <q-icon :name="busqueda.icono" size="22px" />
          <span>{{ busqueda.texto }}</span>
        </router-link>
      </div>
    </section>

    <SeccionCategorias
      etiqueta="Categorias"
      titulo="Todo para completar tu estacion"
      :categorias="categoriasInicio"
    />

    <SeccionProductosPopulares
      etiqueta="Los mas vendidos"
      titulo="Productos favoritos de la tienda"
      :productos="productosMasVendidos"
    />

    <SeccionUbicacion :configuracion="configuracionStore.configuracion" />
  </q-page>
</template>

<script setup>
import { useMeta } from 'quasar'
import { computed } from 'vue'
import BannerPromocional from 'components/inicio/BannerPromocional.vue'
import SeccionBannerProductos from 'components/inicio/SeccionBannerProductos.vue'
import SeccionCategorias from 'components/inicio/SeccionCategorias.vue'
import SeccionProductosPopulares from 'components/inicio/SeccionProductosPopulares.vue'
import SeccionUbicacion from 'components/inicio/SeccionUbicacion.vue'
import { useCatalogoStore } from 'src/stores/catalogoStore'
import { useConfiguracionStore } from 'src/stores/configuracionStore'
import 'src/css/pages/inicio.css'

useMeta({
  title: 'Punto Tecnologico | Catalogo tecnologico',
  meta: {
    description: {
      name: 'description',
      content: 'Catalogo de productos tecnologicos con cotizacion por WhatsApp.',
    },
  },
})

const catalogoStore = useCatalogoStore()
const configuracionStore = useConfiguracionStore()

const zonasGamer = [
  { texto: 'Perifericos', descripcion: 'Mouse, teclado, audio y setup', enlace: '/buscar?q=perifericos', icono: 'keyboard' },
  { texto: 'Monitores', descripcion: 'Pantallas para jugar y trabajar', enlace: '/buscar?q=monitor', icono: 'desktop_windows' },
  { texto: 'Laptops', descripcion: 'Portatiles gamer y oficina', enlace: '/categoria/laptops', icono: 'laptop' },
  { texto: 'Componentes', descripcion: 'RAM, SSD, fuentes y upgrades', enlace: '/catalogo', icono: 'memory' },
]

const busquedasRapidas = [
  { texto: 'Componentes', enlace: '/catalogo', icono: 'memory' },
  { texto: 'Laptops', enlace: '/categoria/laptops', icono: 'laptop' },
  { texto: 'Perifericos', enlace: '/buscar?q=perifericos', icono: 'keyboard' },
  { texto: 'Monitores', enlace: '/buscar?q=monitor', icono: 'desktop_windows' },
  { texto: 'Impresoras', enlace: '/buscar?q=impresora', icono: 'print' },
  { texto: 'Accesorios', enlace: '/buscar?q=accesorio', icono: 'extension' },
  { texto: 'Teclados mecanicos', enlace: '/buscar?q=teclado%20mecanico', icono: 'keyboard_alt' },
  { texto: 'Mouses', enlace: '/buscar?q=mouse', icono: 'mouse' },
]

function bannersPorUbicacion(ubicacion) {
  return catalogoStore.banners
    .filter((banner) => banner.ubicacion === ubicacion)
    .sort((a, b) => Number(a.orden || 0) - Number(b.orden || 0))
}

const bannersPrincipales = computed(() => bannersPorUbicacion('principal'))
const bannerOfertas = computed(() => bannersPorUbicacion('ofertas')[0] || null)
const categoriasInicio = computed(() => catalogoStore.categoriasDestacadas.slice(0, 8))
const productosDisponibles = computed(() =>
  catalogoStore.productos.filter((producto) => producto.stock_publico?.disponible),
)
const productosOfertas = computed(() => {
  const ofertas = catalogoStore.ofertas.slice(0, 3)

  if (ofertas.length) return ofertas

  return productosDisponibles.value.slice(0, 3)
})
const productosMasVendidos = computed(() => {
  const destacados = catalogoStore.productosPopulares.slice(0, 8)

  if (destacados.length) return destacados

  return productosDisponibles.value.slice(3, 11)
})
</script>
