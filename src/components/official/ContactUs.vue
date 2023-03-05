<!--
  This example requires some changes to your config:
  
  ```
  // tailwind.config.js
  module.exports = {
    // ...
    plugins: [
      // ...
      require('@tailwindcss/forms'),
    ],
  }
  ```
-->
<template>
  <div class="relative isolate bg-white">
    <div class="mx-auto grid max-w-7xl grid-cols-1 lg:grid-cols-2">
      <div class="relative px-6 pt-24 pb-20 sm:pt-32 lg:static lg:py-48 lg:px-8">
        <div class="mx-auto max-w-xl lg:mx-0 lg:max-w-lg">
          <div class="absolute inset-y-0 left-0 -z-10 w-full overflow-hidden bg-gray-100 ring-1 ring-gray-900/10">
            <svg
              class="absolute inset-0 h-full w-full stroke-gray-200 [mask-image:radial-gradient(100%_100%_at_top_right,white,transparent)]"
              aria-hidden="true">
              <defs>
                <pattern id="83fd4e5a-9d52-42fc-97b6-718e5d7ee527" width="200" height="200" x="100%" y="-1"
                  patternUnits="userSpaceOnUse">
                  <path d="M130 200V.5M.5 .5H200" fill="none" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" stroke-width="0" fill="white" />
              <svg x="100%" y="-1" class="overflow-visible fill-gray-50">
                <path d="M-470.5 0h201v201h-201Z" stroke-width="0" />
              </svg>
              <rect width="100%" height="100%" stroke-width="0" fill="url(#83fd4e5a-9d52-42fc-97b6-718e5d7ee527)" />
            </svg>
          </div>
          <h2 class="text-3xl font-bold tracking-tight text-gray-900">加入社区</h2>
          <p class="mt-6 text-lg leading-8 text-gray-600">加入社区，帮助我们一起完善</p>
          <dl class="mt-10 space-y-4 text-base leading-7 text-gray-600">
            <div class="flex gap-x-4">
              <dt class="flex-none">

                <ChatBubbleBottomCenterTextIcon class="h-7 w-6 text-gray-400" aria-hidden="true" />
              </dt>
              <dd>意见反馈</dd>
            </div>
            <div class="flex gap-x-4">
              <dt class="flex-none">

                <FireIcon class="h-7 w-6 text-gray-400" aria-hidden="true" />
              </dt>
              <dd><a class="hover:text-gray-900">新功能</a></dd>
            </div>

          </dl>
        </div>
      </div>
      <div class="px-6 pb-24 pt-20 sm:pb-32 lg:py-48 lg:px-8">
        <img :src=EnglishWritingImg alt="Product screenshot" class="sm:rounded-3xl bg-gray-300 ring-13 ring-white/10" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ChatBubbleBottomCenterTextIcon, FireIcon } from '@heroicons/vue/24/outline'
import EnglishWritingImg from '@/assets/images/english_writing.png'
</script>

