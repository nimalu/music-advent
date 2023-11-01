<script setup lang="ts">
const { isAuthenticated, logOut, logIn } = await useSpotify()

</script>

<template>
    <button @click="() => logIn()" v-if="!isAuthenticated" class="bg-green-500 hover:bg-green-600 text-white font-semibold text-lg px-3 py-1 rounded">
        Sign in
    </button>
    <button v-else class="bg-green-300 text-white font-semibold text-lg px-3 py-1 rounded">
        Signed in
    </button>
    <button @click="() => logOut()" class="bg-gray-100 hover:bg-gray-200 px-3 py-1 font-semibold text-lg mx-4 rounded">
        Log out
    </button>
</template>
