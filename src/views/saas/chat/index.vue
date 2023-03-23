<template>
  <div class="flex flex-col w-full h-full">
    <main class="flex-1 overflow-hidden" :class="isMobile ? 'mt-16' : ''">
      <!-- <n-scrollbar id="newScrollRef" ref="newScrollRef" class="h-full p-4 overflow-hidden overflow-y-auto"> -->
      <div id="scrollRef" ref="scrollRef" class="'p-4 m-2 h-full overflow-hidden myScroll">
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
              <!-- <div class="sticky bottom-0 left-0 flex justify-center">
                <n-button v-if="loading" type="warning" @click="handleStop">
                  <template #icon>
                    <SvgIcon icon="ri:stop-circle-line" />
                  </template>
                  终止请求
                </n-button>
              </div> -->
            </div>
          </template>
        </div>
      </div>
      <!-- </n-scrollbar> -->
    </main>
    <footer :class="footerClass">
      <div class="w-full max-w-screen-xl m-auto">
        <div class="flex items-center justify-between space-x-2">
          <!-- <n-button tertiary type="error" @click="handleClear">
            <template #icon>
              <span class="text-xl">
                <SvgIcon icon="eva:trash-2-outline" />
              </span>
            </template>
          </n-button> -->

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
import { useScroll } from '@/views/saas/chat/hooks/useScroll';
import { useChat } from '@/views/saas/chat/hooks/useChat';
import { useUserStore } from '@/store';
import { useCopyCode } from '@/views/saas/chat/hooks/useCopyCode';
import { NButton, NInput, useDialog } from 'naive-ui';
import { getToken } from '@/utils';

import { EventSourcePolyfill } from 'event-source-polyfill';

import { Message } from '@/views/saas/chat/components';

import api from '@/views/saas/api';
import { onMounted, nextTick, ref } from 'vue';
import { formatDateTime } from '@/utils';

let controller = new AbortController();

const newScrollRef = ref(null);

const route = useRoute();
const router = useRouter();
const dialog = useDialog();

const userStore = useUserStore();

const chatStore = useChatStore();
useCopyCode();

const userInfo = computed(() => userStore.userInfo);

const count = ref(0);

const { isMobile } = useBasicLayout();

const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat();
const { scrollRef, scrollToBottom } = useScroll();

const id = route.params.id;

const dataSources = computed(() => chatStore.getChatById(Number(id)));

const chatList = computed(() => chatStore.history);

const conversationList = computed(() => dataSources.value.filter((item) => !item.inversion && !item.error));

const prompt = ref('');
const loading = ref(false);

function handleSubmit() {
  onConversation();
}

const newScrollToBottom = async () => {
  await nextTick();
  if (newScrollRef.value) newScrollRef.value.scrollTop = newScrollRef.value.scrollHeight;
};

onMounted(async () => {
  try {
    const res = await api.getMessageListApi({ conversation_id: id });
    const index = chatStore.chat.findIndex((item) => item.id === Number(id));
    chatStore.chat[index].data = [];
    for (let i = 0; i < res.length; i++) {
      if (res[i] !== null) {
        // 添加聊天记录
        addChat(Number(id), {
          dateTime: formatDateTime(res[i].created_at),
          text: res[i].user_content,
          inversion: true,
          error: false,
          conversationOptions: null,
          requestOptions: { options: { prompt: res[i].user_content } },
        });
        addChat(Number(id), {
          dateTime: formatDateTime(res[i].created_at),
          text: res[i].assistant_content,
          inversion: false,
          error: false,
          conversationOptions: { conversationId: res[i].conversation_id, parentMessageId: res[i].conversation_id },
          requestOptions: { options: { prompt: res[i].user_content } },
        });
      }
    }
    await userStore.getUserInfo();
    count.value = userInfo.value.balance;
  } catch (error) {
    console.log(error);
  }
});

