import { computed, ref } from 'vue'

export function useCatalogo(productos) {
  const textoBusqueda = ref('')
  const categoriaSeleccionada = ref('')
  const marcaSeleccionada = ref('')
  const precioMaximo = ref(null)

  const marcasDisponibles = computed(() => {
    const nombresMarcas = productos.value.map((producto) => producto.marca?.nombre).filter(Boolean)

    return [...new Set(nombresMarcas)].sort()
  })

  const productosFiltrados = computed(() => {
    const busqueda = textoBusqueda.value.trim().toLowerCase()

    return productos.value.filter((producto) => {
      const coincideBusqueda =
        !busqueda ||
        producto.nombre.toLowerCase().includes(busqueda) ||
        producto.marca?.nombre?.toLowerCase().includes(busqueda)
      const coincideCategoria =
        !categoriaSeleccionada.value || producto.categoria?.slug === categoriaSeleccionada.value
      const coincideMarca = !marcaSeleccionada.value || producto.marca?.nombre === marcaSeleccionada.value
      const coincidePrecio = !precioMaximo.value || producto.precio <= precioMaximo.value

      return coincideBusqueda && coincideCategoria && coincideMarca && coincidePrecio
    })
  })

  return {
    textoBusqueda,
    categoriaSeleccionada,
    marcaSeleccionada,
    precioMaximo,
    marcasDisponibles,
    productosFiltrados,
  }
}
