<template>
  <div class="h-full transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <n-layout
      class="h-full"
      :native-scrollbar="false"
      :class="[isMobile ? 'rounded-none shadow-none' : 'border rounded-md shadow-md']"
    >
      <div class="pt-10 text-2xl tracking-wide text-center md:text-4xl">
        <span class="fancy-underline">随时随地，自由创作</span>
      </div>
      <div class="flex items-center justify-center pt-12 lg:pt-16">
        <div class="image-container">
          <img :src="ChatImg" alt="QR Code" class="ring-4 rounded-md ring-teal-500 h-[200px] md:h-[300px]" />
        </div>
        <img
          :src="ScreenImg"
          alt="Screenshot"
          class="h-[400px] lg:h-[500px] xl:h-[600px] drop-shadow-xl hidden md:block pr-4"
        />
      </div>
      <div class="flex justify-center px-4 pt-4 lg:pt-8">
        <div class="mt-4 text-sm text-slate-600">
          <p>
            <n-icon size="20">
              <icon-mdi:web-check />
            </n-icon>
            <span class="ml-1">手机扫描上方二维码，或浏览器直接访问</span>
            <n-tooltip trigger="hover">
              <template #trigger>
                <span
                  class="cursor-pointer hover:text-teal-500"
                  @click="copyToClipboard('https://ai.yisukeyan.com/chat')"
                >
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
import ScreenImg from '@/assets/images/screenshot.gif';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { copyToClipboard } from '@/utils';

const { isMobile } = useBasicLayout();
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
          animation-delay: 1s * ($i - 1);
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

.fancy-underline {
  position: relative;
  white-space: nowrap;
  &:after {
    --deco-height: 20px;
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: calc(var(--deco-height) * -1.2);
    height: var(--deco-height);
    background-image: url("data:image/svg+xml,%3Csvg width='100' height='64' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cg clip-path='url(%23a)'%3E%3Cpath d='M-17 30.5C-1 22 72-4 54 13 37.9 28.2-2.5 57.5 16 55.5s72-29 104-40' stroke='%2314b8a6' stroke-width='10'/%3E%3C/g%3E%3Cdefs%3E%3CclipPath id='a'%3E%3Cpath fill='%23fff' d='M0 0h100v64H0z'/%3E%3C/clipPath%3E%3C/defs%3E%3C/svg%3E%0A");
    background-size: auto 100%;
    background-repeat: round;
    background-position: 0em;
  }
}
</style>
