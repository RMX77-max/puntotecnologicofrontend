<template>
  <q-header class="encabezado-principal">
    <div class="encabezado-principal__aviso">
      <span>Cotiza por WhatsApp</span>
      <span>Productos disponibles en tienda</span>
      <span>Envios coordinados</span>
    </div>

    <q-toolbar class="encabezado-principal__barra">
      <q-btn flat dense round icon="menu" class="lt-md" @click="$emit('abrir-menu')" />

      <router-link to="/" class="encabezado-principal__marca">
        <q-icon name="important_devices" size="30px" />
        <span>{{ configuracion?.nombre_tienda || 'Mi PC Computadoras' }}</span>
      </router-link>

      <nav class="encabezado-principal__nav gt-sm">
        <div
          v-for="grupoMenu in gruposMenu"
          :key="grupoMenu.nombre"
          class="mega-menu"
          @mouseenter="grupoActivo = grupoMenu.nombre"
          @mouseleave="grupoActivo = ''"
        >
          <router-link
            class="mega-menu__disparador"
            :to="grupoMenu.enlace"
            :class="{ 'mega-menu__disparador--activo': grupoActivo === grupoMenu.nombre }"
          >
            {{ grupoMenu.nombre }}
            <q-icon name="keyboard_arrow_down" size="20px" />
          </router-link>

          <div class="mega-menu__panel">
            <div class="mega-menu__descubre">
              <span>Descubrelo</span>
              <router-link :to="grupoMenu.enlace">Todo</router-link>
              <p>{{ grupoMenu.descripcion }}</p>
            </div>

            <div class="mega-menu__lista">
              <h3>{{ grupoMenu.nombre }}</h3>
              <router-link
                v-for="opcionMenu in grupoMenu.opciones"
                :key="opcionMenu.nombre"
                :to="opcionMenu.enlace"
              >
                {{ opcionMenu.nombre }}
              </router-link>
            </div>

            <div class="mega-menu__visuales">
              <router-link
                v-for="opcionDestacada in grupoMenu.destacadas"
                :key="opcionDestacada.nombre"
                :to="opcionDestacada.enlace"
                class="mega-menu__tarjeta"
              >
                <q-icon :name="opcionDestacada.icono" size="34px" />
                <span>{{ opcionDestacada.nombre }}</span>
              </router-link>
            </div>
          </div>
        </div>

        <router-link to="/catalogo">Catalogo</router-link>
        <a href="#contacto">Contacto</a>
      </nav>

      <q-space />

      <q-input
        v-model="busqueda"
        dense
        outlined
        placeholder="Buscar"
        class="encabezado-principal__buscador gt-xs"
        @keyup.enter="buscarProductos"
      >
        <template #append>
          <q-btn flat round dense icon="search" @click="buscarProductos">
            <q-tooltip>Buscar productos</q-tooltip>
          </q-btn>
        </template>
      </q-input>

      <q-btn class="encabezado-principal__carrito" flat round icon="shopping_cart" to="/carrito">
        <q-badge v-if="cantidadTotalProductos" color="primary" floating>
          {{ cantidadTotalProductos }}
        </q-badge>
        <q-tooltip>Carrito de cotizacion</q-tooltip>
      </q-btn>

      <q-btn
        class="encabezado-principal__whatsapp gt-xs"
        unelevated
        icon="phone"
        :href="`https://wa.me/${configuracion?.whatsapp_principal || ''}`"
        target="_blank"
      >
        <q-tooltip>Contactar por WhatsApp</q-tooltip>
      </q-btn>
    </q-toolbar>
    <MenuCategorias class="gt-sm" :categorias="categorias" />
  </q-header>
</template>

<script setup>
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import MenuCategorias from './MenuCategorias.vue'
import { useCarritoStore } from 'src/stores/carritoStore'
import 'src/css/components/layout.css'

defineProps({
  categorias: { type: Array, default: () => [] },
  configuracion: { type: Object, default: null },
})

defineEmits(['abrir-menu'])

const router = useRouter()
const carritoStore = useCarritoStore()
const busqueda = ref('')
const grupoActivo = ref('')
const cantidadTotalProductos = computed(() => carritoStore.cantidadTotalProductos)

