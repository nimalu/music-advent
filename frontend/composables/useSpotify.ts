import {
    SpotifyApi,
    AuthorizationCodeWithPKCEStrategy,
    type SimplifiedPlaylist,
    type PlaybackState,
} from "@spotify/web-api-ts-sdk";

const scopes = ["streaming", "user-read-email", "user-read-private"];

export const useSpotify = () => {
    const runtimeConfig = useRuntimeConfig();

    const auth = new AuthorizationCodeWithPKCEStrategy(
        runtimeConfig.public.SPOTIFY_CLIENT_ID,
        runtimeConfig.public.SPOTIFY_REDIRECT_URL,
        scopes
    );
    const sdk = new SpotifyApi(auth);

    async function getAccessToken() {
        const token = await sdk.getAccessToken();
        if (!token) {
            throw "api not yet authenticated";
        }

        return token["access_token"];
    }

    return { sdk, getAccessToken };
};

interface PlayerState {
    track: string;
    position: number;
    paused: boolean;
}

const error = ref<WebPlaybackError>();
const playback = ref<PlayerState>();
const deviceId = ref<string>();
export const usePlayer = () => {
    const { sdk, getAccessToken } = useSpotify();

    async function installPlaybackSDK() {
        const script = document.querySelector("#spotify-sdk");
        if (script) {
            console.warn("Spotify sdk already installed.")
            return;
        }
        await new Promise((resolve) => {
            window.onSpotifyWebPlaybackSDKReady = resolve;
            const script = document.createElement("script");
            script.id = "spotify-sdk";
            script.src = "https://sdk.scdn.co/spotify-player.js";
            document.head.appendChild(script);
        });

        const token = await getAccessToken();
        const player = new Spotify.Player({
            name: "Advent Calendar",
            getOAuthToken: (cb: Function) => cb(token),
        });
        player.addListener("initialization_error", (e) => (error.value = e));
        player.addListener("authentication_error", (e) => (error.value = e));
        player.addListener("account_error", (e) => (error.value = e));
        player.addListener("playback_error", (e) => (error.value = e));
        player.addListener("ready", async (p) => {
            deviceId.value = p.device_id;
            sdk.player.transferPlayback([p.device_id], false);
        });
        function updateState(s: PlaybackState | WebPlaybackState | null) {
            if (!s) {
                playback.value = undefined;
            } else if ("item" in s) {
                s = s as PlaybackState;
                playback.value = {
                    track: s.item.uri,
                    paused: !s.is_playing,
                    position: s.progress_ms,
                };
            } else {
                s = s as WebPlaybackState;
                playback.value = {
                    track: s.track_window.current_track?.uri ?? "",
                    paused: s.paused,
                    position: s.position,
                };
            }
        }
        player.addListener("player_state_changed", (s) => updateState(s));
        await player.connect();
    }

    function uninstallSpotifySDK() {
        const script = document.querySelector("#spotify-sdk");
        if (!script) {
            return;
        }
        pause()
        script.remove();
    }

    async function playTrack(
        playlist: Pick<SimplifiedPlaylist, "uri">,
        trackNumber: number
    ) {
        if (!deviceId.value) {
            throw "Device id is undefined";
        }
        await sdk.player.startResumePlayback(
            deviceId.value,
            playlist.uri,
            undefined,
            { position: trackNumber }
        );
    }

    async function pause() {
        if (!deviceId.value) {
            throw "Device id is undefined";
        }
        await sdk.player.pausePlayback(deviceId.value);
    }

    onMounted(installPlaybackSDK);
    onUnmounted(uninstallSpotifySDK);

    return { playTrack, pause, error, playback };
};

interface PlayerProps {
    name: string;
    getOAuthToken: (cb: Function) => void;
    volume?: number;
    enableMediaSession?: boolean;
}

interface Player {
    new (props: PlayerProps): Player;
    connect(): Promise<boolean>;
    disconnect(): void;
    addListener<T extends keyof EventHandlers>(
        eventName: T,
        callback: EventHandlers[T]
    ): boolean;
    removeListener(eventName: string, callback?: Function): boolean;
    getCurrentState(): Promise<WebPlaybackState | null>;
    setName(name: string): Promise<void>;
    getVolume(): Promise<number>;
    setVolume(volume: number): Promise<void>;
    pause(): Promise<void>;
    resume(): Promise<void>;
    togglePlay(): Promise<void>;
    seek(positionMs: number): Promise<void>;
    previousTrack(): Promise<void>;
    nextTrack(): Promise<void>;
    activateElement(): Promise<void>;
}

interface EventHandlers {
    ready: (p: WebPlaybackPlayer) => void;
    not_ready: (p: WebPlaybackPlayer) => void;
    player_state_changed: (p: WebPlaybackState | null) => void;
    autplay_failed: () => void;
    initialization_error: (e: WebPlaybackError) => void;
    authentication_error: (e: WebPlaybackError) => void;
    account_error: (e: WebPlaybackError) => void;
    playback_error: (e: WebPlaybackError) => void;
}

interface WebPlaybackPlayer {
    device_id: string;
}

interface WebPlaybackState {
    context: {
        uri: string;
        metadata: Record<string, string | number> | null;
    };
    disallows: {
        pausing: boolean;
        peeking_next: boolean;
        peeking_prev: boolean;
        resuming: boolean;
        seeking: boolean;
        skipping_next: boolean;
        skipping_prev: boolean;
    };
    paused: boolean;
    position: number;
    repeat_mode: number;
    shuffle: boolean;
    track_window: {
        current_track: WebPlaybackTrack | null;
        previous_tracks: WebPlaybackTrack[];
        next_tracks: WebPlaybackTrack[];
    };
}

interface WebPlaybackError {
    message: string;
}

interface WebPlaybackTrack {
    uri: string;
    id: string | null;
    type: "track" | "episode" | "ad";
    media_type: "audio" | "video";
    name: string;
    is_playable: boolean;
    album: {
        uri: string;
        name: string;
        images: { url: string }[];
    };
    artists: { uri: string; name: string }[];
}

declare var Spotify: {
    Player: Player;
};

declare global {
    interface Window {
        onSpotifyWebPlaybackSDKReady: Function;
    }
}
