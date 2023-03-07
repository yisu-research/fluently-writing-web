<script setup>
import { RouterView } from 'vue-router';
</script>

<template>
  <!-- <RouterView /> -->
  <AppProvider>
    <router-view v-slot="{ Component }">
      <component :is="Component" />
    </router-view>
  </AppProvider>
</template>
