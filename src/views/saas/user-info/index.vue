<!-- eslint-disable vue/no-duplicate-attributes -->
<template>
  <div class="h-full transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <NLayoutContent class="h-full">
          <figure class="p-8 m-4 md:flex md:justify-start bg-slate-100 rounded-xl md:p-0 dark:bg-slate-800">
            <img
              class="w-24 h-24 mx-auto rounded-full md:mx-0 md:w-30 md:h-auto md:rounded-r-none md:rounded-l-xl"
              src="@/assets/avatar.jpg"
              alt=""
            />
            <div class="pt-1 text-center spa1ce-y-4 md:p-8 md:text-left">
              <figcaption class="font-medium">
                <div class="mb-2 text-teal-500">用户名：{{ userStore.name }}</div>
                <div class="text-slate-700 dark:text-slate-500">手机号：{{ userStore.phone }}</div>
              </figcaption>
            </div>
          </figure>
        </NLayoutContent>
      </NLayout>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { NLayout, NLayoutContent } from 'naive-ui';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { useUserStore } from '@/store';

const userStore = useUserStore();

const { isMobile } = useBasicLayout();

const getMobileClass = computed(() => {
  if (isMobile.value) return ['rounded-none', 'shadow-none'];
  return ['border', 'rounded-md', 'shadow-md'];
});

const getContainerClass = computed(() => {
  return ['h-full'];
});
</script>
