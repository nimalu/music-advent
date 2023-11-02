<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps({
    label: String,
    modelValue: String,
    type: String,
    required: Boolean,
});
const emit = defineEmits(['update:modelValue']);
const value = computed({
    get: () => props.modelValue,
    set: (val) => emit('update:modelValue', val)
})
</script>

<template>
    <div class="text-left  space-y-1">
        <label class="block text-gray-400" :for="props.label">{{ props.label }}</label>
        <input
            class="border border-gray-400 focus:border-purple-700 focus:outline outline-1 focus:outline-purple-700 rounded px-2.5 py-2 w-full"
            v-model="value" :type="props.type" :id="props.label" :name="props.label" :required="required">
    </div>
</template>
