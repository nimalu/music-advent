<script setup lang="ts">
const { isAuthenticated, logOut, logIn } = await useSpotify()

</script>

<template>
    <v-row dense>
        <v-col cols="12">
            <v-btn block @click="logIn" color="green" :disabled="isAuthenticated" variant="flat">
                {{ isAuthenticated ? "Connected to spotify" : "Connect to spotify" }}
            </v-btn>
        </v-col>
        <v-col>
            <v-btn v-if="isAuthenticated" @click="logOut" variant="flat" border>
                Log out
            </v-btn>
        </v-col>
    </v-row>
</template>
