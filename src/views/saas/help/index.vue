<!-- eslint-disable vue/no-duplicate-attributes -->
<template>
  <div class="h-full transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <NLayoutContent class="h-full"> 帮助中心 </NLayoutContent>
      </NLayout>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { NLayout, NLayoutContent } from 'naive-ui';
import { useBasicLayout } from '@/hooks/useBasicLayout';

const { isMobile } = useBasicLayout();

const getMobileClass = computed(() => {
  if (isMobile.value) return ['rounded-none', 'shadow-none'];
  return ['border', 'rounded-md', 'shadow-md'];
});

const getContainerClass = computed(() => {
  return ['h-full'];
});
</script>
