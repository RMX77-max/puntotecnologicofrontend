<template>
  <q-page class="pagina-inicio">
    <q-inner-loading :showing="catalogoStore.cargando" color="primary" />

    <BannerPromocional :banners="bannersPrincipales" />

    <SeccionBannerProductos
      etiqueta="Ofertas"
      titulo="Ofertas imperdibles"
      :productos="productosOfertas"
      etiqueta-banner="Banner promocional"
      titulo-banner="Espacio para banner de ofertas"
      descripcion-banner="Aqui ira una campana comercial junto a productos destacados."
      icono-banner="local_offer"
      variante="compacta"
      :banner="bannerOfertas"
    />

    <SeccionBannerProductos
      etiqueta="Categoria destacada"
      titulo="Notebooks y PCs armados"
      :productos="productosNotebooks"
      etiqueta-banner="Banner de categoria"
      titulo-banner="Espacio para notebooks y equipos armados"
      descripcion-banner="Banner amplio para una familia de productos con articulos al lado."
      icono-banner="important_devices"
      variante="ancha"
      :banner="bannerNotebooks"
    />

    <section
      v-revelar="{ efecto: 'subir' }"
      class="banner-horizontal-home"
      :class="{ 'banner-horizontal-home--con-imagen': Boolean(bannerHorizontal?.imagen_url) }"
    >
      <img
        v-if="bannerHorizontal?.imagen_url"
        :src="bannerHorizontal.imagen_url"
        :alt="bannerHorizontal.titulo || 'Banner horizontal'"
      />
      <template v-else>
        <q-icon name="panorama_wide_angle" size="46px" />
        <div>
          <span>Banner horizontal</span>
          <strong>Espacio para campana extendida</strong>
          <small>Banner ancho para liquidaciones, temporadas o marcas destacadas.</small>
        </div>
      </template>
    </section>

    <SeccionCategorias :categorias="categoriasInicio" />
    <SeccionProductosPopulares :productos="productosPopularesInicio" />
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
  title: 'Mi PC Computadoras | Catalogo tecnologico',
  meta: {
    description: {
      name: 'description',
      content: 'Catalogo de productos tecnologicos con cotizacion por WhatsApp.',
    },
  },
})

const catalogoStore = useCatalogoStore()
const configuracionStore = useConfiguracionStore()

function bannersPorUbicacion(ubicacion) {
  return catalogoStore.banners
    .filter((banner) => banner.ubicacion === ubicacion)
    .sort((a, b) => Number(a.orden || 0) - Number(b.orden || 0))
}

const bannersPrincipales = computed(() => bannersPorUbicacion('principal'))
const bannerOfertas = computed(() => bannersPorUbicacion('ofertas')[0] || null)
const bannerNotebooks = computed(() => bannersPorUbicacion('notebooks')[0] || null)
const bannerHorizontal = computed(() => bannersPorUbicacion('horizontal')[0] || null)
const categoriasInicio = computed(() => catalogoStore.categoriasDestacadas.slice(0, 8))
const productosDisponibles = computed(() =>
  catalogoStore.productos.filter((producto) => producto.stock_publico?.disponible),
)
const productosOfertas = computed(() => {
  const ofertas = catalogoStore.ofertas.slice(0, 8)

  if (ofertas.length) return ofertas

  return productosDisponibles.value.slice(0, 3)
})
const productosNotebooks = computed(() => {
  const portatiles = productosDisponibles.value
    .filter((producto) => {
      const texto = `${producto.nombre} ${producto.categoria?.nombre || ''}`.toLowerCase()

      return texto.includes('laptop') || texto.includes('portatil') || texto.includes('notebook')
    })
    .slice(0, 2)

  if (portatiles.length) return portatiles

  return productosDisponibles.value.slice(3, 5)
})
const productosPopularesInicio = computed(() => productosDisponibles.value.slice(5, 13))
</script>
