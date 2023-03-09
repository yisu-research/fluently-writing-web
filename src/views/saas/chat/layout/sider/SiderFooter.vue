<script setup lang="js">
import { defineAsyncComponent, ref } from 'vue';
// import { HoverButton, UserAvatar } from '@/components/common';
// import SvgIcon  from '@/components/common/SvgIcon/index.vue'
// import HoverButton from '@/components/common/HoverButton/index.vue'


const Setting = defineAsyncComponent(() => import('@/components/common/Setting/index.vue'));

const show = ref(false);
</script>

<template>
  <footer class="flex items-center justify-between min-w-0 p-4 overflow-hidden border-t">
    <!-- <UserAvatar /> -->

    <!-- <HoverButton :tooltip="$t('setting.setting')" @click="show = true">
      <span class="text-xl text-[#4f555e] dark:text-white">
        <SvgIcon icon="ri:settings-4-line" />
      </span>
    </HoverButton> -->

    <Setting v-if="show" v-model:visible="show" />
  </footer>
</template>
