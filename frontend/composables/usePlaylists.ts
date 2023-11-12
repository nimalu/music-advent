export const usePlaylists = async () => {
    const { sdk } = await useSpotify()
    const playlistsPage = await sdk.currentUser.playlists.playlists(36)
    const playlists = playlistsPage.items

    return { playlists }
}