const gruposMenu = [
  {
    nombre: 'Componentes',
    enlace: '/catalogo',
    descripcion: 'Piezas para armar, mejorar o renovar tu PC.',
    opciones: [
      { nombre: 'Gabinetes', enlace: '/buscar?q=gabinete' },
      { nombre: 'Procesadores AMD', enlace: '/categoria/procesadores' },
      { nombre: 'Procesadores Intel', enlace: '/categoria/procesadores' },
      { nombre: 'Placas Madre AMD', enlace: '/buscar?q=placa%20madre%20amd' },
      { nombre: 'Placas Madre Intel', enlace: '/buscar?q=placa%20madre%20intel' },
      { nombre: 'Memorias RAM', enlace: '/categoria/memorias-ram' },
      { nombre: 'Almacenamientos', enlace: '/categoria/almacenamientos' },
      { nombre: 'Graficas', enlace: '/categoria/tarjetas-graficas' },
      { nombre: 'Fuentes', enlace: '/buscar?q=fuente' },
      { nombre: 'Enfriamientos', enlace: '/buscar?q=enfriamiento' },
    ],
    destacadas: [
      { nombre: 'Procesadores', enlace: '/categoria/procesadores', icono: 'memory' },
      { nombre: 'RAM', enlace: '/categoria/memorias-ram', icono: 'developer_board' },
      { nombre: 'Graficas', enlace: '/categoria/tarjetas-graficas', icono: 'view_in_ar' },
      { nombre: 'SSD / NVMe', enlace: '/categoria/almacenamientos', icono: 'storage' },
    ],
  },
  {
    nombre: 'Perifericos',
    enlace: '/buscar?q=perifericos',
    descripcion: 'Accesorios para setup gamer, oficina y streaming.',
    opciones: [
      { nombre: 'Monitores', enlace: '/buscar?q=monitor' },
      { nombre: 'Teclados', enlace: '/buscar?q=teclado' },
      { nombre: 'Mouses', enlace: '/buscar?q=mouse' },
      { nombre: 'Microfonos', enlace: '/buscar?q=microfono' },
      { nombre: 'Auriculares', enlace: '/buscar?q=auriculares' },
      { nombre: 'Padmouses', enlace: '/buscar?q=padmouse' },
      { nombre: 'Sillas y Mesas', enlace: '/buscar?q=silla' },
      { nombre: 'Streaming', enlace: '/buscar?q=streaming' },
      { nombre: 'Mandos', enlace: '/buscar?q=mando' },
    ],
    destacadas: [
      { nombre: 'Monitores', enlace: '/buscar?q=monitor', icono: 'desktop_windows' },
      { nombre: 'Teclados', enlace: '/buscar?q=teclado', icono: 'keyboard' },
      { nombre: 'Mouses', enlace: '/buscar?q=mouse', icono: 'mouse' },
      { nombre: 'Streaming', enlace: '/buscar?q=streaming', icono: 'videocam' },
    ],
  },
  {
    nombre: 'Laptops',
    enlace: '/categoria/laptops',
    descripcion: 'Equipos listos para estudiar, trabajar, jugar y crear.',
    opciones: [
      { nombre: 'Laptops gamer', enlace: '/categoria/laptops' },
      { nombre: 'Laptops oficina', enlace: '/categoria/laptops' },
      { nombre: 'Workstations', enlace: '/categoria/laptops' },
      { nombre: 'Accesorios laptop', enlace: '/buscar?q=accesorio%20laptop' },
      { nombre: 'Memorias laptop', enlace: '/buscar?q=ram%20laptop' },
      { nombre: 'Almacenamiento laptop', enlace: '/buscar?q=ssd%20laptop' },
    ],
    destacadas: [
      { nombre: 'Gaming', enlace: '/categoria/laptops', icono: 'sports_esports' },
      { nombre: 'Trabajo', enlace: '/categoria/laptops', icono: 'business_center' },
      { nombre: 'Estudio', enlace: '/categoria/laptops', icono: 'school' },
      { nombre: 'Upgrade', enlace: '/buscar?q=upgrade%20laptop', icono: 'upgrade' },
    ],
  },
]

function buscarProductos() {
  const consulta = busqueda.value.trim()

  if (!consulta) return
  router.push({ path: '/buscar', query: { q: consulta } })
}
</script>
