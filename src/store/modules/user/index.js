import { defineStore } from 'pinia';
import { resetRouter } from '@/router';
import { useTagsStore, usePermissionStore } from '@/store';
import { removeToken, toLogin } from '@/utils';
import api from '@/views/saas/api';

export const useUserStore = defineStore('user', {
  state() {
    return {
      userInfo: {},
    };
  },
  getters: {
    userId() {
      return this.userInfo?.id;
    },
    name() {
      return this.userInfo?.username;
    },
    phone() {
      return this.userInfo?.phone_number;
    },
    avatar() {
      return this.userInfo?.avatar;
    },
    maxTokens() {
      return this.userInfo?.max_tokens;
    },
    role() {
      return this.userInfo?.role || [];
    },
  },
  actions: {
    async getUserInfo() {
      try {
        const res = await api.getUserInfoApi();
        console.log(res);
        const { id, username, phone_number, max_tokens } = res;
        this.userInfo = { id, username, phone_number, max_tokens };
        return Promise.resolve(res.data);
      } catch (error) {
        return Promise.reject(error);
      }
    },
    async logout() {
      const { resetTags } = useTagsStore();
      const { resetPermission } = usePermissionStore();
      removeToken();
      resetTags();
      resetPermission();
      resetRouter();
      this.$reset();
      toLogin();
    },
    setUserInfo(userInfo = {}) {
      this.userInfo = { ...this.userInfo, ...userInfo };
    },
  },
});
