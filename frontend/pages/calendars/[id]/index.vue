<script setup lang="ts">
import type { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';

definePageMeta({ middleware: ['auth'] })

const route = useRoute()
const calendarId = route.params.id as string
const { calendar, link, updateCalendar, updateDay, createDay } = useCalendar(calendarId)

const { playlists } = await usePlaylists()

const { playTrack, pause, playback } = usePlayer()


function selectPlaylist(p: SimplifiedPlaylist) {
    updateCalendar({ id: calendarId, playlist: p.id })
}

function playCard(door: number) {
    const playlist = calendar.value.playlist
    if (playlist) {
        playTrack(playlist, door - 1)
    }
}

function isCardPlaying(door: number) {
    const items = calendar.value.playlistItems
    if (items.length < door) {
        return false
    }
    const track = items[door - 1]
    return track.track.uri == playback.value?.track && !playback.value.paused
}

function upload(door: number, file: File) {
    if (door.toString() in calendar.value.days) {
        updateDay(file, calendar.value.days[door.toString()].id)
    } else {
        createDay(file, door)
    }
}
</script>

<template>
    <v-breadcrumbs :items="['Calendars', calendar.id]" />
    <PlaylistSelection :playlists="playlists" :model-value="calendar.playlist" @update:model-value="selectPlaylist" />
    <v-row v-if="calendar">
        <v-col cols="12">
            <ShareCalendar :link="link" />
        </v-col>
    </v-row>
    <v-row>
        <v-col v-for="door in 24" :key="door" cols="12" sm="6" lg="3">
            <CalendarCard :door="door" v-if="calendar.days[door]" :img="calendar.days[door].url"
                :track-name="calendar.playlistItems[door - 1]?.track.name" @play="() => playCard(door)" @stop="pause"
                :is-playing="isCardPlaying(door)" @upload="(f) => upload(door, f)" />
            <CalendarCard :door="door" v-else :track-name="calendar.playlistItems[door - 1]?.track.name"
                @play="() => playCard(door)" @stop="pause" :is-playing="isCardPlaying(door)" @upload="(f) => upload(door, f)" />
        </v-col>
    </v-row>
</template>

