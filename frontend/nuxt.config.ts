// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2025-07-15',
  devtools: { enabled: true },
  app: {
    head: {
      link: [
        {
          rel: 'stylesheet',
          href: 'https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap'
        }
      ]
    }
  },
  css: ['~/assets/styles/root.scss','~/assets/styles/main.scss'],
  ssr:false,
  runtimeConfig: {
    public: {
      apiBase: process.env.NUXT_PUBLIC_API_BASE || 'http://localhost:3001',
    },
  },
  components: {
    dirs: [
      { path: '~/components/entities', pathPrefix: false },
      { path: '~/components', pathPrefix: true }
    ],
  },
  svgo: {
    componentPrefix: 'icon',
    autoImportPath: './assets/icons/',
    defaultImport: 'component',
    svgoConfig: {
      multipass: true,
      plugins: [
        {
          name: 'preset-default',
          params: {
            overrides: {
              // Asosiy atributlarni saqlash
              removeDoctype: false,
              removeViewBox: false,
              inlineStyles: {
                onlyMatchedOnce: false,
              },

              // Mask va clip-path uchun muhim
              removeUselessDefs: false,
              cleanupIds: false,

              // Path va transform uchun

              mergePaths: false,
              convertTransform: false,
            },
          },
        },
      ],
    },
  },
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@element-plus/nuxt', 'nuxt-svgo', '@nuxt/icon'],
})