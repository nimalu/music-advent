import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({ autoImport: true }))
            })
        },],
    routeRules: {
        '/**': { ssr: false },
    },
    runtimeConfig: {
        SPOTIFY_CLIENT_SECRET: "top_secret",
        public: {
            SPOTIFY_CLIENT_ID: "df3594cdea0a418bade9006fc2b6db29",
            SPOTIFY_REDIRECT_URL: "http://localhost:3000/"
        }
    },
    devtools: { enabled: true },
    build: {
        transpile: ['vuetify'],
    },
    vite: {
        vue: {
            template: {
                transformAssetUrls,
            },
        },
    },
})

