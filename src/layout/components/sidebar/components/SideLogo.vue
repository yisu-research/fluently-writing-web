<template>
  <router-link class="flex items-center justify-center h-16" to="/">
    <icon-custom-logo text-36 color-primary></icon-custom-logo>
    <h2 v-show="!appStore.collapsed" ml-2 color-primary text-xl font-bold max-w-40 flex-shrink-0>
      {{ title }}
    </h2>
  </router-link>
</template>

<script setup>
import { useAppStore } from '@/store';
const title = import.meta.env.VITE_TITLE;

const appStore = useAppStore();
</script>
