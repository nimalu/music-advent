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
    <v-row dense>
        <v-col cols="4" sm="3" md="2" lg="1" v-if="modelValue">
            <v-img :src="modelValue.images[0].url" cover />
        </v-col>
        <v-col v-if="playlists">
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
            >
                <template v-slot:item="{ props, item }">
                    <v-list-item
                        v-bind="props"
                        :prepend-avatar="item.raw.images[0].url"
                        :title="item.title"
                    />
                </template>
            </v-autocomplete>
        </v-col>
    </v-row>
</template>

