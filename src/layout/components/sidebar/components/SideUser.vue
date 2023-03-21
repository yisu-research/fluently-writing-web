<template>
  <router-link class="flex items-center justify-center w-full" to="/user-center">
    <div
      :class="
        appStore.collapsed
          ? 'flex justify-center w-full py-4 border-t border-gray-200 bg-teal-500'
          : 'flex w-full p-4 border-t border-gray-200'
      "
    >
      <div>
        <img class="inline-block w-10 h-10 rounded-full" src="@/assets/avatar.jpg" alt="" />
      </div>
      <div v-if="!appStore.collapsed" class="ml-3">
        <p class="text-base font-medium text-gray-700 group-hover:text-gray-900">
          {{ user.username ?? '一粟创作助手' }}
        </p>
        <p class="text-sm font-medium text-gray-500 group-hover:text-gray-700">
          {{ user.phone_number ?? '激发灵感，提高效率' }}
        </p>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { useUserStore } from '@/store';
import { useAppStore } from '@/store';

const appStore = useAppStore();
const userStore = useUserStore();

const user = computed(() => userStore.userInfo);
</script>
