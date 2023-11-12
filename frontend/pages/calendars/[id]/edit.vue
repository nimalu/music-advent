<script setup lang="ts">
const route = useRoute()
const calendarId = route.params.id

const { playlists } = await usePlaylists()
const { days, createDay, calendar } = useCalendar(calendarId)
const selectedPlaylist = ref(playlists[0])
const { tracks } = await usePlaylist(selectedPlaylist)
const { playTrack } = await usePlayer()
</script>

<template>
    <v-container>
        <v-row class="pa-2">
            <v-col>
                <v-autocomplete auto-select-first label="Playlist" v-model="selectedPlaylist" :items="playlists"
                    item-value="id" return-object item-title="name">
                    <template v-slot:item="{ props, item }">
                        <v-list-item v-bind="props" :prepend-avatar="item.raw.images[0].url" :title="item.title" />
                    </template>
                </v-autocomplete>
            </v-col>
        </v-row>
        <v-row dense>
            <v-col v-for="door in 24" :key="door" cols="6">
                <v-card variant="flat" border>
                    <v-card-item>
                        <v-card-title>Door {{ door }}</v-card-title>
                        <v-card-subtitle>
                            <template v-if="tracks.length >= door">
                                {{ tracks[door - 1].track.name }}
                            </template>
                        </v-card-subtitle>
                    </v-card-item>
                    <v-card-text>
                        helloo
                    </v-card-text>
                    <v-card-actions>
                        <v-btn @click="() => playTrack(selectedPlaylist, door - 1)" icon="mdi-play" variant="text" />
                    </v-card-actions>
                </v-card>

            </v-col>
        </v-row>
    </v-container>
</template>
