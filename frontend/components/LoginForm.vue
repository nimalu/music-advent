<script setup lang="ts">

const email = ref("")
const password = ref("")

const { login, register } = usePocketBase()

function handleLogin() {
    login(email.value, password.value)
}
function handleRegister() {
    register(email.value, password.value, password.value)
}
</script>

<template>
    <form class="flex flex-col gap-2">
        <label for="email">Email</label>
        <input v-model="email" type="email" id="email" name="email" required class="border rounded p-2">

        <label for="password">Password</label>
        <input v-model="password" type="password" id="password" name="password" required class="border rounded p-2">

        <button type="button" @click="handleLogin"
            class="bg-gray-100 hover:bg-gray-200 focus:bg-gray-300 text-gray-700 font-bold p-3 rounded">
            Login
        </button>
        <button type="button" @click="handleRegister"
            class="bg-gray-100 hover:bg-gray-200 focus:bg-gray-300 text-gray-700 font-bold p-3 rounded">
            Register
        </button>
    </form>
</template>

