<script setup lang="ts">
definePageMeta({ middleware: ["auth"] });

const { calendars, fetchCalendars, createCalendar } = useCalendars();
await fetchCalendars();

async function navigateToNewCalendar() {
    const c = await createCalendar();
    navigateTo(`/calendars/${c.id}`);
}
if (calendars.value.length == 0) {
    navigateToNewCalendar();
}
</script>
<template>
    <ul>
        <li v-for="calendar in calendars" :key="calendar.id">
            <v-card
                :href="`/calendars/${calendar.id}`"
                :title="calendar.name"
            />
        </li>
    </ul>
    <v-btn class="mt-2" @click="navigateToNewCalendar">New</v-btn>
</template>

<style scoped>
ul {
    list-style-type: none;
}
ul > li + li {
    margin-top: 8px;
}
</style>
