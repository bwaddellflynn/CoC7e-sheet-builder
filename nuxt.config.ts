// nuxt.config.ts
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',

  devtools: { enabled: process.env.NODE_ENV !== 'production' },

  modules: [
    '@nuxtjs/tailwindcss',
    ['@pinia/nuxt', { autoImports: ['defineStore'] }], // Pinia + auto-import defineStore
  ],

  css: ['@/assets/css/tailwind.css'],

  app: {
    head: { title: 'CoC 7e Sheet Builder' },
    // If you deploy under a subpath (e.g., GitHub Pages), uncomment and set:
    // baseURL: '/coc7e-sheet-builder/'
  },

  // Nice-to-have TS strictness
  typescript: {
    strict: true
  },

  // If generating a static site for GitHub Pages, you can use:
  // nitro: { preset: 'github-pages' },
})
