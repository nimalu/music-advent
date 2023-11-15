<script setup lang="ts">
const { pb, meta } = await usePocketbase()
const sdk = await useSpotify()
</script>

<template>
    <v-container fluid>
        <v-row>
            {{ meta }}
        </v-row>
    </v-container>
</template>

