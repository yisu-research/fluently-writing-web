<template>
  <div class="flex flex-col w-full h-full">
    <main id="capture" class="flex-1 overflow-hidden" :class="isMobile ? 'mt-0' : ''">
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
              <NCheckboxGroup :value="cities" @update:value="handleUpdateValue">
                <Message
                  v-for="(item, index) of dataSources"
                  :key="index"
                  :date-time="item.dateTime"
                  :text="item.text"
                  :index="index"
                  :inversion="item.inversion"
                  :error="item.error"
                  :loading="item.loading"
                  @regenerate="onRegenerate(index)"
                  @delete="handleDelete(index)"
                />
              </NCheckboxGroup>
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
        <div class="flex items-center justify-between mb-4">
          <p v-if="pattern === 'image'" class="text-xs">生成1张图片将消耗10次（ 限时免费！！！）</p>
          <div v-if="pattern === 'image'" class="flex justify-end mb-4 md:hidden">
            <n-input-number v-model:value="imageCount" placeholder="最大值" :min="1" :max="10" class="w-20 mr-4" />
            <n-popselect v-model:value="imageSize" :options="options" trigger="click">
              <n-button>{{ imageSize || '图片质量' }}</n-button>
            </n-popselect>
          </div>
        </div>
        <n-upload
          v-if="model === 'gpt-4-vision-preview'"
          action="/api/attachments"
          :headers="{
            Authorization: 'Bearer ' + token,
          }"
          list-type="image"
          :create-thumbnail-url="createThumbnailUrl"
          max="1"
          @finish="handleFinish"
        >
          <n-button>上传图片</n-button>
        </n-upload>
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
          <div v-if="pattern === 'image'" class="items-center justify-start hidden md:flex">
            <n-input-number v-model:value="imageCount" placeholder="最大值" :min="1" :max="10" class="w-20 mr-2" />
            <n-popselect v-model:value="imageSize" :options="options" trigger="click">
              <n-button>{{ imageSize || '图片质量' }}</n-button>
            </n-popselect>
          </div>
          <n-button strong secondary type="success" :disabled="buttonDisabled" @click="handleSubmit">
            <template #icon>
              <span>
                <SvgIcon icon="uil:message" />
              </span>
            </template>
            发送
          </n-button>
          <!-- <n-button v-if="chatStore.isCheck" strong secondary type="success" @click="sharePrintScreen">
            生成截图
          </n-button>
          <n-button v-if="!chatStore.isCheck" strong secondary type="success" @click="handlePrintScreen">
            分享消息
          </n-button>
          <n-button v-else strong secondary type="success" @click="handlePrintScreen"> 退出选择 </n-button> -->
        </div>
      </div>
    </footer>
  </div>

  <!-- 分享图 -->
  <NModal v-model:show="showShare">
    <div class="flex flex-col items-start justify-start max-w-screen sm:w-1/2s sm:max-w-7xl">
      <div id="shareScreen" class="w-full p-2 my-4 bg-white rounded-lg shadow">
        <!-- <div><p class="mx-2 my-2 text-2xl font-medium text-center text-teal-700">Title</p></div> -->
        <div id="share" class="p-2 my-4"></div>
        <div class="flex flex-wrap items-start justify-between mx-2 my-2">
          <div class="flex justify-start">
            <img :src="YisuImg" width="25" class="mr-2" />
            <p class="font-bold">一粟科研</p>
          </div>
          <div>
            <p>邀请码</p>
            <p>{{ userStore.userInfo.invite_code }}</p>
          </div>
          <div class="flex flex-col items-center justify-center text-sm">
            <img :src="ChatImg" alt="QR Code" class="ring-0 rounded-md ring-teal-500 h-[60px] lg:h-[80px]" />
            <p>扫码体验</p>
          </div>
        </div>
      </div>
      <div class="flex justify-between w-full p-2 rounded-3xl bg-slate-100/80">
        <n-button icon-placement="left" secondary strong type="success" round @click="shareToDiscovery">
          <template #icon>
            <SvgIcon icon="solar:share-linear" />
          </template>
          分享到广场
        </n-button>
        <n-button icon-placement="left" secondary strong type="info" round @click="downloadImage(dataUrl)">
          <template #icon>
            <SvgIcon icon="solar:gallery-download-broken" />
          </template>
          下载图片
        </n-button>
      </div>
    </div>
  </NModal>
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
import { NButton, NInput, useDialog, NCheckboxGroup, NModal } from 'naive-ui';
import { getToken } from '@/utils';
import YisuImg from '@/assets/images/yisu.png';
import ChatImg from '@/assets/images/chat.png';

