<script setup lang="ts">
    await usePocketbase()
</script>

<template>
  <div>
    <p>Some default layout content shared across all pages</p>
    <slot />
  </div>
</template>
