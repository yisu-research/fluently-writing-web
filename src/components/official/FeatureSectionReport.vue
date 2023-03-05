<template>
  <div class="bg-white py-24 sm:py-32">
    <div class="mx-auto max-w-7xl px-6 lg:px-8">
      <div class="mx-auto max-w-2xl sm:text-center">
        <p class="mt-2 text-3xl font-bold tracking-tight text-teal-400 sm:text-4xl">助写材料</p>
        <p class="mt-6 text-lg leading-8 text-gray-600">仅需几个关键词，帮助您快速搞定各种材料</p>
      </div>
    </div>
    <div class="mx-auto mt-16 max-w-7xl px-6 sm:mt-20 md:mt-24 lg:px-8">
      <dl
        class="mx-auto grid max-w-2xl grid-cols-1 gap-x-6 gap-y-10 text-base leading-7 text-gray-600 sm:grid-cols-2 lg:mx-0 lg:max-w-none lg:grid-cols-3 lg:gap-x-8 lg:gap-y-16">
        <div v-for="feature in features" :key="feature.name" class="relative pl-9">
          <dt class="inline font-semibold text-gray-900">
            <component :is="feature.icon" class="absolute top-1 left-1 h-5 w-5 text-teal-400" aria-hidden="true" />
            {{ feature.name }}
          </dt>
          <dd class="inline">{{ feature.description }}</dd>
        </div>
      </dl>
    </div>
    <div class="relative overflow-hidden pt-16">
      <div class="mx-auto max-w-7xl px-6 lg:px-8">
        <img :src=PracticeReportImage alt="App screenshot" class="mb-[-12%] rounded-xl shadow-2xl ring-1 ring-gray-900/10"
          width="2432" height="1442" />
        <div class="relative" aria-hidden="true">
          <div class="absolute -inset-x-20 bottom-0 bg-gradient-to-t from-white pt-[7%]" />
        </div>
      </div>
    </div>

  </div>
</template>

<script setup>
import {

  ClipboardDocumentListIcon,
  DocumentTextIcon,
  BookOpenIcon,
} from '@heroicons/vue/20/solid'
import PracticeReportImage from '@/assets/images/practice_report.png'

const features = [
  {
    name: '助写实践报告。',
    description: '助您快速搞定实践报告, 仅需几个关键词',
    icon: BookOpenIcon,
  },
  {
    name: '助写班会总结。',
    description: '助您快速搞定班会总结, 仅需几条会议要点',
    icon: DocumentTextIcon,
  },
  {
    name: '助写个人简历。',
    description: '助您快速搞定个人简历, 仅需几项个人信息',
    icon: ClipboardDocumentListIcon,
  },
]
</script>