import { EventSourcePolyfill } from 'event-source-polyfill';
import { fetchEventSource } from '@microsoft/fetch-event-source';

import { Message } from '@/views/saas/chat/components';

import api from '@/views/saas/api';
import { onMounted, nextTick, ref, computed } from 'vue';
import { formatDateTime, url2File } from '@/utils';
import html2canvas from 'html2canvas';
import FormData from 'form-data';

let controller = new AbortController();

const newScrollRef = ref(null);

const showShare = ref(false);

// const notification = useNotification();

const route = useRoute();
const router = useRouter();
const dialog = useDialog();
const token = getToken();

const userStore = useUserStore();

const chatStore = useChatStore();
useCopyCode();

const handleBox = () => {
  chatStore.isCheck = !chatStore.isCheck;
};

const userInfo = computed(() => userStore.userInfo);

const count = computed(() => userInfo.value.balance);

const imageSize = ref('256x256');

const dataUrl = ref(null);

const imgUrl = ref('');

const options = [
  { label: '256x256', value: '256x256' },
  { label: '512x512', value: '512x512' },
  { label: '1024x1024', value: '1024x1024' },
];

function handleFinish({ file, event }) {
  imgUrl.value = JSON.parse(event.target.response).url;
}

const cities = ref(null);

const handleUpdateValue = (value) => {
  cities.value = value;
  console.log(cities.value);
};

const imageCount = ref(1);

const { isMobile } = useBasicLayout();

const { addChat, updateChat, updateChatSome, getChatByUuidAndIndex } = useChat();
const { scrollRef, scrollToBottom } = useScroll();

const id = route.params.id;

const pattern = route.query.pattern;

const model = route.query.model;

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

const sharePrintScreen = () => {
  if (cities.value === null || cities.value.length === 0) {
    window.$message.info('请在对话右侧勾选需要分享的内容');
    return;
  }

  showShare.value = true;

  const containers = document.createElement('div');

  handleBox();

  // 将 cities.value 中的数据排序后，存入list中
  const list = [];
  for (const item of cities.value) {
    list.push(item);
  }

  list.sort();

  setTimeout(() => {
    for (const item of list) {
      const element = document.getElementById(item);
      const copy = element.cloneNode(true);
      containers.appendChild(copy);
    }
    const sharePoster = document.getElementById('share');
    sharePoster.appendChild(containers);

    const shareScreen = document.getElementById('shareScreen');

    html2canvas(shareScreen, {
      width: shareScreen.offsetWidth,
      height: shareScreen.offsetHeight,
    }).then((canvas) => {
      dataUrl.value = canvas.toDataURL('image/png');
    });
  }, 600);
};

const downloadImage = (dataURL) => {
  // 新建一个a标签
  let oA = document.createElement('a');
  oA.download = Date.now() + '截图'; // 设置下载的文件名
  oA.href = dataURL;
  document.body.appendChild(oA);
  oA.click(); // 模拟点击a标签
  oA.remove(); // 下载之后把创建的元素删除
};

let message = [];

const handlePrintScreen = () => {
  handleBox();
};

const shareToDiscovery = async () => {
  try {
    let data = new FormData();
    const fileData = await url2File(dataUrl.value, Date.now + '-share.png');
    data.append('screenshot', fileData);
    data.append('conversation_id', id);
    let res = await api.createShareApi(data);
    console.log('res', res);
    if (res) {
      $message.success('分享成功');
      showShare.value = false;
    }
  } catch (err) {
    console.log(err);
    $message.error('分享失败');
  }
};

function createThumbnailUrl(file) {
  if (!file) return 0;

  console.log(imgUrl.value);
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(imgUrl.value);
    }, file.name);
  });
}

