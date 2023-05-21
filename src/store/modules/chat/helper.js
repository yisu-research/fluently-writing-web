import { lStorage } from '@/utils/storage';
// import { useUserStore } from '@/store';

// const userStore = useUserStore();

const LOCAL_NAME = 'chatStorage';

export function defaultState() {
  return { active: null, history: [], chat: [], isCheck: false };
}

export function getLocalState() {
  const localState = lStorage.get(LOCAL_NAME);
  return localState ?? defaultState();
}

export function setLocalState(state) {
  lStorage.set(LOCAL_NAME, state);
}

export function clearLocalState() {
  lStorage.remove(LOCAL_NAME);
}
