<script setup>
import SideLogo from './components/SideLogo.vue';
import SideMenu from './components/SideMenu.vue';
import SideUser from './components/SideUser.vue';
</script>

<template>
  <div>
    <SideLogo />
    <SideMenu />
    <SideUser class="absolute bottom-0 w-full" />
  </div>
</template>
