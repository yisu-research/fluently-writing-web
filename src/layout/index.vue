<template>
  <n-layout has-sider class="z-40 w-full h-screen transition" :class="{ 'pt-14': isMobile }">
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
import { onMounted, computed } from 'vue';
import Header from './components/header/index.vue';
import { useMessage } from 'naive-ui';
import { useUserStore } from '@/store';

const { isMobile } = useBasicLayout();
const message = useMessage();
const userStore = useUserStore();
const user = computed(() => userStore.userInfo);

const appStore = useAppStore();

const isSignup = computed(() => appStore.isSignup);

const handleUpdate = (collapsed) => {
  appStore.switchCollapsed(collapsed);
};

onMounted(async () => {
  appStore.switchCollapsed(isMobile);
  if (isSignup.value) {
    await userStore.getUserInfo();
    message.success(
      `欢迎您，${user.value.username}，您的余额为${user.value.balance}次。去个人中心绑定邮箱还可获赠10次体验次数`,
      { duration: 5000 },
    );
    appStore.setIsSignup(false);
  } else {
    console.log(`欢迎您，${user.value.username}`);
  }
});
</script>
