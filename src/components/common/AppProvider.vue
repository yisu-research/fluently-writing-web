<template>
  <n-config-provider
    wh-full
    :locale="zhCN"
    :date-locale="dateZhCN"
    :theme="lightTheme"
    :theme-overrides="naiveThemeOverrides"
    preflight-style-disabled
  >
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-notification-provider>
          <n-message-provider>
            <slot></slot>
            <NaiveProviderContent />
          </n-message-provider>
        </n-notification-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

<script setup>
import { defineComponent, h } from 'vue';
import { zhCN, dateZhCN, lightTheme, useLoadingBar, useDialog, useMessage, useNotification } from 'naive-ui';
import { useCssVar } from '@vueuse/core';
import { kebabCase } from 'lodash-es';
import { naiveThemeOverrides } from '~/settings';
// import { useAppStore } from '@/store';

// wsf - 目前界面强制浅色模式
// const appStore = useAppStore();

function setupCssVar() {
  const common = naiveThemeOverrides.common;
  for (const key in common) {
    if (!Object.hasOwn(common, key)) continue;
    useCssVar(`--${kebabCase(key)}`, document.documentElement).value = common[key] || '';
    if (key === 'primaryColor') window.localStorage.setItem('__THEME_COLOR__', common[key] || '');
  }
}

// 挂载naive组件的方法至window, 以便在全局使用
function setupNaiveTools() {
  window.$loadingBar = useLoadingBar();
  window.$dialog = useDialog();
  window.$message = useMessage();
  window.$notification = useNotification();
}

const NaiveProviderContent = defineComponent({
  setup() {
    setupCssVar();
    setupNaiveTools();
  },
  render() {
    return h('div');
  },
});
</script>