onMounted(async () => {
  try {
    await userStore.getUserInfo();
    count.value = userInfo.value.balance;
    const res = await api.getMessageListApi({ conversation_id: id });
    const index = chatStore.chat.findIndex((item) => item.id === Number(id));
    if (index === -1) {
      return;
    }
    chatStore.chat[index].data = [];
    for (let i = 0; i < res.length; i++) {
      if (res[i] !== null) {
        if (res[i].pattern === 'image') {
          let imageContent = `以下是满足 '${res[i].user_content}' 要求的图片:\n\n`;

          if (res[i].completion_content === null) {
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
              text: '图片生成失败，请重新尝试',
              inversion: false,
              error: false,
              conversationOptions: { conversationId: res[i].conversation_id, parentMessageId: res[i].conversation_id },
              requestOptions: { options: { prompt: res[i].user_content } },
            });
            return;
          }

          for (let j = 0; j < res[i].completion_content.length; j++) {
            const item = res[i].completion_content[j];
            imageContent = imageContent + `![图片](${item.url})\n\n`;
          }
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
            text: imageContent,
            inversion: false,
            error: false,
            conversationOptions: { conversationId: res[i].conversation_id, parentMessageId: res[i].conversation_id },
            requestOptions: { options: { prompt: res[i].user_content } },
          });
        } else {
          // 添加聊天记录
          if (res[i].role === 'user') {
            addChat(Number(id), {
              dateTime: formatDateTime(res[i].created_at),
              text: res[i].content[0].text,
              inversion: true,
              error: false,
              conversationOptions: null,
              requestOptions: { options: { prompt: res[i].content[0].text } },
            });
          }
          if (res[i].role === 'assistant') {
            addChat(Number(id), {
              dateTime: formatDateTime(res[i].created_at),
              text: res[i].content[0].text,
              inversion: false,
              error: false,
              conversationOptions: { conversationId: res[i].conversation_id, parentMessageId: res[i].conversation_id },
              requestOptions: { options: { prompt: res[i].content[0].text } },
            });
          }
        }
      }
    }
  } catch (error) {
    console.error(error);
  }
});

let pollingST = null;
let pollCount = 0;
const destroyed = () => {
  clearTimeout(pollingST);
  pollCount = 0;
  pollingST = null;
};

