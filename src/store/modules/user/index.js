import { defineStore } from 'pinia';
import { resetRouter } from '@/router';
import { removeToken, toLogin, lStorage } from '@/utils';
import api from '@/views/saas/api';
import { clearLocalState } from '@/store/modules/chat/helper';

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: {
        username: '一粟创作助手',
        balance: 0,
        id: 0,
        email: null,
        avatar: null,
        isLogin: false,
        invite_code: null,
        invitation_count: {
          invitee_count: 3,
          total_income: 3,
          call_count: 3,
          withdraw: 3,
          balance: 3,
        },
      },
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
        this.userInfo = { ...res, isLogin: true };

        const AVATAR_NAME = 'userAvatar';
        const userAvatar = lStorage.get(AVATAR_NAME);
        if (userAvatar) {
          this.userInfo.avatar = userAvatar[this.userInfo.id];
        }

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
    setUserInfo(info = {}) {
      this.userInfo = { ...this.userInfo, ...info };
    },
  },
});
