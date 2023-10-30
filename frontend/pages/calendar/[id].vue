<script setup lang="ts">
const route = useRoute()
const calendarId = route.params.id

const { days, createDay, calendar } = useCalendar(calendarId)
</script>

<template>
    <div v-if="calendar">
        {{ calendar.name }}
        <ul>
            <li v-for="day in days">
                {{ day.day }}
                <img :src="day.url" :alt="'day ' + day.day">
            </li>
        </ul>
    </div>
    <div v-else>
        {{ calendarId }}
    </div>
</template>
