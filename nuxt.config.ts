// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  ssr:false,
  components: {
    dirs: [
      { path: '~/components/entities', pathPrefix: false },
      { path: '~/components', pathPrefix: true }
    ],
  },

  modules: ['@nuxtjs/tailwindcss','@pinia/nuxt'],
})