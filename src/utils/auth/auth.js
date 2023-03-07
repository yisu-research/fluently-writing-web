import { router } from '@/router';

export function toLogin() {
  // eslint-disable-next-line no-undef
  const currentRoute = unref(router.currentRoute);
  const needRedirect = !currentRoute.meta.requireAuth && !['/404', '/login'].includes(router.currentRoute.value.path);
  router.replace({
    path: '/login',
    query: needRedirect ? { ...currentRoute.query, redirect: currentRoute.path } : {},
  });
}

export function toFourZeroFour() {
  router.replace({
    path: '/404',
  });
}
