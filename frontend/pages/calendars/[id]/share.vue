<script setup lang="ts">
const route = useRoute()
const calendarId = route.params.id
const { calendar } = await useCalendar(calendarId)


const link = computed(() => {
    if (!calendar.value) {
        return undefined
    }
    const path = window.location.toString().replace("share", "view")
    const url = new URL(path)
    url.searchParams.set("pwd", calendar.value.password)
    return url.toString()
})

</script>

<template>
    <div class="pa-2" v-if="calendar">
        {{ link }}
    </div>
</template>
