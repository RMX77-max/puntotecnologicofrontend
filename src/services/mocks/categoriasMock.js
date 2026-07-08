import imagenAlmacenamientos from 'assets/imagenes/productos/categoria-almacenamientos.png'
import imagenGraficas from 'assets/imagenes/productos/categoria-graficas.png'
import imagenLaptops from 'assets/imagenes/productos/categoria-laptops.png'
import imagenProcesadores from 'assets/imagenes/productos/categoria-procesadores.png'
import imagenRam from 'assets/imagenes/productos/categoria-ram.png'

export const categoriasMock = [
  {
    id: 1,
    nombre: 'Laptops',
    slug: 'laptops',
    descripcion: 'Equipos portatiles para trabajo, estudio y gaming.',
    subtitulo: 'Gaming - Oficina - Creacion',
    icono: 'laptop_mac',
    imagen_url: imagenLaptops,
    destacada: true,
  },
  {
    id: 2,
    nombre: 'Procesadores',
    slug: 'procesadores',
    descripcion: 'CPUs AMD e Intel para alto rendimiento.',
    subtitulo: 'Intel - AMD',
    icono: 'memory',
    imagen_url: imagenProcesadores,
    destacada: true,
  },
  {
    id: 3,
    nombre: 'Memorias RAM',
    slug: 'memorias-ram',
    descripcion: 'Memorias DDR4 y DDR5 para mejorar tu equipo.',
    subtitulo: 'DDR5 - DDR4 - DDR3',
    icono: 'developer_board',
    imagen_url: imagenRam,
    destacada: true,
  },
  {
    id: 4,
    nombre: 'Tarjetas graficas',
    slug: 'tarjetas-graficas',
    descripcion: 'GPU para gaming, render y creacion de contenido.',
    subtitulo: 'NVIDIA - AMD',
    icono: 'view_in_ar',
    imagen_url: imagenGraficas,
    destacada: true,
  },
  {
    id: 5,
    nombre: 'Almacenamientos',
    slug: 'almacenamientos',
    descripcion: 'SSD, NVMe y discos para velocidad y respaldo.',
    subtitulo: 'SSD - M.2 - HDD',
    icono: 'storage',
    imagen_url: imagenAlmacenamientos,
    destacada: true,
  },
]
