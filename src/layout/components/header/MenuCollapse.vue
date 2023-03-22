<template>
  <n-icon size="20" cursor-pointer @click="handleSide">
    <icon-line-md:menu-fold-right v-if="appStore.collapsed" />
    <icon-line-md:menu-fold-left v-else />
  </n-icon>
</template>

<script setup>
import { useAppStore } from '@/store';

const appStore = useAppStore();

const handleSide = () => {
  appStore.setSiderCollapsed(true);
  appStore.switchCollapsed();
};
</script>
