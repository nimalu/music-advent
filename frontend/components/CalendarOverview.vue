<script setup lang="ts">

const { calendars, fetchCalendars } = useCalendars()

await fetchCalendars()
</script>

<template>
    <div>
        <v-btn v-if="calendars.length == 0" href="/calendars/create">
            Start
        </v-btn>
        <v-btn v-else href="/calendars">
            Calendars
        </v-btn>
    </div>
</template>
