// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
    routeRules: {
        '/auth/**': { ssr: false },
    },
    runtimeConfig: {
        SPOTIFY_CLIENT_SECRET: "1989050bb7dc4cb189cc5f6fa23e1625",
        public: {
            SPOTIFY_CLIENT_ID: "df3594cdea0a418bade9006fc2b6db29",
        }
    },
    devtools: { enabled: true }
})

