import { defineStore } from 'pinia';
import { resetRouter } from '@/router';
import { removeToken, toLogin } from '@/utils';
import api from '@/views/saas/api';
import { clearLocalState } from '@/store/modules/chat/helper';

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: { username: '一粟创作助手', phone_number: '激发灵感，提高效率', balance: 0, id: 0, isLogin: false },
    };
  },
  getters: {
    userId() {
      return this.userInfo?.id;
    },
    name() {
      return this.userInfo?.username;
    },
    avatar() {
      return this.userInfo?.avatar;
    },
    balance() {
      return this.userInfo?.balance;
    },
    isLogin() {
      return this.userInfo?.isLogin;
    },
  },
  actions: {
    async getUserInfo() {
      try {
        const res = await api.getUserInfoApi();
        const { id, username, balance, created_at } = res;
        this.userInfo = { id, username, balance, created_at, isLogin: true };
        return Promise.resolve(res.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async logout() {
      removeToken();
      resetRouter();
      clearLocalState();
      this.$reset();
      toLogin();
    },

    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo };
    },
  },
});
