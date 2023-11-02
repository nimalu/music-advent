<script setup lang="ts">

const email = ref("")
const password = ref("")

const { login, register, isAuthenticated, logout } = usePocketBase()

function handleLogin() {
    login(email.value, password.value)
}
function handleRegister() {
    register(email.value, password.value)
}
</script>

<template>
    <form v-if="!isAuthenticated" @submit.prevent="handleLogin" class="space-y-4 max-w-sm">
        <TextField v-model="email" label="Email" type="email" />
        <TextField v-model="password" label="Password" type="password" />

        <button type="submit"
            class="block w-full bg-purple-500 text-white hover:bg-purple-600 font-bold px-3 py-2.5 rounded">
            Login
        </button>

        <div class="flex justify-between text-gray-400">
            <button type="button" @click="handleRegister" class="text-purple-700 hover:underline">Signup</button>
            <a class="hover:underline" href="/password-reset">Forgot your password?</a>
        </div>
    </form>
    <div v-else>
        You are logged in.
        <button @click="() => logout()">Logout</button>
    </div>
</template>

