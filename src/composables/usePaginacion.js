import { computed, ref } from 'vue'

export function usePaginacion(listaBase, cantidadPorPagina = 8) {
  const paginaActual = ref(1)

  const totalPaginas = computed(() =>
    Math.max(1, Math.ceil(listaBase.value.length / cantidadPorPagina)),
  )

  const elementosPaginados = computed(() => {
    const inicio = (paginaActual.value - 1) * cantidadPorPagina

    return listaBase.value.slice(inicio, inicio + cantidadPorPagina)
  })

  function cambiarPagina(nuevaPagina) {
    paginaActual.value = Math.min(Math.max(1, nuevaPagina), totalPaginas.value)
  }

  function reiniciarPagina() {
    paginaActual.value = 1
  }

  return {
    paginaActual,
    totalPaginas,
    elementosPaginados,
    cambiarPagina,
    reiniciarPagina,
  }
}
