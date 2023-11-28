<script setup lang="ts">
import { ref } from "vue";

interface Props {
    door: number;
    trackName?: string;
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
        style="visibility: hidden"
    />
    <v-card variant="flat" border :loading="loading">
        <v-toolbar>
            <v-card-item>
                <v-card-title>Door {{ door }}</v-card-title>
                <v-card-subtitle>{{ trackName }}</v-card-subtitle>
            </v-card-item>
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
                    :disabled="!trackName"
                />
                <v-btn
                    v-else
                    @click="() => $emit('stop')"
                    icon="mdi-stop"
                    size="small"
                    :disabled="!trackName"
                />
            </template>
        </v-toolbar>
        <v-img :src="img" :height="200" />
    </v-card>
</template>
