import { useAppStore } from '@/store';

export function createPageLoadingGuard(router) {
  const appStore = useAppStore();

  router.beforeEach((to, from) => {
    window.$loadingBar?.start();

    if (from.name === 'Signup') {
      console.log('from signup before');
      appStore.setIsSignup(true);
    }
  });

  router.afterEach((to, from) => {
    setTimeout(() => {
      window.$loadingBar?.finish();
      if (to.name === 'Chat') {
        appStore.setChat(true);
      } else {
        appStore.setChat(false);
      }

      if (from.name === 'Signup') {
        console.log('from signup after');
        appStore.setIsSignup(true);
      }
    }, 200);
  });

  router.onError(() => {
    window.$loadingBar?.error();
  });
}
