<template>
  <section v-revelar="{ efecto: 'subir' }" class="seccion-contenido">
    <div v-revelar="{ efecto: 'subir', retraso: 80 }" class="seccion-contenido__encabezado">
      <div>
        <p>Categorias</p>
        <h2>Encuentra por tipo de producto</h2>
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
})
</script>
