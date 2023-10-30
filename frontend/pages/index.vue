<script setup lang="ts">
const { sdk } = useSpotify()

const newCalendarName = ref("new Calendar")

const { calendars, createCalendar } = useCalendars()
const handleCreateDay = () => {
    createDay(imageUpload.value?.files[0], day.value)
}

const handleCreateCalendar = async () => {
    const c = await createCalendar(newCalendarName.value)
    navigateTo(`/calendar/${c.id}/`)
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
            <button @click="handleCreateCalendar">Create</button>
            <ul>
                <li v-for="c in calendars" :key="c.id">
                    <a :href="`/calendar/${c.id}`">{{ c.name }}</a>
                </li>
            </ul>
        </div>
    </div>
</template>
