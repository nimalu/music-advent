<script setup lang="ts">
import type { SimplifiedPlaylist } from '@spotify/web-api-ts-sdk';


defineProps<{
    playlists: SimplifiedPlaylist[],
    modelValue?: SimplifiedPlaylist
}>()

const emit = defineEmits(['update:modelValue'])

</script>

<template>
    <v-row dense>
        <v-col cols="4" sm="3" md="2" lg="1" v-if="modelValue">
            <v-img :src="modelValue.images[0].url" cover />
        </v-col>
        <v-col v-if="playlists">
            <v-autocomplete auto-select-first @update:model-value="(e) => emit('update:modelValue', e)" label="Playlist"
                :model-value="modelValue" :items="playlists" item-value="id" return-object item-title="name">
                <template v-slot:item="{ props, item }">
                    <v-list-item v-bind="props" :prepend-avatar="item.raw.images[0].url" :title="item.title" />
                </template>
            </v-autocomplete>
        </v-col>
    </v-row>
</template>
