<script setup>
import { computed, watch } from 'vue';
import { NButton, NLayoutSider } from 'naive-ui';
import SiderList from './SiderList.vue';
import { useAppStore, useChatStore } from '@/store';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import api from '@/views/saas/api';
import day from 'dayjs';
import { SvgIcon } from '@/components/common';

const appStore = useAppStore();
const chatStore = useChatStore();

const { isMobile } = useBasicLayout();

const showModal = ref(false);

const collapsed = computed(() => appStore.siderCollapsed);

function handleAdd() {
  showModal.value = true;
}

async function createChat(type) {
  // 请求创建对话
  const uuid = day(Date.now()).format('YYMMDD-HH:mm:ss');
  const res = await api.postChatApi({ name: uuid, pattern: type });
  const { id, name, pattern, spend_count } = res;

  chatStore.addHistory({ name: name, id: id, isEdit: false, pattern, spendCount: spend_count });

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

const bodyStyle = {
  width: '600px',
};

const segmented = {
  content: 'soft',
  footer: 'soft',
};

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
      <div class="flex flex-col h-full" :class="isMobile ? 'mt-16' : ''" :style="mobileSafeArea">
        <main class="flex flex-col flex-1 min-h-0">
          <div class="p-4">
            <NButton dashed block @click="handleAdd"
              ><SvgIcon class="mr-2 text-lg bg-transparent" icon="uil:plus-circle" /> <span>创建新对话</span>
            </NButton>
            <n-modal
              v-model:show="showModal"
              class="custom-card"
              preset="card"
              :style="bodyStyle"
              title="创建对话"
              size="huge"
              :bordered="false"
              :segmented="segmented"
            >
              <div class="flex flex-col items-center justify-center">
                <n-button type="tertiary" class="mb-4 w-50" @click="createChat('single')">
                  <template #icon>
                    <SvgIcon icon="uil:comment-alt" />
                  </template>
                  单轮对话
                </n-button>
                <n-button type="tertiary" class="mb-4 w-50" @click="createChat('multi')">
                  <template #icon>
                    <SvgIcon icon="uil:comment-alt-dots" />
                  </template>
                  多轮对话
                </n-button>
                <n-button type="tertiary" class="mb-4 w-50" @click="createChat('image')">
                  <template #icon>
                    <SvgIcon icon="uil:comment-alt-image" />
                  </template>
                  图片生成
                </n-button>
              </div>
            </n-modal>
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

.my-sider {
  z-index: 999999;
}
</style>
