// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },

  // La tienda corre en 3100 para no chocar con el backend NestJS (3000) ni el admin Vite (5173)
  devServer: { port: 3100 },

  modules: ['@nuxtjs/tailwindcss'],

  css: ['~/assets/css/main.css'],

  app: {
    // Transición suave (fundido) al navegar entre páginas
    pageTransition: { name: 'page', mode: 'out-in' },
    head: {
      title: 'Essential West — Algodón pima para hombre',
      htmlAttrs: { lang: 'es' },
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Essential West — Clásicos para hombre en algodón pima premium. Polos, polos box, buzos, joggers y más.' },
      ],
      link: [
        // Ícono de la pestaña del navegador
        { rel: 'icon', type: 'image/svg+xml', href: '/favicon.svg' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' },
        // Tipografía fina/elegante para el estilo minimalista premium
        // Jost = textos · Cormorant Garamond = wordmark elegante de la marca
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Jost:wght@300;400;500;600;700;800&family=Cormorant+Garamond:ital,wght@0,400;0,500;0,600;1,500&display=swap' },
      ],
    },
  },

  runtimeConfig: {
    public: {
      // URL del backend NestJS (se sobreescribe con NUXT_PUBLIC_API_BASE en producción)
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3000',
    },
  },
})
