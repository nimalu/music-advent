<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })
const route = useRoute()
const calendarId = route.params.id

const { playlists } = await usePlaylists()
const { days, createDay, calendar, updateDay } = await useCalendar(calendarId)
const selectedPlaylist = ref(playlists[0])
const { tracks } = await usePlaylist(selectedPlaylist)
const { playTrack, state, pause } = await usePlayer()

const getImageOfDay = (door: number) => {
    return days.value.find(d => d.day == door.toString())?.url
}
const isPlaying = (door: number) => {
    if (state.value.paused || !tracks.value || tracks.value.length < door) {
        return false
    }
    return state.value.track == tracks.value[door - 1].track.uri
}

const input = ref<HTMLInputElement>()

let selectedDoor = 0
const selectFile = (door: number) => {
    input.value?.click()
    selectedDoor = door
}
const handleFileSelected = () => {
    const files = input.value?.files
    if (!files) {
        return
    }
    const file = files[0]

    const existingDay = days.value.find(d => selectedDoor.toString() == d.day)
    if (existingDay) {
        updateDay(file, existingDay.id)
    } else {
        createDay(file, selectedDoor)
    }
}

const link = computed(() => {
    if (!calendar.value) {
        return undefined
    }
    const path = window.location.toString() + "/share"
    const url = new URL(path)
    url.searchParams.set("pwd", calendar.value.password)
    return url.toString()
})
</script>

<template>
    <input @change="handleFileSelected" type="file" ref="input" style="visibility: hidden;">
    <v-breadcrumbs :items="['Calendars', calendar.id]" />
    <v-row dense>
        <v-col cols="4" sm="3" md="2" lg="1">
            <v-img :src="selectedPlaylist.images[0].url" cover />
        </v-col>
        <v-col>
            <v-autocomplete auto-select-first label="Playlist" v-model="selectedPlaylist" :items="playlists" item-value="id"
                return-object item-title="name">
                <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :prepend-avatar="item.raw.images[0].url" :title="item.title" />
                </template>
            </v-autocomplete>
        </v-col>
    </v-row>
    <v-row v-if="calendar">
        <v-col cols="12">
            <div class="d-flex align-center border px-3 py-2 justify-space-between">
                <p class="text-no-wrap text-truncate mr-2">{{ link }}</p>
                <v-btn color="secondary" variant="flat">Copy</v-btn>
            </div>
        </v-col>
    </v-row>
    <v-row>
        <v-col v-for="door in 24" :key="door" cols="12" sm="6" md="4" lg="3">
            <v-card variant="flat" border>
                <v-toolbar>
                    <v-card-item>
                        <v-card-title>Door {{ door }}</v-card-title>
                        <v-card-subtitle>
                            <template v-if="tracks.length >= door">
                                {{ tracks[door - 1].track.name }}
                            </template>
                        </v-card-subtitle>
                    </v-card-item>
                    <template v-slot:append>
                        <v-btn @click="() => selectFile(door)" accept="image/*" icon="mdi-upload" size="small" />
                        <v-btn v-if="!isPlaying(door)" @click="() => playTrack(selectedPlaylist, door - 1)" icon="mdi-play"
                            size="small" />
                        <v-btn v-else @click="() => pause()" icon="mdi-stop" size="small" />
                    </template>
                </v-toolbar>
                <v-img :src="getImageOfDay(door)" :height="200" />
            </v-card>
        </v-col>
    </v-row>
    <v-row v-if="calendar">
        <v-col cols="12">
            <div class="d-flex align-center border px-3 py-2 justify-space-between">
                <p class="text-no-wrap text-truncate mr-2">{{ link }}</p>
                <v-btn color="secondary" variant="flat">Copy</v-btn>
            </div>
        </v-col>
    </v-row>
</template>
