import vuetify, { transformAssetUrls } from "vite-plugin-vuetify";
import { resolve } from "path";

export default defineNuxtConfig({
  css: ["@/assets/main.scss"],
  devtools: { enabled: false },
  typescript: { shim: false },
  build: {
    transpile: ["vuetify"],
  },
  modules: [
    (_options, nuxt) => {
      nuxt.hooks.hook("vite:extendConfig", (config) => {
        config.plugins ||= [];
        config.plugins.push(vuetify({ autoImport: true }));
      });
    },
    "@pinia/nuxt",
  ],
  vite: {
    vue: {
      template: {
        transformAssetUrls,
      },
    },
  },
  runtimeConfig: {
    public: {
      API_BASE_URL: process.env.API_BASE_URL,
    },
  },
  hooks: {
    "pages:extend"(pages) {
      pages.push({
        name: "D-A01",
        path: "/",
        file: resolve(__dirname, "pages/D-A01/index.vue"),
      });
      console.log("Pages after extend:", pages);
    },
  },
});
