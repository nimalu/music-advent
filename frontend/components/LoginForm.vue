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
        <v-text-field label="Email" v-model="email" type="email" />
        <v-text-field label="Password" v-model="password" type="password" />
        <v-row dense>
            <v-col>
                <v-btn @click="handleLogin" :disabled="isAuthenticated" block variant="flat" color="purple" class="flex-grow-1">Login</v-btn>
            </v-col>
            <v-col>
                <v-btn @click="() => logout()" block variant="flat" border>Logout</v-btn>
            </v-col>
        </v-row>
    </v-form>
</template>

