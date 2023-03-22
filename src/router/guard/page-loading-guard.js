import { useAppStore } from '@/store';

export function createPageLoadingGuard(router) {
  const appStore = useAppStore();

  router.beforeEach((to, from) => {
    window.$loadingBar?.start();
  });

  router.afterEach((to) => {
    setTimeout(() => {
      window.$loadingBar?.finish();
      console.log(to.name);
      if (to.name === 'Chat') {
        appStore.setChat(true);
      } else {
        appStore.setChat(false);
      }
      console.log('appStore', appStore.isChat);
    }, 200);
  });

  router.onError(() => {
    window.$loadingBar?.error();
  });
}
