<script setup lang="ts">
const { animate = true, rounded = true } = defineProps<{
  animate?: boolean;
  rounded?: boolean;
}>();
</script>

<template lang="pug">
.animate-pulse.bg-slate-300(:class="{ rounded: rounded }")
</template>

<style lang="scss"></style>
