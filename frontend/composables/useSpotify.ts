import { SpotifyApi, type Playlist } from "@spotify/web-api-ts-sdk";
import { useSessionStorage } from "@vueuse/core";


export const useSpotify = async () => {
    const runtimeConfig = useRuntimeConfig()

    const sdk = SpotifyApi.withUserAuthorization(
        runtimeConfig.public.SPOTIFY_CLIENT_ID,
        'http://localhost:3000/auth',
        ['streaming', 'user-read-email', 'user-read-private']
    );

    const getAccessToken = async () => {
        const token = await sdk.getAccessToken()
        if (!token) {
            throw "api not yet authenticated"
        } else {
            return token["access_token"]
        }
    }

    const isAuthenticated = ref(false)

    const updateAuthenticated = async () => {
        const token = await sdk.getAccessToken()
        isAuthenticated.value = token != null
    }

    const authenticateSource = useSessionStorage("redirect-src", "/")
    const logIn = async () => {
        authenticateSource.value = window.location.pathname
        await sdk.authenticate()
    }

    const onLoggedIn = async () => {
        await sdk.authenticate()
        await updateAuthenticated()
        navigateTo(authenticateSource.value)
    }

    const logOut = async () => {
        sdk.logOut()
        await updateAuthenticated()
    }

    await updateAuthenticated()

    return { sdk, getAccessToken, isAuthenticated, logIn, logOut, onLoggedIn }
}

export const usePlayer = async () => {
    const { sdk, getAccessToken } = await useSpotify()

    const installPlaybackSDK = new Promise(resolve => {
        window.onSpotifyWebPlaybackSDKReady = resolve
        const script = document.createElement("script")
        script.src = "https://sdk.scdn.co/spotify-player.js"
        document.head.appendChild(script)
    })

    await installPlaybackSDK

    const token = await getAccessToken()
    const player = new Spotify.Player({
        name: 'Advent Calendar',
        getOAuthToken: (cb) => cb(token)
    });
    player.addListener('initialization_error', ({ message }) => console.error(message));
    player.addListener('authentication_error', ({ message }) => console.error(message));

    const getDeviceId = new Promise<string>(resolve => {
        player.addListener('ready', async ({ device_id: deviceId }) => {
            resolve(deviceId)
        });
        player.connect();
    })

    const deviceId = await getDeviceId
    await sdk.player.transferPlayback([deviceId], true);
    await sdk.player.pausePlayback(deviceId)

    const playTrack = async (playlist: Playlist, trackNumber: number) => {
        await sdk.player.startResumePlayback(deviceId, playlist.uri, undefined, { position: trackNumber })

    }

    return { playTrack }
}
