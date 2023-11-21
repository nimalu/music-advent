import { type SimplifiedPlaylist } from "@spotify/web-api-ts-sdk"

export const usePlaylists = async () => {
    const { sdk } = useSpotify()
    const playlists = ref<SimplifiedPlaylist[]>([])

    async function fetchPlaylists() {
        const playlistsPage = await sdk.currentUser.playlists.playlists(36)
        playlists.value = playlistsPage.items
    }

    await fetchPlaylists()

    return { playlists }
}