// 发送消息
async function onConversation() {
  if (chatList.value.length === 0) {
    dialog.warning({
      title: '温馨提示',
      content: '请在侧边栏创建新的对话，开启您的创作',
    });
    return;
  }

  if (count.value <= 0) {
    dialog.warning({
      title: '提示',
      content: '余额不足，请充值',
      positiveText: '去充值',
      negativeText: '取消',
      onPositiveClick: () => {
        router.push('/cost');
      },
    });
    return;
  }
  const message = prompt.value;

  if (loading.value) return;

  if (!message || message.trim() === '') return;

  controller = new AbortController();

  count.value = count.value - 1;

  addChat(Number(id), {
    dateTime: new Date().toLocaleString(),
    text: message,
    inversion: true,
    error: false,
    conversationOptions: null,
    requestOptions: { prompt: message, options: null },
  });
  scrollToBottom();
  newScrollToBottom();

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
  updateChat(Number(id), dataSources.value.length - 1, {
    dateTime: new Date().toLocaleString(),
    text: '回答正在飞奔而来...\n\n 三十秒后如无响应，请重新发送',
    inversion: false,
    error: false,
    loading: false,
    conversationOptions: { conversationId: id, parentMessageId: id },
    requestOptions: { prompt: message, options: { ...options } },
  });
  scrollToBottom();

  try {
    const url = `https://ai.yisukeyan.com/api/messages/stream?conversation_id=${id}&content=${message}`;
    const token = getToken();
    let es = new EventSourcePolyfill(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        withCredentials: true,
      },
    });

    es.onopen = (event) => {
      console.log('链接成功', event);
    };

    es.onmessage = (event) => {
      console.log(event.data);
      if (event.data === '[DONE]') {
        console.log('结束');
        loading.value = false;
        es.close();
        return;
      }
      if (event.data.search('[ERROR]') !== -1) {
        loading.value = false;
        updateChat(Number(id), dataSources.value.length - 1, {
          dateTime: new Date().toLocaleString(),
          text: event.data.slice(event.data.search('[ERROR]') + 6) ?? '',
          inversion: false,
          error: false,
          loading: false,
          conversationOptions: { conversationId: id, parentMessageId: id },
          requestOptions: { prompt: message, options: { ...options } },
        });
        scrollToBottom();
        es.close();
        return;
      }
      const data = JSON.parse(event.data);
      scrollToBottom();
      newScrollToBottom();

      try {
        updateChat(Number(id), dataSources.value.length - 1, {
          dateTime: new Date().toLocaleString(),
          text: data.content ?? '',
          inversion: false,
          error: false,
          loading: false,
          conversationOptions: { conversationId: id, parentMessageId: id },
          requestOptions: { prompt: message, options: { ...options } },
        });
        scrollToBottom();
        newScrollToBottom();
      } catch (err) {}
    };

    es.onerror = (error) => {
      console.log('链接失败', error);
      loading.value = false;
      es.close();
    };
  } catch (error) {
    const errorMessage = error?.message ?? '好像出了什么错误，请稍后重试';

    if (error.message === 'canceled') {
      updateChatSome(Number(id), dataSources.value.length - 1, {
        loading: false,
      });
      scrollToBottom();
      newScrollToBottom();

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
    newScrollToBottom();
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
    const url = `https://ai.yisukeyan.com/api/messages/stream?conversation_id=${id}&content=${message}`;
    const token = getToken();
    let es = new EventSourcePolyfill(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        withCredentials: true,
      },
    });

    es.onopen = (event) => {
      console.log('链接成功', event);
    };

    es.onmessage = (event) => {
      const data = JSON.parse(event.data);

      try {
        updateChat(Number(id), index, {
          dateTime: new Date().toLocaleString(),
          text: data.content ?? '',
          inversion: false,
          error: false,
          loading: false,
          conversationOptions: { conversationId: id, parentMessageId: res.id },
          requestOptions: { prompt: message, ...options },
        });
        newScrollToBottom();
      } catch (err) {}
    };

    es.onerror = (error) => {
      console.log('链接失败', error);
      es.close();
    };
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
    newScrollToBottom();
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

// function handleClear() {
//   if (loading.value) return;

//   console.log('dddddddddd');
//   dialog.warning({
//     title: '清空会话',
//     content: '是否清空会话?',
//     positiveText: '确认',
//     negativeText: '取消',
//     onPositiveClick: () => {
//       chatStore.clearChatByUuid(Number(id));
//     },
//   });
// }

function handleEnter(event) {
  if (!isMobile.value) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSubmit();
    }
  }
}

// function handleStop() {
//   if (loading.value) {
//     controller.abort();
//     loading.value = false;
//   }
// }

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
  newScrollToBottom();
});

onUnmounted(() => {
  if (loading.value) controller.abort();
});
</script>

<style lang="css" scoped>
.myScroll {
  overflow-y: auto !important;
}
</style>
