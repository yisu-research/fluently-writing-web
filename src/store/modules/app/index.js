import { defineStore } from 'pinia';
// import { useDark } from '@vueuse/core';

// wsf - 目前界面强制浅色模式
// const isDark = useDark();
const isDark = false;
export const useAppStore = defineStore('app', {
  state() {
    return {
      reloadFlag: true,
      collapsed: false,
      /** keepAlive路由的key，重新赋值可重置keepAlive */
      aliveKeys: {},
      isDark,
      siderCollapsed: false,
      isChat: true,
      isSignup: false,
      isEmailReminded: false,
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

    setIsSignup(value) {
      this.isSignup = value;
    },

    setChat(isChat) {
      this.isChat = isChat;
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
    /* 设置暗黑模式 */
    setDark(isDark) {
      this.isDark = isDark;
    },
    /* 切换/关闭 暗黑模式 */
    toggleDark() {
      this.isDark = !this.isDark;
    },
    /* 设置邮箱绑定提醒 */
    setEmailReminded(isReminded) {
      this.isEmailReminded = isReminded;
    },
  },
});
