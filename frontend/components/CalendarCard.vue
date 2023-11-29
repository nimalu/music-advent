<script setup lang="ts">
import type { Track } from "~/composables/useDays";
import { ref } from "vue";

interface Props {
    door: number;
    track?: Track;
    img?: string;
    isPlaying?: boolean;
    loading?: boolean;
}

withDefaults(defineProps<Props>(), { isPlaying: false });
const emit = defineEmits(["play", "stop", "upload"]);

const input = ref<HTMLInputElement | null>(null);

const handleFileSelected = () => {
    const files = input.value?.files;
    if (!files) {
        return;
    }
    const file = files[0];
    emit("upload", file);
};
</script>

<template>
    <input
        @change="handleFileSelected"
        type="file"
        ref="input"
        style="display: none"
    />
    <v-card variant="flat" border :loading="loading">
        <v-toolbar>
            <div class="door-number">{{ door }}</div>
            <div class="door-track">
                <h3 class="door-track-name">{{ track?.name }}</h3>
                <ul class="door-track-artists" v-if="track">
                    <template
                        v-for="(artist, index) in track.artists"
                        :key="artist.name"
                    >
                        <li>{{ artist.name }}</li>
                        <li v-if="index + 1 < track.artists.length">,&nbsp;</li>
                    </template>
                </ul>
            </div>
            <template v-slot:append>
                <v-btn
                    @click="() => input?.click()"
                    accept="image/*"
                    icon="mdi-upload"
                    size="small"
                />
                <v-btn
                    v-if="!isPlaying"
                    @click="() => $emit('play')"
                    icon="mdi-play"
                    size="small"
                    :disabled="!track"
                />
                <v-btn
                    v-else
                    @click="() => $emit('stop')"
                    icon="mdi-stop"
                    size="small"
                    :disabled="!track"
                />
            </template>
        </v-toolbar>
        <v-img cover :src="img" :height="200" />
    </v-card>
</template>

<style scoped>
.door-number {
    margin: 0 1.2rem;
    font-weight: bold;
}
.door-track-name {
    font-weight: 500;
    font-size: 0.9rem;
    line-height: 1rem;
}
.door-track-artists {
    font-weight: 300;
    font-size: 0.8rem;
    list-style-type: none;
    line-height: 1rem;
}
.door-track-artists > * {
    display: inline;
}
</style>
