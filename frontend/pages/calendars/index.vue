<script setup lang="ts">
const { calendars, fetchCalendars, createCalendar } = await useCalendars()
await fetchCalendars()
if (calendars.value.length == 0) {
    const c = await createCalendar()
    navigateTo(`/calendars/${c.id}/edit`)
}
</script>
<template>
    <v-row class="pa-2">
        <v-col v-for="calendar in calendars" :key="calendar.id">
            <v-card :href="`/calendars/${calendar.id}/edit`" :title="calendar.id" />
        </v-col>
    </v-row>
</template>
