<script setup lang="ts">

const { calendars, fetchCalendars } = useCalendars()

await fetchCalendars()
</script>

<template>
    <div class="max-w-sm">
        <a v-if="calendars.length == 0" class="block text-center px-3 py-2 bg-gray-100 hover:bg-gray-200 font-medium text-lg text-gray-800 rounded"
            href="/calendars/create">
            Create calendar
        </a>
        <a v-else class="block text-center px-3 py-2 bg-gray-100 hover:bg-gray-200 font-medium text-lg text-gray-800 rounded"
            href="/calendars">
            To calendars
        </a>
    </div>
</template>
