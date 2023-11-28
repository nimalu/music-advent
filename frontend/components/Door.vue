<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ door: number; rows: number; cols: number }>();
const styleObject = computed(() => ({
    "grid-column-end": "span " + props.cols,
    "grid-row-end": "span " + props.rows,
}));
</script>

<template>
    <button
        class="door"
        :style="styleObject"
    >
        {{ door }}
    </button>
</template>

<style>
.door {
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #D8D8D7;
    border-radius: 0.2rem;
}
</style>

