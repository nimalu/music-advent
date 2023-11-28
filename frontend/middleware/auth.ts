import type { AccessToken } from "@spotify/web-api-ts-sdk";
import { useLocalStorage } from "@vueuse/core";
import type { AuthProviderInfo } from "pocketbase";

const scopes = 'streaming user-read-email user-read-private'
const cacheKey = "spotify-sdk:AuthorizationCodeWithPKCEStrategy:token";
const emtpyAccessToken: AccessToken = {
    access_token: "",
    token_type: "",
    expires_in: 0,
    refresh_token: "",
    expires: 0
}

export default defineNuxtRouteMiddleware(async (to) => {
    if (process.server) {
        return
    }

    const runtimeConfig = useRuntimeConfig()
    const provider = useLocalStorage<Pick<AuthProviderInfo, "state" | "codeChallenge" | "codeVerifier">>("provider", { state: "", codeChallenge: "", codeVerifier: "" })
    const accessToken = useLocalStorage<AccessToken>(cacheKey, emtpyAccessToken)
    const { pb } = usePocketbase()

    async function createRedirectionURL() {
        const authMethods = await pb.collection("users").listAuthMethods()
        const spotifyProvider = authMethods.authProviders.find(p => p.name == "spotify")
        if (!spotifyProvider) {
            throw "Spotify provider not found"
        }

        const { codeChallenge, state, codeVerifier } = spotifyProvider
        provider.value = { codeChallenge, state, codeVerifier }

        const targetUrl = new URL(spotifyProvider.authUrl + runtimeConfig.public.SPOTIFY_REDIRECT_URL)
        const params = targetUrl.searchParams
        params.set("scope", scopes)
        targetUrl.search = params.toString()
        return targetUrl.toString()
    }

    function isFromRedirect() {
        return "code" in to.query && "state" in to.query
    }

    async function issueAccessToken() {
        if (!provider.value) {
            throw "Provider not found in storage"
        }

        if (provider.value.state !== to.query.state) {
            throw "State parameters don't match " + provider.value.state + " " + to.query.state
        }

        const res = await pb.collection("users").authWithOAuth2Code(
            "spotify",
            to.query.code as string || "",
            provider.value.codeVerifier,
            runtimeConfig.public.SPOTIFY_REDIRECT_URL
        )

        const meta = res.meta
        if (!meta || !meta.accessToken || !meta.refreshToken) {
            throw "Something went wrong while issueing access token"
        }
        accessToken.value = {
            access_token: meta.accessToken,
            token_type: "",
            expires_in: 3500,
            refresh_token: meta.refreshToken,
            expires: Date.now() + 3500
        }
    }


    if (pb.authStore.isValid) {
        return
    }

    if (!isFromRedirect()) {
        const url = await createRedirectionURL()
        window.localStorage.setItem("redirectionLocation", to.fullPath)
        return navigateTo(url, { external: true })
    } else {
        await issueAccessToken()
        const location = window.localStorage.getItem("redirectionLocation")
        return navigateTo(location, { replace: true })
    }
})

