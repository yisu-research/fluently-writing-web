import { defineStore } from 'pinia';
import { getLocalState, setLocalState } from './helper';
import { router } from '@/router';
import api from '@/views/saas/api';

export const useChatStore = defineStore('chat-store', {
  state: () => getLocalState(),

  getters: {
    getChatHistoryByCurrentActive(state) {
      const index = state.history.findIndex((item) => item.id === state.active);
      if (index !== -1) return state.history[index];
      return null;
    },

    getChatById(state) {
      return (id) => {
        console.log('chat');
        console.log(state.chat);
        if (id) return state.chat.find((item) => item.id === id)?.data ?? [];
        return state.chat.find((item) => item.id === state.active)?.data ?? [];
      };
    },
  },

  actions: {
    // 获取服务端对话列表
    async getChatList() {
      try {
        const res = await api.getChatListApi();
        this.history = [];
        for (const item of res) {
          const { id, name } = item;
          this.history.unshift({ id, name, isEdit: false });
        }
        return Promise.resolve(res);
      } catch (error) {
        return Promise.reject(error);
      }
    },

    // 添加对话
    addHistory(history, chatData = []) {
      this.history.unshift(history);
      this.chat.unshift({ id: history.id, data: chatData });
      this.active = history.id;
      this.reloadRoute(history.id);
    },

    // 更新对话
    async updateHistory(id, edit) {
      const index = this.history.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.history[index] = { ...this.history[index], ...edit };
        this.recordState();
      }
    },

    async deleteHistory(index) {
      const name = this.history[index].name;
      try {
        await api.deleteChatApi(this.history[index].id);
      } catch (err) {
        console.log(err);
        $message.error('删除失败, 请重试');
        return;
      }
      this.history.splice(index, 1);
      this.chat.splice(index, 1);

      if (this.history.length === 0) {
        this.active = null;
        this.reloadRoute();
        $message.success(`对话 --${name}-- 已删除`);
        return;
      }

      if (index > 0 && index <= this.history.length) {
        const id = this.history[index - 1].id;
        this.active = id;
        $message.success(`对话 --${name}-- 已删除`);
        this.reloadRoute(id);
        return;
      }

      if (index === 0) {
        if (this.history.length > 0) {
          const id = this.history[0].id;
          this.active = id;
          $message.success(`对话 --${name}-- 已删除`);
          this.reloadRoute(id);
          return;
        }
      }

      if (index > this.history.length) {
        const id = this.history[this.history.length - 1].id;
        this.active = id;
        $message.success(`对话 --${name}-- 已删除`);
        this.reloadRoute(id);
      }
    },

    async setActive(name) {
      this.active = name;
      return await this.reloadRoute(name);
    },

    getChatByUuidAndIndex(id, index) {
      if (!id || id === 0) {
        if (this.chat.length) return this.chat[0].data[index];
        return null;
      }
      const chatIndex = this.chat.findIndex((item) => item.id === id);
      if (chatIndex !== -1) return this.chat[chatIndex].data[index];
      return null;
    },

    addChatByUuid(id, chat) {
      if (!id || id === 0) {
        if (this.history.length === 0) {
          const id = Date.now();
          this.history.push({ id, name: chat.text, isEdit: false });
          this.chat.push({ id, data: [chat] });
          this.active = id;
          this.recordState();
        } else {
          this.chat[0].data.push(chat);
          if (this.history[0].name === 'New Chat') this.history[0].name = chat.text;
          this.recordState();
        }
      }

      const index = this.chat.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.chat[index].data.push(chat);
        if (this.history[index].name === 'New Chat') this.history[index].name = chat.text;
        this.recordState();
      }
    },

    updateChatByUuid(id, index, chat) {
      if (!id || id === 0) {
        if (this.chat.length) {
          this.chat[0].data[index] = chat;
          this.recordState();
        }
        return;
      }

      const chatIndex = this.chat.findIndex((item) => item.id === id);
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = chat;
        this.recordState();
      }
    },

    updateChatSomeByUuid(id, index, chat) {
      if (!id || id === 0) {
        if (this.chat.length) {
          this.chat[0].data[index] = { ...this.chat[0].data[index], ...chat };
          this.recordState();
        }
        return;
      }

      const chatIndex = this.chat.findIndex((item) => item.id === id);
      if (chatIndex !== -1) {
        this.chat[chatIndex].data[index] = { ...this.chat[chatIndex].data[index], ...chat };
        this.recordState();
      }
    },

    deleteChatByUuid(id, index) {
      if (!id || id === 0) {
        if (this.chat.length) {
          this.chat[0].data.splice(index, 1);
          this.recordState();
        }
        return;
      }

      const chatIndex = this.chat.findIndex((item) => item.id === id);
      if (chatIndex !== -1) {
        this.chat[chatIndex].data.splice(index, 1);
        this.recordState();
      }
    },

    clearChatByUuid(id) {
      if (!id || id === 0) {
        if (this.chat.length) {
          this.chat[0].data = [];
          this.recordState();
        }
        return;
      }

      const index = this.chat.findIndex((item) => item.id === id);
      if (index !== -1) {
        this.chat[index].data = [];
        this.recordState();
      }
    },

    async reloadRoute(id) {
      this.recordState();
      if (!id) {
        await router.push({ name: 'Chat' });
      } else {
        await router.push({ path: `/saas/chat/${id}` });
      }
    },

    recordState() {
      setLocalState(this.$state);
    },
  },
});
