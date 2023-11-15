import type { AccessToken } from '@spotify/web-api-ts-sdk';
import { useLocalStorage } from '@vueuse/core';
import PocketBase, { type AuthProviderInfo } from 'pocketbase';

const cacheKey = "spotify-sdk:AuthorizationCodeWithPKCEStrategy:token";

export const usePocketbase = async () => {
    const runtimeConfig = useRuntimeConfig()
    const provider = useLocalStorage<Pick<AuthProviderInfo, "state" | "codeChallenge" | "codeVerifier">>("provider", { state: "", codeChallenge: "", codeVerifier: "" })

    const pb = new PocketBase('http://127.0.0.1:8090');
    const accessToken = useLocalStorage<AccessToken>(cacheKey,
        {
            access_token: "",
            token_type: "",
            expires_in: 0,
            refresh_token: "",
            expires: 0
        }
    )

    const redirect = async () => {
        const authMethods = await pb.collection("users").listAuthMethods()
        const spotifyProvider = authMethods.authProviders.find(p => p.name == "spotify")
        if (!spotifyProvider) {
            throw "Spotify provider not found"
        }
        provider.value = {
            codeChallenge: spotifyProvider.codeChallenge,
            state: spotifyProvider.state,
            codeVerifier: spotifyProvider.codeVerifier
        }
        const targetUrl = new URL(spotifyProvider.authUrl + runtimeConfig.public.SPOTIFY_REDIRECT_URL)
        const params = targetUrl.searchParams
        params.set("scope", 'streaming user-read-email user-read-private')
        targetUrl.search = params.toString()
        window.location.replace(targetUrl.toString())
    }

    const fromRedirect = async () => {
        if (!provider.value) {
            throw "Provider not found in storage"
        }
        const searchParams = (new URL(window.location.toString())).searchParams

        if (provider.value.state !== searchParams.get("state")) {
            throw "State parameters don't match " + provider.value.state + " " + searchParams.get("state")
        }

        const res = await pb.collection("users").authWithOAuth2Code(
            "spotify",
            searchParams.get("code") || "",
            provider.value.codeVerifier,
            runtimeConfig.public.SPOTIFY_REDIRECT_URL
        )

        accessToken.value = {
            access_token: res.meta.accessToken,
            token_type: "",
            expires_in: 3500,
            refresh_token: res.meta.refreshToken,
            expires: Date.now() + 3500
        }

        const url = new URL(window.location.href);
        url.searchParams.delete("code")
        url.searchParams.delete("state")
        const newUrl = url.search ? url.href : url.href.replace('?', '')
        window.history.replaceState({}, document.title, newUrl)
    }

    if (!pb.authStore.isValid) {
        if (new URL(window.location.href).searchParams.has("code")) {
            await fromRedirect()
        } else {
            await redirect()
        }
    }
    console.log("pbbb")

    return { pb }
}

