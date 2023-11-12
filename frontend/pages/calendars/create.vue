<script setup lang="ts">
const { playlists } = await usePlaylists()
</script>

<template>
    <main class="p-4">
        <v-autocomplete />
    </main>
</template>
