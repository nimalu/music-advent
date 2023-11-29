<script setup lang="ts">
defineProps<{
    items: string[];
}>();
</script>

<template>
    <ul>
        <template v-for="(item, index) in items" :key="index">
            <li>
                {{ item }}
            </li>
            <li v-if="index + 1 < items.length">/</li>
        </template>
    </ul>
</template>

<style scoped>
ul {
    list-style-type: none;
    display: flex;
    column-gap: 4px;
}
</style>
