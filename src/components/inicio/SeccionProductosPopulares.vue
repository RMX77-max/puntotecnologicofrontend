<template>
  <section v-if="productos.length" v-revelar="{ efecto: 'subir' }" class="seccion-contenido">
    <div v-revelar="{ efecto: 'subir', retraso: 80 }" class="seccion-contenido__encabezado">
      <div>
        <p>{{ etiqueta }}</p>
        <h2>{{ titulo }}</h2>
      </div>
    </div>

    <div class="grilla-productos">
      <TarjetaProducto
        v-for="(producto, indice) in productos"
        :key="producto.id"
        v-revelar="{ efecto: 'subir', retraso: 120 + indice * 90 }"
        :producto="producto"
      />
    </div>
  </section>
</template>

<script setup>
import TarjetaProducto from 'components/catalogo/TarjetaProducto.vue'

defineProps({
  productos: { type: Array, default: () => [] },
  etiqueta: { type: String, default: 'Populares' },
  titulo: { type: String, default: 'Productos mas consultados' },
})
</script>
