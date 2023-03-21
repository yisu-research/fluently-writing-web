<script setup>
import { computed, watch } from 'vue';
import { NButton, NLayoutSider } from 'naive-ui';
import SiderList from './SiderList.vue';
import { useAppStore, useChatStore } from '@/store';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import api from '@/views/saas/api';
import day from 'dayjs';

const appStore = useAppStore();
const chatStore = useChatStore();

const { isMobile } = useBasicLayout();

const collapsed = computed(() => appStore.siderCollapsed);

async function handleAdd() {
  // 请求创建对话
  const uuid = day(Date.now()).format('YYMMDD-HH:mm:ss');
  const res = await api.postChatApi({ name: uuid });
  const { id, name } = res;

  chatStore.addHistory({ name: name, id: id, isEdit: false });

  if (!chatStore.active) {
    await chatStore.setActive(id);
    if (chatStore.active) chatStore.updateHistory(chatStore.active, { isEdit: false });
  }
}

function handleUpdateCollapsed() {
  appStore.setSiderCollapsed(!collapsed.value);
}

const getMobileClass = computed(() => {
  if (isMobile.value) {
    return {
      position: 'fixed',
      zIndex: 50,
    };
  }
  return {};
});

const mobileSafeArea = computed(() => {
  if (isMobile.value) {
    return {
      paddingBottom: 'env(safe-area-inset-bottom)',
    };
  }
  return {};
});

watch(
  isMobile,
  (val) => {
    appStore.setSiderCollapsed(val);
  },
  {
    immediate: true,
    flush: 'post',
  },
);
</script>

<template>
  <div class="my-sider">
    <NLayoutSider
      :collapsed="collapsed"
      :collapsed-width="0"
      :width="260"
      show-trigger="bar"
      collapse-mode="transform"
      position="absolute"
      bordered
      :style="getMobileClass"
      @update-collapsed="handleUpdateCollapsed"
    >
      <div class="flex flex-col h-full" :style="mobileSafeArea">
        <main class="flex flex-col flex-1 min-h-0">
          <div class="p-4">
            <NButton dashed block @click="handleAdd"> 新的对话 </NButton>
          </div>
          <div class="flex-1 min-h-0 pb-4 overflow-hidden">
            <SiderList />
          </div>
        </main>
        <!-- <SiderFooter /> -->
      </div>
    </NLayoutSider>
  </div>

  <template v-if="isMobile">
    <div v-show="!collapsed" class="fixed inset-0 z-40 bg-black/40" @click="handleUpdateCollapsed" />
  </template>
</template>

<style lang="css" scoped>
.my-sider .n-layout-sider .n-layout-toggle-button {
  background-color: #04b2b2 !important;
}
</style>
