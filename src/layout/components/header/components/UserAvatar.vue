<template>
  <n-dropdown :options="options" @select="handleSelect">
    <div flex items-center cursor-pointer>
      <img :src="userStore.avatar" class="w-8 h-8 mr-4 bg-gray-700 rounded-full" />
      <span>{{ userStore.name }}</span>
    </div>
  </n-dropdown>
</template>

<script setup>
import { useUserStore } from '@/store';
import { renderIcon } from '@/utils';

const userStore = useUserStore();

const options = [
  {
    label: '退出登录',
    key: 'logout',
    icon: renderIcon('mdi:exit-to-app', { size: '14px' }),
  },
];

function handleSelect(key) {
  if (key === 'logout') {
    $dialog.confirm({
      title: '提示',
      type: 'info',
      content: '确认退出？',
      confirm() {
        userStore.logout();
        $message.success('已退出登录');
      },
    });
  }
}
</script>
