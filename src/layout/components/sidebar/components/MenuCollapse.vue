<template>
  <n-icon size="20" cursor-pointer @click="appStore.switchCollapsed">
    <icon-line-md:menu-fold-right v-if="appStore.collapsed" />
    <icon-line-md:menu-fold-left v-else />
  </n-icon>
</template>

<script setup>
import { useAppStore } from '@/store';

const appStore = useAppStore();
</script>
