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
                  Stop Responding
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
          <HoverButton @click="handleClear">
            <span class="text-xl text-[#4f555e]">
              <SvgIcon icon="ri:delete-bin-line" />
            </span>
          </HoverButton>
          <n-input
            v-model:value="prompt"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 2 }"
            :placeholder="placeholder"
            @keypress="handleEnter"
          />
          <n-button type="primary" :disabled="buttonDisabled" @click="handleSubmit">
            <template #icon>
              <span>
                <SvgIcon icon="ri:send-plane-fill" />
              </span>
            </template>
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
import { HoverButton, SvgIcon } from '@/components/common';
import { useScroll } from './hooks/useScroll';
import { useChat } from './hooks/useChat';
import { useCopyCode } from './hooks/useCopyCode';

import { Message } from './components';

const route = useRoute();
const chatStore = useChatStore();
useCopyCode();

const { isMobile } = useBasicLayout();

const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat();
const { scrollRef, scrollToBottom } = useScroll();

const { uuid } = route.params;

const dataSources = computed(() => chatStore.getChatByUuid(Number(uuid)));

const conversationList = computed(() => dataSources.value.filter((item) => !item.inversion && !item.error));

const prompt = ref('');
const loading = ref(false);

function handleSubmit() {
  onConversation();
}

async function onConversation() {
  const message = prompt.value;

  if (loading.value) return;

  if (!message || message.trim() === '') return;

  controller = new AbortController();

  addChat(Number(uuid), {
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

  addChat(Number(uuid), {
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
    // (await fetchChatAPIProcess)
    //   {
    //     prompt: message,
    //     options,
    //     signal: controller.signal,
    //     onDownloadProgress: ({ event }) => {
    //       const xhr = event.target;
    //       const { responseText } = xhr;
    //       // Always process the final line
    //       const lastIndex = responseText.lastIndexOf('\n');
    //       let chunk = responseText;
    //       if (lastIndex !== -1) chunk = responseText.substring(lastIndex);
    //       try {
    //         const data = JSON.parse(chunk);
    //         updateChat(Number(uuid), dataSources.value.length - 1, {
    //           dateTime: new Date().toLocaleString(),
    //           text: data.text ?? '',
    //           inversion: false,
    //           error: false,
    //           loading: false,
    //           conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
    //           requestOptions: { prompt: message, options: { ...options } },
    //         });
    //         scrollToBottom();
    //       } catch (error) {
    //         //
    //       }
    //     },
    //   };
  } catch (error) {
    const errorMessage = error?.message ?? t('common.wrong');

    if (error.message === 'canceled') {
      updateChatSome(Number(uuid), dataSources.value.length - 1, {
        loading: false,
      });
      scrollToBottom();
      return;
    }

    const currentChat = getChatByUuidAndIndex(Number(uuid), dataSources.value.length - 1);

    if (currentChat?.text && currentChat.text !== '') {
      updateChatSome(Number(uuid), dataSources.value.length - 1, {
        text: `${currentChat.text}\n[${errorMessage}]`,
        error: false,
        loading: false,
      });
      return;
    }

    updateChat(Number(uuid), dataSources.value.length - 1, {
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

  updateChat(Number(uuid), index, {
    dateTime: new Date().toLocaleString(),
    text: '',
    inversion: false,
    error: false,
    loading: true,
    conversationOptions: null,
    requestOptions: { prompt: message, ...options },
  });

  try {
    // (await fetchChatAPIProcess)
    //   {
    //     prompt: message,
    //     options,
    //     signal: controller.signal,
    //     onDownloadProgress: ({ event }) => {
    //       const xhr = event.target;
    //       const { responseText } = xhr;
    //       // Always process the final line
    //       const lastIndex = responseText.lastIndexOf('\n');
    //       let chunk = responseText;
    //       if (lastIndex !== -1) chunk = responseText.substring(lastIndex);
    //       try {
    //         const data = JSON.parse(chunk);
    //         updateChat(Number(uuid), index, {
    //           dateTime: new Date().toLocaleString(),
    //           text: data.text ?? '',
    //           inversion: false,
    //           error: false,
    //           loading: false,
    //           conversationOptions: { conversationId: data.conversationId, parentMessageId: data.id },
    //           requestOptions: { prompt: message, ...options },
    //         });
    //       } catch (error) {
    //         //
    //       }
    //     },
    //   };
  } catch (error) {
    if (error.message === 'canceled') {
      updateChatSome(Number(uuid), index, {
        loading: false,
      });
      return;
    }

    const errorMessage = error?.message ?? t('common.wrong');

    updateChat(Number(uuid), index, {
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
    title: t('chat.deleteMessage'),
    content: t('chat.deleteMessageConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      chatStore.deleteChatByUuid(Number(uuid), index);
    },
  });
}

function handleClear() {
  if (loading.value) return;

  dialog.warning({
    title: t('chat.clearChat'),
    content: t('chat.clearChatConfirm'),
    positiveText: t('common.yes'),
    negativeText: t('common.no'),
    onPositiveClick: () => {
      chatStore.clearChatByUuid(Number(uuid));
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
