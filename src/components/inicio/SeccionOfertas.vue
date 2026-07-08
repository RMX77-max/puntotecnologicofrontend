<template>
  <section v-revelar="{ efecto: 'subir' }" class="seccion-contenido">
    <div v-revelar="{ efecto: 'subir', retraso: 80 }" class="seccion-contenido__encabezado">
      <div>
        <p>{{ etiqueta }}</p>
        <h2>{{ titulo }}</h2>
      </div>
      <q-btn flat color="primary" label="Ver catalogo" to="/catalogo" />
    </div>

    <div v-if="productos.length" class="grilla-productos">
      <TarjetaProducto
        v-for="(producto, indice) in productos"
        :key="producto.id"
        v-revelar="{ efecto: 'subir', retraso: 120 + indice * 90 }"
        :producto="producto"
      />
    </div>

    <div v-else class="estado-catalogo">
      <q-icon name="inventory_2" size="46px" />
      <span>Pronto mostraremos productos destacados.</span>
    </div>
  </section>
</template>

<script setup>
import TarjetaProducto from 'components/catalogo/TarjetaProducto.vue'

defineProps({
  productos: { type: Array, default: () => [] },
  etiqueta: { type: String, default: 'Ofertas' },
  titulo: { type: String, default: 'Imperdibles de la semana' },
})
</script>
