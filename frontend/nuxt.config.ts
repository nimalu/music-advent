import { resolve } from "node:path"
import vuetify, { transformAssetUrls } from 'vite-plugin-vuetify'

export default defineNuxtConfig({
    modules: [
        (_options, nuxt) => {
            nuxt.hooks.hook('vite:extendConfig', (config) => {
                // @ts-expect-error
                config.plugins.push(vuetify({ autoImport: true }))
            })
        },
        "@hebilicious/authjs-nuxt"
    ],
    routeRules: {
        '/**': { ssr: true },
    },
    runtimeConfig: {
        SPOTIFY_CLIENT_SECRET: "top_secret",
        public: {
            SPOTIFY_CLIENT_ID: "df3594cdea0a418bade9006fc2b6db29",
            SPOTIFY_REDIRECT_URL: "http://localhost:3000/",
            authJs: {
                baseUrl: process.env.NUXT_BASE_URL,
                verifyClientOnEvereyRequest: true
            }
        },
        authJs: {
            secret: process.env.NUXT_AUTH_SECRET
        }, 
        
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
    alias: {
        cookie: resolve(__dirname, "node_modules/cookie")
    }
})

