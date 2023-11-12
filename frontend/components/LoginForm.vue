<script setup lang="ts">

const email = ref("")
const password = ref("")

const { login, register, isAuthenticated, logout, userId } = usePocketBase()

function handleLogin() {
    login(email.value, password.value)
}
function handleRegister() {
    register(email.value, password.value)
}
</script>

<template>
    <v-form @submit.prevent class="w-100">
        <v-text-field label="Email" />
        <v-text-field label="Password" />
        <div class="d-flex">
        <v-btn>Login</v-btn>
        <v-btn>Logout</v-btn>
        </div>
    </v-form>
</template>

