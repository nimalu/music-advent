import SpotifyProvider from "@auth/core/providers/spotify"
import type { AuthConfig } from "@auth/core/types"
import { NuxtAuthHandler } from "#auth"

const runtimeConfig = useRuntimeConfig()

export const authOptions: AuthConfig = {
  secret: runtimeConfig.authJs.secret,
  providers: [
    SpotifyProvider({
      clientId: runtimeConfig.public.SPOTIFY_CLIENT_ID,
      clientSecret: runtimeConfig.SPOTIFY_CLIENT_SECRET
    })
  ]
}

export default NuxtAuthHandler(authOptions, runtimeConfig)
