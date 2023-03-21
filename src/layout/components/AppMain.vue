<template>
  <router-view v-slot="{ Component, route }">
    <KeepAlive :include="keepAliveRouteNames">
      <component :is="Component" v-if="appStore.reloadFlag" :key="appStore.aliveKeys[route.name] || route.fullPath" />
    </KeepAlive>
  </router-view>
</template>

<script setup>
import { useAppStore } from '@/store';
import { useRouter } from 'vue-router';
import { useUserStore } from '@/store';
import { useChatStore } from '@/store';
import { onMounted } from 'vue';

const appStore = useAppStore();
const router = useRouter();
const userStore = useUserStore();
const charStore = useChatStore();

const allRoutes = router.getRoutes();
const keepAliveRouteNames = computed(() => {
  return allRoutes.filter((route) => route.meta?.keepAlive).map((route) => route.name);
});

onMounted(async () => {
  await userStore.getUserInfo();
  await charStore.getChatList();
});
</script>
