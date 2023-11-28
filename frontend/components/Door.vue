<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{ door: number; rows: number; cols: number }>();
const styleObject = computed(() => ({
    "grid-column-end": "span " + props.cols,
    "grid-row-end": "span " + props.rows,
}));
</script>

<template>
    <v-sheet
        color="grey-lighten-3"
        rounded
        class="pa-2 justify-center align-center d-flex"
        :style="styleObject"
    >
        {{ door }}
    </v-sheet>
</template>
