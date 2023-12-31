import type { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk"
import { computedAsync } from "@vueuse/core"

export const useTracks = (playlist: MaybeRefOrGetter<SimplifiedPlaylist>) => {
    const { sdk } = useSpotify()

    const tracks = computedAsync(
        async () => {
            const playlistPage = await sdk.playlists.getPlaylistItems(toValue(playlist).id)
            const tracks = playlistPage.items
            return tracks
        }, []
    )

    return { tracks }
}
