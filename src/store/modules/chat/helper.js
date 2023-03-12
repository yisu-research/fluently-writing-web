import { lStorage } from '@/utils/storage';
// import { useUserStore } from '@/store';

// const userStore = useUserStore();

const LOCAL_NAME = 'chatStorage';

export function defaultState() {
  const name = 'New Chat';
  const id = 1;
  return { active: id, history: [{ id, name: name, isEdit: false }], chat: [{ id, data: [] }] };
}

export function getLocalState() {
  const localState = lStorage.get(LOCAL_NAME);
  return localState ?? defaultState();
}

export function setLocalState(state) {
  lStorage.set(LOCAL_NAME, state);
}
