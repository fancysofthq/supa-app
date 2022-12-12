<script setup lang="ts">
const {
  file,
  accept = "*",
  disabled = false,
} = defineProps<{
  file?: File;
  accept?: string;
  disabled?: boolean;
}>();

const emit = defineEmits(["update:file"]);

function updateFile(file: File | undefined) {
  emit("update:file", file);
}

function onFileChange(e: Event) {
  updateFile((e.target as HTMLInputElement).files?.[0]);
}

function onFileDrop(e: DragEvent) {
  updateFile(e.dataTransfer!.files?.[0]);
}
</script>

<template lang="pug">
label(@dragover.prevent @drop.prevent="onFileDrop")
  slot
  input(
    style="display: none"
    type="file"
    @change="onFileChange"
    :accept="accept"
    :disabled="disabled"
  )
</template>
