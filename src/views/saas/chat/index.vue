<template>
  <div class="flex flex-col w-full h-full">
    <main class="flex-1 overflow-hidden">
      <div
        id="scrollRef"
        ref="scrollRef"
        :class="[isMobile ? 'p-2' : 'p-4', 'h-full', 'overflow-hidden', 'overflow-y-auto']"
      >
        <div class="w-full max-w-screen-xl m-auto">
          <template v-if="!dataSources.length">
            <div class="flex items-center justify-center mt-4 text-center text-neutral-200">
              <SvgIcon icon="cib:overleaf" class="mr-2 text-2xl" />
              <span>嗨~</span>
            </div>
          </template>
          <template v-else>
            <div>
              <Message
                v-for="(item, index) of dataSources"
                :key="index"
                :date-time="item.dateTime"
                :text="item.text"
                :inversion="item.inversion"
                :error="item.error"
                :loading="item.loading"
                @regenerate="onRegenerate(index)"
                @delete="handleDelete(index)"
              />
              <div class="sticky bottom-0 left-0 flex justify-center">
                <n-button v-if="loading" type="warning" @click="handleStop">
                  <template #icon>
                    <SvgIcon icon="ri:stop-circle-line" />
                  </template>
                  终止请求
                </n-button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </main>
    <footer :class="footerClass">
      <div class="w-full max-w-screen-xl m-auto">
        <div class="flex items-center justify-between space-x-2">
          <n-button tertiary type="error" @click="handleClear">
            <template #icon>
              <span class="text-xl">
                <SvgIcon icon="eva:trash-2-outline" />
              </span>
            </template>
          </n-button>

          <n-input
            v-model:value="prompt"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 2 }"
            :placeholder="placeholder"
            @keypress="handleEnter"
          />
          <n-button strong secondary type="success" :disabled="buttonDisabled" @click="handleSubmit">
            <template #icon>
              <span>
                <SvgIcon icon="uil:message" />
              </span>
            </template>
            发送
          </n-button>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import { useChatStore } from '@/store';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { SvgIcon } from '@/components/common';
import { useScroll } from './hooks/useScroll';
import { useChat } from './hooks/useChat';
import { useCopyCode } from './hooks/useCopyCode';
import { NButton, NInput, useDialog } from 'naive-ui';

import { Message } from './components';

import api from '@/views/saas/api';
import { onMounted } from 'vue';

let controller = new AbortController();

const route = useRoute();
const dialog = useDialog();

const chatStore = useChatStore();
useCopyCode();

const { isMobile } = useBasicLayout();

const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat();
const { scrollRef, scrollToBottom } = useScroll();

const id = route.params.id;

const dataSources = computed(() => chatStore.getChatById(Number(id)));

const conversationList = computed(() => dataSources.value.filter((item) => !item.inversion && !item.error));

const prompt = ref('');
const loading = ref(false);

function handleSubmit() {
  onConversation();
}

onMounted(async () => {
  console.log('id');
  console.log(id);
  // await api.getMessageListApi({ conversation_id: id });
  console.log('参数');
  console.log(id);
  console.log('聊天内容');
  console.log(dataSources.value);
});

