<script setup lang="ts">
const route = useRoute()
const calendarId = route.params.id

const { playlists } = await usePlaylists()
const { days, createDay, calendar } = useCalendar(calendarId)
</script>

<template>
    <v-row class="pa-2">
        <v-col>
            <v-autocomplete auto-select-first label="Playlist" :items="playlists" item-value="id" item-title="name">
                <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :prepend-avatar="item.raw.images[0].url" :title="item.title" />
                </template>
            </v-autocomplete>
        </v-col>
    </v-row>
</template>
