export function createPageLoadingGuard(router) {
  router.beforeEach((to, from) => {
    window.$loadingBar?.start();
  });

  router.afterEach(() => {
    setTimeout(() => {
      window.$loadingBar?.finish();
    }, 200);
  });

  router.onError(() => {
    window.$loadingBar?.error();
  });
}