// 发送消息
async function onConversation() {
  console.log('发送消息');
  console.log(id);
  const message = prompt.value;

  if (loading.value) return;

  if (!message || message.trim() === '') return;

  controller = new AbortController();

  addChat(Number(id), {
    dateTime: new Date().toLocaleString(),
    text: message,
    inversion: true,
    error: false,
    conversationOptions: null,
    requestOptions: { prompt: message, options: null },
  });
  scrollToBottom();

  loading.value = true;
  prompt.value = '';

  let options = {};
  const lastContext = conversationList.value[conversationList.value.length - 1]?.conversationOptions;

  if (lastContext) options = { ...lastContext };

  addChat(Number(id), {
    dateTime: new Date().toLocaleString(),
    text: '',
    loading: true,
    inversion: false,
    error: false,
    conversationOptions: null,
    requestOptions: { prompt: message, options: { ...options } },
  });
  scrollToBottom();

  try {
    const res = await api.postMessageApi({ content: message, conversation_id: Number(id) });
    console.log('res', res.assistant_content);
    updateChat(Number(id), dataSources.value.length - 1, {
      dateTime: new Date().toLocaleString(),
      text: res.assistant_content ?? '',
      inversion: false,
      error: false,
      loading: false,
      conversationOptions: { conversationId: id, parentMessageId: res.id },
      requestOptions: { prompt: message, options: { ...options } },
    });
    scrollToBottom();
  } catch (error) {
    console.log('err', error);
    const errorMessage = error?.message ?? '好像出了什么错误，请稍后重试';

    if (error.message === 'canceled') {
      updateChatSome(Number(id), dataSources.value.length - 1, {
        loading: false,
      });
      scrollToBottom();
      return;
    }

    const currentChat = getChatByUuidAndIndex(Number(id), dataSources.value.length - 1);

    if (currentChat?.text && currentChat.text !== '') {
      updateChatSome(Number(id), dataSources.value.length - 1, {
        text: `${currentChat.text}\n[${errorMessage}]`,
        error: false,
        loading: false,
      });
      return;
    }

    updateChat(Number(id), dataSources.value.length - 1, {
      dateTime: new Date().toLocaleString(),
      text: errorMessage,
      inversion: false,
      error: true,
      loading: false,
      conversationOptions: null,
      requestOptions: { prompt: message, options: { ...options } },
    });
    scrollToBottom();
  } finally {
    loading.value = false;
  }
}

async function onRegenerate(index) {
  if (loading.value) return;

  controller = new AbortController();

  const { requestOptions } = dataSources.value[index];

  const message = requestOptions?.prompt ?? '';

  let options = {};

  if (requestOptions.options) options = { ...requestOptions.options };

  loading.value = true;

  updateChat(Number(id), index, {
    dateTime: new Date().toLocaleString(),
    text: '',
    inversion: false,
    error: false,
    loading: true,
    conversationOptions: null,
    requestOptions: { prompt: message, ...options },
  });

  try {
    const res = await api.postMessageApi({ content: message, conversation_id: Number(id) });
    console.log('res', res.assistant_content);
    updateChat(Number(id), index, {
      dateTime: new Date().toLocaleString(),
      text: res.assistant_content ?? '',
      inversion: false,
      error: false,
      loading: false,
      conversationOptions: { conversationId: id, parentMessageId: res.id },
      requestOptions: { prompt: message, ...options },
    });
  } catch (error) {
    if (error.message === 'canceled') {
      updateChatSome(Number(id), index, {
        loading: false,
      });
      return;
    }

    const errorMessage = error?.message ?? '好像出错了，请稍后再试。';

    updateChat(Number(id), index, {
      dateTime: new Date().toLocaleString(),
      text: errorMessage,
      inversion: false,
      error: true,
      loading: false,
      conversationOptions: null,
      requestOptions: { prompt: message, ...options },
    });
  } finally {
    loading.value = false;
  }
}

function handleDelete(index) {
  if (loading.value) return;

  dialog.warning({
    title: '删除消息',
    content: '是否删除此消息?',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: () => {
      chatStore.deleteChatByUuid(Number(id), index);
    },
  });
}

function handleClear() {
  if (loading.value) return;

  console.log('dddddddddd');
  dialog.warning({
    title: '清空会话',
    content: '是否清空会话?',
    positiveText: '确认',
    negativeText: '取消',
    onPositiveClick: () => {
      chatStore.clearChatByUuid(Number(id));
    },
  });
}

function handleEnter(event) {
  if (!isMobile.value) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }
}

function handleStop() {
  if (loading.value) {
    controller.abort();
    loading.value = false;
  }
}

const placeholder = computed(() => {
  if (isMobile.value) return '来说点什么...';
  return '来说点什么...（Shift + Enter = 换行）';
});

const buttonDisabled = computed(() => {
  return loading.value || !prompt.value || prompt.value.trim() === '';
});

const footerClass = computed(() => {
  let classes = ['p-4'];
  if (isMobile.value) classes = ['sticky', 'left-0', 'bottom-0', 'right-0', 'p-2', 'pr-4', 'overflow-hidden'];
  return classes;
});

onMounted(() => {
  scrollToBottom();
});

onUnmounted(() => {
  if (loading.value) controller.abort();
});
</script>
