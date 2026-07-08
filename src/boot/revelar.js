import { boot } from 'quasar/wrappers'

const observadores = new WeakMap()

function obtenerOpciones(valor) {
  if (typeof valor === 'string') {
    return { efecto: valor }
  }

  return valor || {}
}

export default boot(({ app }) => {
  app.directive('revelar', {
    mounted(elemento, binding) {
      const opciones = obtenerOpciones(binding.value)
      const efecto = opciones.efecto || 'subir'
      const retraso = Number(opciones.retraso || 0)

      elemento.classList.add('revelar', `revelar--${efecto}`)
      elemento.style.setProperty('--retraso-revelar', `${retraso}ms`)

      if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        elemento.classList.add('revelar--visible')
        return
      }

      const observador = new IntersectionObserver(
        ([entrada]) => {
          if (!entrada.isIntersecting) return

          elemento.classList.add('revelar--visible')
          observador.unobserve(elemento)
        },
        {
          threshold: opciones.umbral || 0.16,
          rootMargin: opciones.margen || '0px 0px -8% 0px',
        },
      )

      observadores.set(elemento, observador)
      observador.observe(elemento)
    },
    unmounted(elemento) {
      const observador = observadores.get(elemento)
      if (!observador) return

      observador.disconnect()
      observadores.delete(elemento)
    },
  })
})
