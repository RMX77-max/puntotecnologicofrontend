<template>
  <section v-if="productos.length" v-revelar="{ efecto: 'subir' }" class="seccion-contenido">
    <div v-revelar="{ efecto: 'subir', retraso: 80 }" class="seccion-contenido__encabezado">
      <div>
        <p>Populares</p>
        <h2>Productos mas consultados</h2>
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
})
</script>
