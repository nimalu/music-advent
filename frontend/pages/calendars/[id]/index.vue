<script setup lang="ts">
import type { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";

definePageMeta({ middleware: ["auth"] });

const route = useRoute();
const calendarId = route.params.id as string;
const { calendar, link, setPlaylist, loading } = useCalendar(calendarId);

const { playlists } = await usePlaylists();

const { playTrack, pause, playback } = usePlayer();

function selectPlaylist(p: SimplifiedPlaylist) {
    setPlaylist({ id: calendarId }, p);
}

const { days } = useDays(calendarId);
</script>

<template>
    <v-breadcrumbs :items="['Calendars', calendar.id]" />
    <PlaylistSelection
        :playlists="playlists"
        :model-value="calendar.playlist"
        @update:model-value="selectPlaylist"
        :loading="loading"
    />
    <v-row v-if="calendar">
        <v-col cols="12">
            <ShareCalendar :link="link" />
        </v-col>
    </v-row>
    <v-row>
        <v-col
            v-for="(day, index) in days"
            :key="index"
            cols="12"
            sm="6"
            lg="3"
        >
            <CalendarCard
                :door="index + 1"
                :track-name="day.track?.track?.name"
                :img="day.content?.url"
                :loading="day.loading"
                @play="() => calendar.playlist ? playTrack(calendar.playlist, index) : undefined"
                @stop="() => pause()"
                :is-playing="playback && playback.track == day.track?.track.uri && !playback.paused"
            />
        </v-col>
    </v-row>
</template>
