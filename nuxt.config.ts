// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  modules: [
    '@nuxtjs/tailwindcss',
    ['@pinia/nuxt', { autoImports: ['defineStore'] }], // <-- put options here
  ],

  css: ['@/assets/css/tailwind.css'],

  app: { head: { title: 'CoC 7e Sheet Builder' } },
})
