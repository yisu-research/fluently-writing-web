<template>
  <n-layout has-sider class="w-full h-screen">
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="64"
      :width="220"
      :native-scrollbar="false"
      show-trigger="arrow-circle"
      :on-update:collapsed="handleUpdate"
    >
      <SideBar />
    </n-layout-sider>
    <article flex-1 flex-col overflow-hidden>
      <!-- <header
        class="flex items-center px-2 bg-white border-b border-gray-100"
        dark="bg-dark border-0"
        :style="`height: ${header.height}px`"
      >
        <AppHeader />
      </header>
      <section v-if="tags.visible" border-b bc-eee dark:border-0 hidden sm:block>
        <AppTags :style="{ height: `${tags.height}px` }" />
      </section> -->
      <section flex-1 overflow-hidden bg-hex-f5f6fb>
        <AppMain />
      </section>
    </article>
  </n-layout>
</template>

<script setup>
// import AppHeader from './components/header/index.vue';
import SideBar from './components/sidebar/index.vue';
import AppMain from './components/AppMain.vue';

// import AppTags from './components/tags/index.vue';

import { useAppStore } from '@/store';
// import { header, tags } from '~/settings';
const appStore = useAppStore();

const handleUpdate = (collapsed) => {
  console.log('handleUpdate');
  appStore.switchCollapsed(collapsed);
};
</script>
