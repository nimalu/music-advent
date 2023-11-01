<script setup lang="ts">
defineProps({
    color: {
        validator(value: string) {
            return ['primary'].includes(value)
        },
        default: 'primary'
    }
})
defineEmits(["click"])
</script>

<template>
    <button @click="$emit('click')" :class="[`color-${color}`]">
        <slot />
    </button>
</template>
