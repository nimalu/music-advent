<script setup lang="ts">
const { sdk } = useSpotify()

</script>

<template>
    <div>Index</div>
    <a href="/auth">Auth</a>
    <button @click="() => sdk.logOut()">Logout</button>
</template>
