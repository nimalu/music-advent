<script setup lang="ts">
const { calendars, fetchCalendars } = useCalendars()
await fetchCalendars()
</script>
<template>
    <v-row class="pa-2">
        <v-col v-for="calendar in calendars" :key="calendar.id">
            <v-card :href="`/calendars/${calendar.id}/edit`" :title="calendar.id" />
        </v-col>
    </v-row>
</template>
