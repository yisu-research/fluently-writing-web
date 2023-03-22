<!-- eslint-disable no-return-assign -->
<script setup>
import { computed, nextTick, onMounted } from 'vue';
import SvgIcon from '@/components/common/SvgIcon/index.vue';
import { useAppStore, useChatStore } from '@/store';
import MenuCollapse from './MenuCollapse.vue';
import { useRoute } from 'vue-router';

const appStore = useAppStore();
const chatStore = useChatStore();
const route = useRoute();

const collapsed = computed(() => appStore.siderCollapsed);
const currentChatHistory = computed(() => chatStore.getChatHistoryByCurrentActive);

const isChat = computed(() => appStore.isChat);

const routeName = computed(() => route.meta.title);

function handleUpdateCollapsed() {
  appStore.setCollapsed(true);
  appStore.setSiderCollapsed(!collapsed.value);
}

function onScrollToTop() {
  const scrollRef = document.querySelector('#scrollRef');
  if (scrollRef) nextTick(() => (scrollRef.scrollTop = 0));
}

onMounted(() => {});

// function onScrollToBottom() {
//   const scrollRef = document.querySelector('#scrollRef');
//   if (scrollRef) nextTick(() => (scrollRef.scrollTop = scrollRef.scrollHeight));
// }
</script>

<template>
  <header class="fixed top-0 left-0 right-0 z-30 px-4 border-b bg-white/80 backdrop-blur">
    <div class="relative flex items-center justify-between h-14">
      <MenuCollapse />
      <!-- <p>{{ currentChatHistory?.name ?? '' }}</p> -->
      <h1
        class="flex-1 px-4 overflow-hidden text-center cursor-pointer select-none text-ellipsis whitespace-nowrap"
        @dblclick="onScrollToTop"
      >
        {{ isChat ? currentChatHistory?.name ?? '' : routeName }}
      </h1>
      <button v-if="isChat" class="" @click="handleUpdateCollapsed">
        <n-button v-if="collapsed" type="primary" class="bg-teal-500"> 新的对话 </n-button>
        <SvgIcon v-else class="text-2xl bg-transparent" icon="uil:times" />
      </button>
      <!-- <button class="flex items-center justify-center w-11 h-11" @click="onScrollToBottom">
        <SvgIcon class="text-2xl" icon="ri:arrow-down-s-line" />
      </button> -->
    </div>
  </header>
</template>
