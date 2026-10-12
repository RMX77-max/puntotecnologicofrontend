import logoPuntoTecnologico from 'src/assets/imagenes/marca/logo-punto-tecnologico.png'

export const configuracionMock = {
  nombre_tienda: 'Punto Tecnologico',
  logo_url: logoPuntoTecnologico,
  whatsapp_principal: '59170000000',
  whatsapp_secundario: '59170000001',
  moneda: 'Bs',
  redes_sociales: {
    facebook: 'https://facebook.com',
    instagram: 'https://instagram.com',
    tiktok: 'https://tiktok.com',
  },
  ubicacion: {
    ciudad: 'Bolivia',
    direccion: 'Punto Tecnologico',
    referencia: 'Atencion y disponibilidad coordinada por WhatsApp.',
    horarios: [
      { dias: 'Lunes a viernes', horas: '09:00 - 19:00' },
      { dias: 'Sabados', horas: '09:00 - 13:00' },
    ],
    enlace_mapa: '',
    mapa_embed_url: '',
  },
  texto_footer: 'Tecnologia, componentes y setups gamer con asesoria especializada.',
  delivery: [
    {
      titulo: 'Envios coordinados',
      descripcion: 'Entrega segun disponibilidad y zona de cobertura.',
    },
    {
      titulo: 'Asesoria gamer',
      descripcion: 'Te ayudamos a elegir piezas y perifericos para tu setup.',
    },
  ],
}
