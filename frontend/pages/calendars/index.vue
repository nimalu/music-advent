<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })

const { calendars, fetchCalendars, createCalendar } = useCalendars()
await fetchCalendars()
if (calendars.value.length == 0) {
    const c = await createCalendar()
    navigateTo(`/calendars/${c.id}`)
}
</script>
<template>
    <v-row class="pa-2">
        <v-col v-for="calendar in calendars" :key="calendar.id">
            <v-card :href="`/calendars/${calendar.id}`" :title="calendar.name" />
        </v-col>
    </v-row>
</template>
