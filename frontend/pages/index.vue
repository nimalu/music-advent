<script setup lang="ts">
const { register } = usePocketBase()

const generateRandomString = () => Math.random().toString(36).slice(2);

const password = ref("")
const { createCalendar } = useCalendars()

const handleCreateCalendar = async () => {
    const username = generateRandomString()
    await register(username, password.value)

    const calendar = await createCalendar()

    navigateTo(`/calendar/${username}/${calendar.id}/edit`)
}

</script>

<template>
    <main class="w-screen space-y-4 text-center p-4">
        <SpotifyConnect />
        <LoginForm />
    </main>
</template>

