<script setup lang="ts">
import { onMounted } from "vue";
import { type Account } from "../models/Account";
import PFP from "./PFP.vue";

const { account, pfpClass } = defineProps<{
  account: Account;
  pfpClass?: string;
}>();

onMounted(() => account.resolve());
</script>

<template lang="pug">
.flex.w-max.items-center
  PFP(:account="account" :class="pfpClass")
  span {{ account.ensName.value ? account.ensName.value : account.address.value?.display() }}
</template>

<style scoped lang="scss"></style>
