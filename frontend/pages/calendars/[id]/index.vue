<script setup lang="ts">
import type { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";

definePageMeta({ middleware: ["auth"] });
const route = useRoute();
const calendarId = route.params.id as string;

const { calendar, link, setPlaylist, loading } = useCalendar(calendarId);
const { playlists } = await usePlaylists();
const { playTrack, pause, playback } = usePlayer();
const { days, createDay, updateDay } = useDays(calendarId);

function selectPlaylist(p: SimplifiedPlaylist) {
    setPlaylist({ id: calendarId }, p);
}

function handleUpload(day: (typeof days.value)[0], file: File, door: number) {
    if (day.content) {
        updateDay(file, day.content.id);
    } else {
        createDay(file, door);
    }
}
</script>

<template>
    <Breadcrumbs :items="['Calendars', calendar.name]" class="mb-4" />
    <PlaylistSelection
        :playlists="playlists"
        :model-value="calendar.playlist"
        @update:model-value="selectPlaylist"
        :loading="loading"
        class="mb-4"
    />
    <ShareCalendar :link="link" class="mb-4" />
    <ul>
        <li v-for="(day, index) in days" :key="index">
            <CalendarCard
                :door="index + 1"
                :track="day.track"
                :img="day.content?.url"
                :loading="day.loading"
                @play="
                    () =>
                        calendar.playlist
                            ? playTrack(calendar.playlist, index)
                            : undefined
                "
                @stop="() => pause()"
                :is-playing="
                    playback &&
                    playback.track == day.track?.track?.uri &&
                    !playback.paused
                "
                @upload="(f) => handleUpload(day, f, index + 1)"
            />
        </li>
    </ul>
</template>

<style scoped>
ul {
    list-style-type: none;
}

ul > * + * {
    margin-top: 8px;
}
</style>
