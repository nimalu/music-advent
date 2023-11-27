<script setup lang="ts">
import type { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const calendarId = route.params.id as string
const { days, createDay, calendar, updateDay, link, updateCalendar } = await useCalendar(calendarId)

const { playlists } = await usePlaylists()
const selectedPlaylist = ref<SimplifiedPlaylist>()

const { playTrack, pause, playback } = usePlayer()


function selectPlaylist(p: SimplifiedPlaylist) {
    selectedPlaylist.value = p
    updateCalendar({ id: calendarId, playlist: p.id })
}

</script>

<template>
    <v-breadcrumbs :items="['Calendars', calendar.id]" />
    <PlaylistSelection :playlists="playlists" :model-value="selectedPlaylist" @update:model-value="selectPlaylist" />
    <v-row v-if="calendar">
        <v-col cols="12">
            <ShareCalendar :link="link" />
        </v-col>
    </v-row>
    <v-row>
        <v-col v-for="door in 24" :key="door" cols="12" sm="6" lg="3">
            <CalendarCard :door="door" />
        </v-col>
    </v-row>
</template>

