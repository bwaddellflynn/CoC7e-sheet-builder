// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  modules: [
    '@nuxtjs/tailwindcss',
    ['@pinia/nuxt', { autoImports: ['defineStore'] }],
  ],

  // Global styles
  css: ['@/assets/css/tailwind.css', '@/assets/css/print.css'],

  app: {
    head: { title: 'CoC 7e Sheet Builder' },
    // baseURL: '/coc7e-sheet-builder/',
  },

  typescript: { strict: true },
  // nitro: { preset: 'github-pages' },
})
