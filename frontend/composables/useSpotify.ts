import { SpotifyApi, type Playlist, AuthorizationCodeWithPKCEStrategy, type AccessToken } from "@spotify/web-api-ts-sdk";

export const useSpotify = async () => {
    const runtimeConfig = useRuntimeConfig()

    const auth = new AuthorizationCodeWithPKCEStrategy(
        runtimeConfig.public.SPOTIFY_CLIENT_ID,
        runtimeConfig.public.SPOTIFY_REDIRECT_URL,
        ['streaming', 'user-read-email', 'user-read-private']
    )
    const sdk = new SpotifyApi(auth)
    await sdk.authenticate()

    const getAccessToken = async () => {
        const token = await sdk.getAccessToken()
        if (!token) {
            throw "api not yet authenticated"
        } else {
            return token["access_token"]
        }
    }

    return { sdk, getAccessToken }
}

export const usePlayer = async () => {
    const { sdk, getAccessToken } = await useSpotify()
    const state = ref<{
        paused: boolean
        track: string
    }>({ paused: true, track: '' })

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
    player.addListener('player_state_changed', (s) => {
        if (!s) {
            state.value = {
                paused: true,
                track: ''
            }
        } else {
            state.value = {
                paused: s.paused,
                track: s.track_window.current_track.uri
            }
        }
    })

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

    const pause = async () => {
        await sdk.player.pausePlayback(deviceId)
    }

    return { playTrack, state, pause }
}
