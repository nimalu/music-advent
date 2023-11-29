<script setup lang="ts">
import type { SimplifiedPlaylist } from "@spotify/web-api-ts-sdk";

defineProps<{
    playlists: SimplifiedPlaylist[];
    modelValue?: SimplifiedPlaylist;
    loading?: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

function handleUpdate(p: SimplifiedPlaylist) {
    emit("update:modelValue", p);
    const activeElement = document.activeElement as HTMLElement | undefined;
    activeElement?.blur();
}
</script>

<template>
    <div class="playlist-selection">
        <v-autocomplete
            auto-select-first
            @update:model-value="handleUpdate"
            label="Playlist"
            :model-value="modelValue"
            :items="playlists"
            item-value="id"
            return-object
            item-title="name"
            :loading="loading"
            hide-details
        >
            <template v-slot:item="{ props, item }">
                <v-list-item
                    v-bind="props"
                    :prepend-avatar="item.raw.images[0].url"
                    :title="item.title"
                />
            </template>
        </v-autocomplete>
        <v-img v-if="modelValue" :src="modelValue.images[0].url" cover />
    </div>
</template>

<style>
.playlist-selection > * + * {
    margin-top: 8px;
}
</style>
