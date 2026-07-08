<template>
  <section class="banner-promocional">
    <q-carousel
      v-if="hayBanners && usarCarrusel"
      v-model="bannerActivo"
      animated
      infinite
      autoplay
      arrows
      navigation
      height="100%"
      class="banner-promocional__carrusel"
    >
      <q-carousel-slide
        v-for="banner in bannersVisibles"
        :key="banner.id"
        :name="banner.id"
        class="banner-promocional__slide"
      >
        <img :src="banner.imagen_url" :alt="banner.titulo" class="banner-promocional__imagen" />
      </q-carousel-slide>
    </q-carousel>

    <template v-else-if="hayBanners && bannerPrincipal">
      <img
        :src="bannerPrincipal.imagen_url"
        :alt="bannerPrincipal.titulo || 'Banner principal'"
        class="banner-promocional__imagen"
      />
    </template>

    <div v-else class="banner-promocional__placeholder">
      <q-icon name="panorama" size="52px" />
      <div>
        <span>Banner carrusel principal</span>
        <strong>Espacio superior para campana destacada</strong>
        <small>Formato horizontal grande para promociones principales.</small>
      </div>
    </div>
  </section>
</template>

<script setup>
import { computed, ref, watch } from 'vue'
import 'src/css/components/banner-promocional.css'

const props = defineProps({
  banners: { type: Array, default: () => [] },
})

const hayBanners = computed(() => props.banners.length > 0)
const bannersVisibles = computed(() => props.banners)
const bannerPrincipal = computed(() => bannersVisibles.value[0])
const usarCarrusel = computed(() => bannersVisibles.value.length > 1)
const bannerActivo = ref(bannerPrincipal.value?.id)

watch(
  bannersVisibles,
  (bannersActuales) => {
    if (!bannersActuales.some((banner) => banner.id === bannerActivo.value)) {
      bannerActivo.value = bannersActuales[0]?.id
    }
  },
  { immediate: true },
)
</script>
