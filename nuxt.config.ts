// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-11-05",
  ssr: false,
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      API_URL: process.env.API_URL,
      APP_URL: process.env.APP_URL,
      ONLYOFFICE_CALLBACK_URL: process.env.ONLYOFFICE_CALLBACK_URL,
      ONLYOFFICE_SERVER_URL: process.env.ONLYOFFICE_SERVER_URL,
    },
  },

  modules: [
    "@ant-design-vue/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "dayjs-nuxt",
  ],

  antd: {
    extractStyle: false,
  },
  dayjs: {
    plugins: ["duration", "relativeTime"],
  },

  css: [
    "primeflex/primeflex.css",
    "primeflex/themes/primeone-dark.css",
    "primeflex/themes/primeone-light.css",
  ],
});
