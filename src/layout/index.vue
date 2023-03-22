<template>
  <n-layout has-sider class="z-40 w-full h-screen transition">
    <Header v-if="isMobile" class="z-50" />
    <n-layout-sider
      bordered
      collapse-mode="width"
      :collapsed-width="isMobile ? 0 : 64"
      :width="220"
      :native-scrollbar="false"
      :show-trigger="isMobile ? false : 'arrow-circle'"
      :on-update:collapsed="handleUpdate"
      :collapsed="appStore.collapsed"
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
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { useAppStore } from '@/store';
import { onMounted } from 'vue';
import Header from './components/header/index.vue';

const { isMobile } = useBasicLayout();

// import AppTags from './components/tags/index.vue';

// import { header, tags } from '~/settings';
const appStore = useAppStore();

const handleUpdate = (collapsed) => {
  appStore.switchCollapsed(collapsed);
};

onMounted(() => {
  appStore.switchCollapsed(isMobile);
});
</script>
