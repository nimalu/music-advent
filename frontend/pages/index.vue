<script setup lang="ts">
const { signIn, signOut, session, status, cookies, getProviders } = useAuth()
</script>

<template>
    <v-container fluid>
        <v-row>
            {{status}}
            <v-col cols="12">
                <LoginForm />
            </v-col>
            <v-btn @click="() => signIn('spotify')">Sign in</v-btn>
            <v-btn @click="() => signOut()">Sign out</v-btn>
        </v-row>
    </v-container>
</template>

