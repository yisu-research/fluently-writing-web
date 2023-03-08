<template>
  <router-link class="flex items-center justify-center h-16" to="/">
    <div class="flex flex-shrink-0 p-4 border-t border-gray-200">
      <a href="#" class="flex-shrink-0 block group">
        <div class="flex items-center">
          <div>
            <img class="inline-block w-10 h-10 rounded-full" src="@/assets/avatar.jpg" alt="" />
          </div>
          <div v-show="!appStore.collapsed" class="ml-3">
            <p class="text-base font-medium text-gray-700 group-hover:text-gray-900">Whitney Francis</p>
            <p class="text-sm font-medium text-gray-500 group-hover:text-gray-700">View profile</p>
          </div>
        </div>
      </a>
    </div>
  </router-link>
</template>

<script setup>
import { useAppStore } from '@/store';
// const title = import.meta.env.VITE_TITLE;

const appStore = useAppStore();
</script>
