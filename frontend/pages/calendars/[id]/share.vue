<script lang="ts" setup>
definePageMeta({ middleware: ['auth'] })
const route = useRoute()
const calendarId = route.params.id
const password = computed(() => {
    if ("pwd" in route.query) {
        return route.query["pwd"]
    } else {
        return "---"
    }
})

const { playlists } = await usePlaylists()
const { days, calendar } = await useCalendar(calendarId, password)
const selectedPlaylist = ref(playlists[0])
const { tracks } = await usePlaylist(selectedPlaylist)
const { playTrack } = await usePlayer()

const getImageOfDay = (door: number) => {
    return days.value.find(d => d.day == door.toString())?.url
}
</script>

<template>
    <v-row dense>
        {{ password }}
        <v-col v-for="door in 24" :key="door" cols="2">
            <v-img :src="getImageOfDay(door)" />
            <v-btn @click="() => playTrack(selectedPlaylist, door - 1)" icon="mdi-play" size="small" />
        </v-col>
    </v-row>
</template>
