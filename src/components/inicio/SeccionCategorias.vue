<template>
  <section v-if="categorias.length" v-revelar="{ efecto: 'subir' }" class="seccion-contenido">
    <div v-revelar="{ efecto: 'subir', retraso: 80 }" class="seccion-contenido__encabezado">
      <div>
        <p>{{ etiqueta }}</p>
        <h2>{{ titulo }}</h2>
      </div>
    </div>

    <div class="grilla-categorias">
      <TarjetaCategoria
        v-for="(categoria, indice) in categorias"
        :key="categoria.id"
        v-revelar="{ efecto: 'subir', retraso: 110 + indice * 80 }"
        :categoria="categoria"
        :indice="indice"
      />
    </div>
  </section>
</template>

<script setup>
import TarjetaCategoria from 'components/catalogo/TarjetaCategoria.vue'

defineProps({
  categorias: { type: Array, default: () => [] },
  etiqueta: { type: String, default: 'Categorias' },
  titulo: { type: String, default: 'Encuentra por tipo de producto' },
})
</script>
