<template>
  <q-layout view="lHh Lpr lFf">
    <EncabezadoPrincipal
      :categorias="catalogoStore.categorias"
      :configuracion="configuracionStore.configuracion"
      @abrir-menu="toggleLeftDrawer"
    />

    <q-drawer v-model="leftDrawerOpen" side="left" bordered class="drawer-catalogo">
      <q-list>
        <q-item-label header> Menu</q-item-label>
        <q-item clickable v-ripple to="/" @click="leftDrawerOpen = false">
          <q-item-section avatar><q-icon name="home" /></q-item-section>
          <q-item-section>Inicio</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/catalogo" @click="leftDrawerOpen = false">
          <q-item-section avatar><q-icon name="storefront" /></q-item-section>
          <q-item-section>Catalogo</q-item-section>
        </q-item>
        <q-item clickable v-ripple to="/carrito" @click="leftDrawerOpen = false">
          <q-item-section avatar><q-icon name="shopping_cart" /></q-item-section>
          <q-item-section>Carrito</q-item-section>
        </q-item>

        <q-separator spaced />
        <q-item-label header>Categorias</q-item-label>
        <q-item
          v-for="categoria in catalogoStore.categorias"
          :key="categoria.id"
          clickable
          v-ripple
          :to="`/categoria/${categoria.slug}`"
          @click="leftDrawerOpen = false"
        >
          <q-item-section avatar><q-icon :name="categoria.icono" /></q-item-section>
          <q-item-section>{{ categoria.nombre }}</q-item-section>
        </q-item>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

    <PiePagina
      :categorias="catalogoStore.categorias"
      :configuracion="configuracionStore.configuracion"
    />
  </q-layout>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import EncabezadoPrincipal from 'components/layout/EncabezadoPrincipal.vue'
import PiePagina from 'components/layout/PiePagina.vue'
import { useCatalogoStore } from 'src/stores/catalogoStore'
import { useConfiguracionStore } from 'src/stores/configuracionStore'
import { useCarritoStore } from 'src/stores/carritoStore'

const leftDrawerOpen = ref(false)
const catalogoStore = useCatalogoStore()
const configuracionStore = useConfiguracionStore()
const carritoStore = useCarritoStore()

onMounted(async () => {
  carritoStore.cargarCarritoLocal()
  await Promise.all([catalogoStore.cargarCatalogo(), configuracionStore.cargarConfiguracion()])
})

function toggleLeftDrawer() {
  leftDrawerOpen.value = !leftDrawerOpen.value
}
</script>
