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
        SPOTIFY_CLIENT_SECRET: "1989050bb7dc4cb189cc5f6fa23e1625",
        public: {
            SPOTIFY_CLIENT_ID: "df3594cdea0a418bade9006fc2b6db29",
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

