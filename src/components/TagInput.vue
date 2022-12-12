<script setup lang="ts">
import { ref } from "vue";

const {
  modelValue,
  placeholder,
  disabled,
  inputClass = "",
} = defineProps<{
  modelValue: string[];
  placeholder?: string;
  disabled?: boolean;
  inputClass?: string;
}>();

const emit = defineEmits(["update:modelValue"]);

const newTag = ref("");

function addTag(e: FocusEvent | KeyboardEvent) {
  if (!newTag.value) return;
  modelValue.push(newTag.value);
  emit("update:modelValue", modelValue);
  newTag.value = "";
}

function onDelete(e: KeyboardEvent) {
  console.debug("onDelete");

  if (!newTag.value) {
    e.preventDefault();

    if (modelValue.length) {
      modelValue.pop();
      emit("update:modelValue", modelValue);
    }
  }
}

function deleteTag(index: number) {
  modelValue.splice(index, 1);
  emit("update:modelValue", modelValue);
}

function onCustomKey(e: KeyboardEvent) {
  switch (e.keyCode) {
    case 188:
    case 32:
      e.preventDefault();
      addTag(e);
      break;
  }
}
</script>

<template lang="pug">
.flex.h-fit.flex-wrap.items-center.gap-1
  slot(
    :tag="tag"
    v-for="(tag, index) of modelValue"
    :onClick="() => deleteTag(index)"
  )
  input.grow(
    type="text"
    v-model="newTag"
    :class="inputClass"
    @keydown.delete="onDelete"
    @blur="addTag"
    @keyup.enter="addTag"
    @keydown="onCustomKey"
    :placeholder="modelValue.length ? '' : placeholder"
    :disabled="disabled"
  )
</template>
