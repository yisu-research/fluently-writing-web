import { useChatStore } from '@/store';

export function useChat() {
  const chatStore = useChatStore();

  const getChatByUuidAndIndex = (id, index) => {
    return chatStore.getChatByUuidAndIndex(id, index);
  };

  const addChat = (id, chat) => {
    chatStore.addChatByUuid(id, chat);
  };

  const updateChat = (id, index, chat) => {
    chatStore.updateChatByUuid(id, index, chat);
  };

  const updateChatSome = (id, index, chat) => {
    chatStore.updateChatSomeByUuid(id, index, chat);
  };

  return {
    addChat,
    updateChat,
    updateChatSome,
    getChatByUuidAndIndex,
  };
}
