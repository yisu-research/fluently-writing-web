import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';
import { setupRouterGuard } from './guard';
import { basicRoutes, EMPTY_ROUTE } from './routes';
import { getToken, isNullOrWhitespace } from '@/utils';
import { useUserStore } from '@/store';
import { useChatStore } from '../store/modules/chat';

const isHash = import.meta.env.VITE_USE_HASH === 'true';

export const router = createRouter({
  history: isHash ? createWebHashHistory('/') : createWebHistory('/'),
  routes: basicRoutes,
  scrollBehavior: () => ({ left: 0, top: 0 }),
});

export async function setupRouter(app) {
  await addDynamicRoutes();
  setupRouterGuard(router);
  app.use(router);
}

export async function resetRouter() {
  const basicRouteNames = getRouteNames(basicRoutes);
  router.getRoutes().forEach((route) => {
    const name = route.name;
    if (!basicRouteNames.includes(name)) {
      router.removeRoute(name);
    }
  });
}

export async function addDynamicRoutes() {
  // 查看本地token
  const token = getToken();

  // 没有token情况
  if (isNullOrWhitespace(token)) {
    // 加载静态路由
    router.addRoute(EMPTY_ROUTE);
    return;
  }

  // 有token的情况
  try {
    const userStore = useUserStore();
    // 获取用户信息
    !userStore.userId && (await userStore.getUserInfo());
    const charStore = useChatStore();
    await charStore.getChatList();
    router.addRoute(EMPTY_ROUTE);
  } catch (error) {
    console.error(error);
  }
}

export function getRouteNames(routes) {
  return routes.map((route) => getRouteName(route)).flat(1);
}

function getRouteName(route) {
  const names = [route.name];
  if (route.children && route.children.length) {
    names.push(...route.children.map((item) => getRouteName(item)).flat(1));
  }
  return names;
}
