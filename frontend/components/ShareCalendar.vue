<script setup lang="ts">
import { useClipboard } from '@vueuse/core';

const props = defineProps<{
    link?: string
}>()

const { copied, copy } = useClipboard({ source: props.link })
</script>

<template>
    <div class="d-flex align-center border px-3 py-2 justify-space-between">
        <p class="text-no-wrap text-truncate mr-2">{{ link }}</p>
        <v-btn @click="() => copy(link)" color="secondary" variant="flat">{{ copied ? "Copied" : "Copy" }}</v-btn>
    </div>
</template>
