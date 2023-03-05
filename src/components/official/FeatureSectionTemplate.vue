<template>
  <div class="overflow-hidden bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl md:px-6 lg:px-8">
      <div class="grid grid-cols-1 gap-y-16 gap-x-8 sm:gap-y-20 lg:grid-cols-9 lg:items-start">
        <div class="px-6 lg:px-0 lg:pt-4 lg:pr-4 col-span-3">
          <div class="mx-auto max-w-2xl lg:mx-0 lg:max-w-lg">
            <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">海量模版</p>
            <p class="mt-6 text-lg leading-8 text-gray-600">内置海量模版，帮助您快速开始</p>
            <dl class="mt-10 max-w-xl space-y-8 text-base leading-7 text-gray-600 lg:max-w-none">
              <div v-for="feature in features" :key="feature.name" class="relative pl-9">
                <dt class="inline font-semibold text-gray-900">
                  <component :is="feature.icon" class="absolute top-1 left-1 h-5 w-5 text-teal-400" aria-hidden="true" />
                  {{ feature.name }}
                </dt>

                <dd class="inline">{{ feature.description }}</dd>
              </div>
            </dl>
          </div>
        </div>
        <div class="sm:px-6 lg:px-0 col-span-6">
          <div
            class="relative isolate overflow-hidden bg-teal-500 px-6 pt-8 sm:mx-auto sm:max-w-2xl sm:rounded-3xl sm:pt-16 sm:pl-16 sm:pr-0 lg:mx-0 lg:max-w-none">
            <div
              class="absolute -inset-y-px -left-3 -z-10 w-full origin-bottom-left skew-x-[-30deg] bg-indigo-100 opacity-20 ring-1 ring-inset ring-white"
              aria-hidden="true" />
            <div class="mx-auto max-w-2xl sm:mx-0 sm:max-w-none">
              <img :src=TemplateImg alt="Product screenshot" width="2432" height="1442"
                class="px-4 pt-4 rounded-tl-xl bg-gray-700 ring-1 ring-white/10" />
            </div>
            <div class="pointer-events-none absolute inset-0 ring-1 ring-inset  sm:rounded-3xl" aria-hidden="true" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { GifIcon, GlobeAsiaAustraliaIcon, PuzzlePieceIcon } from '@heroicons/vue/20/solid'
import TemplateImg from '@/assets/images/template.png'

const features = [
  {
    name: '内置20+模版库',
    description:
      '',
    icon: GifIcon,
  },
  {
    name: '持续解锁新玩法',
    description: '',
    icon: GlobeAsiaAustraliaIcon,
  },
  {
    name: '兼具趣味和实用',
    description: '',
    icon: PuzzlePieceIcon,
  },
]
</script>