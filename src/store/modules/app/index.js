import { defineStore } from 'pinia';
import { useDark } from '@vueuse/core';

const isDark = useDark();
export const useAppStore = defineStore('app', {
  state() {
    return {
      reloadFlag: true,
      collapsed: false,
      /** keepAlive路由的key，重新赋值可重置keepAlive */
      aliveKeys: {},
      isDark,
      siderCollapsed: false,
    };
  },
  actions: {
    async reloadPage() {
      // eslint-disable-next-line no-undef
      $loadingBar.start();
      this.reloadFlag = false;
      // eslint-disable-next-line no-undef
      await nextTick();
      this.reloadFlag = true;

      setTimeout(() => {
        document.documentElement.scrollTo({ left: 0, top: 0 });
        // eslint-disable-next-line no-undef
        $loadingBar.finish();
      }, 100);
    },
    switchCollapsed() {
      this.collapsed = !this.collapsed;
    },
    setCollapsed(collapsed) {
      this.collapsed = collapsed;
    },
    setSiderCollapsed(collapsed) {
      this.siderCollapsed = collapsed;
    },
    setAliveKeys(key, val) {
      this.aliveKeys[key] = val;
    },
    /** 设置暗黑模式 */
    setDark(isDark) {
      this.isDark = isDark;
    },
    /** 切换/关闭 暗黑模式 */
    toggleDark() {
      this.isDark = !this.isDark;
    },
  },
});