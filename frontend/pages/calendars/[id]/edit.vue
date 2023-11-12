<script setup lang="ts">
const route = useRoute()
const calendarId = route.params.id

const { days, createDay, calendar } = useCalendar(calendarId)
function getDay(index: number) {
    const matching = days.value.filter(d => d.day == index)
    if (matching) {
        return matching[0]
    }
    return undefined
}
</script>

<template>
    <div v-if="calendar">
        {{ calendar.name }}
        <ul class="flex gap-1">
            <li v-for="index in 24" :key="index">
                {{ index }}
                <img v-if="getDay(index)" :src="getDay(index).url" class="w-36" alt="img of ">
            </li>
        </ul>
    </div>
    <div v-else>
        {{ calendarId }}
    </div>
</template>
