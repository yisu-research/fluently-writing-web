<template>
  <div class="h-full transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <n-layout
      class="h-full"
      :native-scrollbar="false"
      :class="[isMobile ? 'rounded-none shadow-none' : 'border rounded-md shadow-md']"
    >
      <div class="flex justify-center items-center pt-10 pb-8 px-6">
        <div class="image-container">
          <img :src="ChatImg" alt="QR Code" class="ring-4 rounded-md ring-teal-500" />
          <div class="ripples">
            <div class="ripple"></div>
            <div class="ripple"></div>
            <div class="ripple"></div>
          </div>
        </div>
        <img :src="ScreenImg" alt="Screenshot" class="h-[400px] lg:h-[600px] drop-shadow-xl hidden md:block" />
      </div>
      <div class="flex justify-center px-4">
        <div class="mt-4 text-sm text-slate-600">
          <p>
            <n-icon size="20">
              <icon-mdi:web-check />
            </n-icon>
            <span class="ml-1">手机扫描上方二维码，或浏览器直接访问</span>
            <n-tooltip trigger="hover">
              <template #trigger>
                <span class="hover:text-teal-500 cursor-copy" @click="copyToClipboard('https://ai.yisukeyan.com/chat')">
                  <span class="mx-1">https://ai.yisukeyan.com/chat</span>
                  <n-icon size="16">
                    <icon-ic:baseline-content-copy />
                  </n-icon>
                </span>
              </template>
              点击以复制链接
            </n-tooltip>
          </p>
          <p>
            <n-icon size="20">
              <icon-ic:round-star />
            </n-icon>
            <span class="ml-1">在微信中收藏网址，或添加至浏览器书签，下次使用更方便</span>
          </p>
          <p>
            <n-icon size="20">
              <icon-ic:twotone-security-update-warning />
            </n-icon>
            <span class="ml-1">若遇到界面错乱的问题，请尝试清空</span>
            <n-tooltip trigger="hover">
              <template #trigger>
                <span class="underline">浏览器</span>
              </template>
              按下 CTRL+F5，或参照各浏览器使用手册
            </n-tooltip>
            <span>或</span>
            <n-tooltip trigger="hover">
              <template #trigger>
                <span class="underline">微信</span>
              </template>
              我 -> 设置 -> 通用 -> 存储空间 -> 清理缓存
            </n-tooltip>
            <span>的缓存</span>
          </p>
        </div>
      </div>
    </n-layout>
  </div>
</template>

<script setup>
import ChatImg from '@/assets/images/chat.png';
import ScreenImg from '@/assets/images/screenshot.png';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { useMessage } from 'naive-ui';

const { isMobile } = useBasicLayout();
const message = useMessage();

function copyToClipboard(text) {
  navigator.clipboard
    .writeText(text)
    .then(() => {
      console.log('Copied to clipboard');
      message.success('链接已复制到剪贴板');
    })
    .catch((err) => {
      console.error('Error copying to clipboard:', err);
      message.error('链接复制失败，请重试到');
    });
}
</script>

<style lang="scss">
$n: 3;

.image-container {
  position: relative;
  width: 600px;
  height: 600px;

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 300px;
    height: 300px;
    z-index: 1;
  }

  .ripples {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 600px;
    height: 600px;
    z-index: 0;

    .ripple {
      position: absolute;
      animation: ripple 3s infinite ease-out;
      background-color: teal;
      border-radius: 50%;
      height: 100%;
      width: 100%;
      opacity: 0;

      @for $i from 1 through $n {
        &:nth-of-type(#{$i}) {
          animation-delay: 1s * $i;
        }
      }
    }
  }
}

@keyframes ripple {
  0% {
    opacity: 0.5;
    transform: scale(0);
  }
  100% {
    opacity: 0;
    transform: scale(1);
  }
}
</style>
