<template>
  <div class="h-full transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <NLayoutContent class="h-full">
          <RouterView v-slot="{ Component, route }">
            <component :is="Component" :key="route.fullPath" />
          </RouterView>
        </NLayoutContent>
        <Sider />
      </NLayout>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { NLayout, NLayoutContent } from 'naive-ui';
// import { useRouter } from 'vue-router';
import Sider from './sider/index.vue';

import { useBasicLayout } from '@/hooks/useBasicLayout';
import { useAppStore } from '@/store';

// const router = useRouter();
const appStore = useAppStore();
// const chatStore = useChatStore();

// router.replace({ name: 'Chat', params: { id: chatStore.active } });

const { isMobile } = useBasicLayout();

const collapsed = computed(() => appStore.siderCollapsed);

const getMobileClass = computed(() => {
  if (isMobile.value) return ['rounded-none', 'shadow-none'];
  return ['border', 'rounded-md', 'shadow-md'];
});

const getContainerClass = computed(() => {
  return ['h-full', { 'pl-[260px]': !isMobile.value && !collapsed.value }];
});
</script>
