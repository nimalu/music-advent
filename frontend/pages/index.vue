<script setup lang="ts">


</script>

<template>
    <main class="w-screen space-y-8 p-4">
        <ClientOnly>
            <SpotifyConnect />
            <LoginForm />
            <CalendarOverview />
        </ClientOnly>
    </main>
</template>

