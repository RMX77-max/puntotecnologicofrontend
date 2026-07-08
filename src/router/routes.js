const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/InicioPage.vue') },
      { path: 'catalogo', component: () => import('pages/CatalogoPage.vue') },
      { path: 'categoria/:slug', component: () => import('pages/CategoriaPage.vue') },
      { path: 'producto/:slug', component: () => import('pages/DetalleProductoPage.vue') },
      { path: 'carrito', component: () => import('pages/CarritoCotizacionPage.vue') },
      { path: 'buscar', component: () => import('pages/BusquedaPage.vue') },
      { path: ':slug(acerca-de|novedades|contacto)', component: () => import('pages/InformativaPage.vue') },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
]

export default routes
