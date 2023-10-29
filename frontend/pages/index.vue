<script setup lang="ts">
const { sdk } = useSpotify()

const calendarId = ref("")
const newCalendarName = ref("new Calendar")
const day = ref(0)
const imageUpload = ref<HTMLInputElement>()

const { calendars, createCalendar } = useCalendars()
const { days, createDay } = useDays(calendarId)
const handleCreateDay = () => {
    createDay(imageUpload.value?.files[0], day.value)
}

</script>

<template>
    <div class="flex flex-col gap-2 items-center p-4">
        <div class="bg-cyan-400 p-4 flex gap-2">
            <a href="/auth">Auth</a>
            <button @click="() => sdk.logOut()">Logout</button>
        </div>
        <LoginForm />
        <div>
            <input v-model="newCalendarName">
            <button @click="() => createCalendar(newCalendarName.value)">Create</button>
            {{ JSON.stringify(calendars) }}
        </div>
        <div>
            <input v-model="calendarId">
            <input v-model="day">
            <input type="file" ref="imageUpload">
            <button @click="handleCreateDay">Create</button>
            {{ JSON.stringify(days) }}
        </div>
    </div>
</template>
