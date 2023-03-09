import { sStorage } from '@/utils/storage';

const LOCAL_NAME = 'chatStorage';

export function defaultState() {
  const uuid = 1002;
  return { active: uuid, history: [{ uuid, title: 'New Chat', isEdit: false }], chat: [{ uuid, data: [] }] };
}

export function getLocalState() {
  const localState = sStorage.get(LOCAL_NAME);
  return localState ?? defaultState();
}

export function setLocalState(state) {
  sStorage.set(LOCAL_NAME, state);
}
