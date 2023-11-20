<script setup lang="ts">
definePageMeta({ middleware: ['auth'] })
const { playlists } = await usePlaylists()
</script>

<template>
    <main class="p-4">
        <v-autocomplete />
    </main>
</template>
