<script setup lang="ts">


const { sdk, isAuthenticated } = useSpotify()

onBeforeMount(async () => {
    if (!await isAuthenticated()) {
        sdk.authenticate()
    }
    navigateTo("/")
})
</script>


<template>
    <div>
        auth
    </div>
</template>