watch(
  () => imgUrl.value,
  (value) => {
    if (value !== '') {
      message.push({
        type: 'image_url',
        image_url: {
          url: value.split('?')[0],
        },
      });
    }
  },
);

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
    if (userInfo.value.email === null) {
      dialog.warning({
        title: '提示',
        content: '余额不足，去「个人中心」绑定邮箱可以继续获得10次体验',
        positiveText: '去绑定',
        negativeText: '去充值',
        onPositiveClick: () => {
          router.push('/user-center');
        },
        onNegativeClick: () => {
          router.push('/cost');
        },
      });
      return;
    } else {
      dialog.warning({
        title: '提示',
        content: '余额不足，请充值',
        positiveText: '去充值',
        negativeText: '取消',
        onPositiveClick: () => {
          router.push('/cost');
        },
      });
    }

    return;
  }

  message.push({
    type: 'text',
    text: prompt.value,
  });
  console.log('ccccc');
  console.log(message);

  if (loading.value) return;

  // if (!message || message[0]) return;

  controller = new AbortController();

  count.value = count.value - 1;

  addChat(Number(id), {
    dateTime: new Date().toLocaleString(),
    text: message[0].text,
    inversion: true,
    error: false,
    conversationOptions: null,
    requestOptions: { prompt: message[0].text, options: null },
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
    requestOptions: { prompt: message[0].text, options: { ...options } },
  });
  scrollToBottom();
  updateChat(Number(id), dataSources.value.length - 1, {
    dateTime: new Date().toLocaleString(),
    text:
      pattern === 'image'
        ? '图片正在生成中...\n\n 三十秒后如无响应，请重新发送'
        : '回答正在飞奔而来...\n\n 三十秒后如无响应，请重新发送',
    inversion: false,
    error: false,
    loading: false,
    conversationOptions: { conversationId: id, parentMessageId: id },
    requestOptions: { prompt: message, options: { ...options } },
  });
  scrollToBottom();

  if (pattern === 'image') {
    const polling = (idM) => {
      pollCount++;
      api.getMessageDetailApi(idM).then(async (res) => {
        if (pollCount > 20) {
          destroyed();
          loading.value = false;
          updateChat(Number(id), dataSources.value.length - 1, {
            dateTime: new Date().toLocaleString(),
            text: '图片生成失败，请重新尝试',
            inversion: false,
            error: false,
            loading: false,
            conversationOptions: { conversationId: id, parentMessageId: id },
            requestOptions: { prompt: message, options: { ...options } },
          });
          scrollToBottom();
          return;
        }
        if (res.completion_content !== null) {
          destroyed();
          loading.value = false;
          let imageContent = `以下是满足 '${message}' 要求的图片:\n\n`;

          for (let i = 0; i < res.completion_content.length; i++) {
            const item = res.completion_content[i];
            imageContent = imageContent + `![图片](${item.url})\n\n`;
          }
          console.log(imageContent);
          updateChat(Number(id), dataSources.value.length - 1, {
            dateTime: new Date().toLocaleString(),
            text: imageContent ?? '',
            inversion: false,
            error: false,
            loading: false,
            conversationOptions: { conversationId: id, parentMessageId: id },
            requestOptions: { prompt: message, options: { ...options } },
          });
          scrollToBottom();
          return;
        } else {
          pollingST = setTimeout(() => {
            clearTimeout(pollingST);
            polling(idM);
          }, 1500);
        }
      });
    };
    try {
      const res = await api.generatePictureApi({
        conversation_id: id,
        content: message,
        count: imageCount.value,
        size: imageSize.value,
      });
      polling(res.id);
      console.log(res);
    } catch (error) {
      console.error(error);
    }
  } else {
    try {
      // const url = encodeURI(
      //   `https://ai.yisukeyan.com/api/messages/stream?conversation_id=${id}&content=${JSON.stringify(message)}`,
      // );
      const url = encodeURI(`/api/messages/stream?conversation_id=${id}&content=${JSON.stringify(message)}`);
      const token = getToken();
      console.log(url);
      const ctrl = new AbortController();
      console.log(ctrl);
      await fetchEventSource(url, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          withCredentials: true,
          ContentType: 'application/json',
        },
        body: JSON.stringify({
          conversation_id: id,
          content: message,
        }),
        signal: ctrl.signal,
        async onopen(event) {
          console.log('链接成功', event);
        },
        onmessage(msg) {
          console.log('onMessage');
          console.log(msg);
          // if the server emits an error message, throw an exception
          // so it gets handled by the onerror callback below:
          if (msg.event === 'FatalError') {
            // throw new FatalError(msg.data);
            console.log(msg.event);
          }
          if (msg.data === '[DONE]') {
            loading.value = false;
            return;
          }
          if (msg.data.indexOf('[ERROR]') !== -1) {
            loading.value = false;
            console.log(msg.data);
            updateChat(Number(id), dataSources.value.length - 1, {
              dateTime: new Date().toLocaleString(),
              text: msg.data.slice(msg.data.indexOf('[ERROR]') + 6) ?? '',
              inversion: false,
              error: false,
              loading: false,
              conversationOptions: { conversationId: id, parentMessageId: id },
              requestOptions: { prompt: message[0].text, options: { ...options } },
            });
            scrollToBottom();
            return;
          }
          const data = JSON.parse(msg.data);
          console.log(data);
          scrollToBottom();

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
          } catch (err) {
            console.error('更新失败', err);
          }
        },
        onclose() {
          console.log('onClose');
          loading.value = false;
          ctrl.abort();
        },
        onerror(err) {
          console.log('onError');
          ctrl.abort();
          // if the server closes the connection unexpectedly, retry:
          // throw new RetriableError();
          if (err?.error) {
            console.error('链接失败', err);
          }
          loading.value = false;
        },
      });
    } catch (error) {
      console.error(error);
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
      newScrollToBottom();
    }
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
      } catch (err) {
        console.error('更新失败', err);
      }
    };

    es.onerror = (err) => {
      if (err?.error) {
        console.error('链接失败', err);
      }
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

// 是否已读
// let markAsReadNote = lStorage.get('markAsRead');

onMounted(async () => {
  scrollToBottom();
  // if (!markAsReadNote) {
  //   let markAsRead = false;
  //   const n = notification.create({
  //     title: '更新通知',
  //     content: `新增「图片生成」功能，原先创作拆分成「单轮问答」与「多轮对话」，并调整了计费策略。详细可移步「系统说明」`,
  //     meta: new Date().toLocaleString(),
  //     action: () =>
  //       h(
  //         NButton,
  //         {
  //           text: true,
  //           type: 'primary',
  //           onClick: () => {
  //             markAsRead = true;
  //             lStorage.set('markAsRead', true);
  //             n.destroy();
  //           },
  //         },
  //         {
  //           default: () => '已读',
  //         },
  //       ),
  //   });
  // }
});

onUnmounted(() => {
  if (loading.value) controller.abort();
  destroyed();
});
</script>

<style lang="css" scoped>
.myScroll {
  overflow-y: auto !important;
}
</style>
