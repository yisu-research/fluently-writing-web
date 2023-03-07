const Layout = () => import('@/layout/index.vue');

export const basicRoutes = [
  {
    name: 'home',
    path: '/',
    component: () => import('@/views/HomeView.vue'),
  },
  {
    name: '404',
    path: '/404',
    component: () => import('@/views/error-page/404.vue'),
    isHidden: true,
  },

  {
    name: 'Login',
    path: '/login',
    component: () => import('@/views/saas/LoginView.vue'),
    isHidden: true,
    meta: {
      title: '登录页',
    },
  },
  {
    name: 'Signup',
    path: '/signup',
    component: () => import('@/views/saas/SignupView.vue'),
    isHidden: true,
    meta: {
      title: '注册页',
    },
  },

  {
    name: 'ExternalLink',
    path: '/external-link',
    component: Layout,
    meta: {
      title: '外部链接',
      icon: 'mdi:link-variant',
      order: 4,
    },
    children: [
      {
        name: 'LinkGithubSrc',
        path: 'https://github.com/zclzone/vue-naive-admin',
        meta: {
          title: '源码 - github',
          icon: 'mdi:github',
        },
      },
      {
        name: 'LinkGiteeSrc',
        path: 'https://gitee.com/zclzone/vue-naive-admin',
        meta: {
          title: '源码 - gitee',
          icon: 'simple-icons:gitee',
        },
      },
      {
        name: 'LinkDocs',
        path: 'https://zclzone.github.io/vue-naive-admin-docs',
        meta: {
          title: '文档 - vuepress',
          icon: 'mdi:vuejs',
        },
      },
    ],
  },
];

export const NOT_FOUND_ROUTE = {
  name: 'NotFound',
  path: '/:pathMatch(.*)*',
  redirect: '/404',
  isHidden: true,
};

export const EMPTY_ROUTE = {
  name: 'Empty',
  path: '/:pathMatch(.*)*',
  component: null,
};

const modules = import.meta.glob('@/views/**/route.js', { eager: true });
const asyncRoutes = [];
Object.keys(modules).forEach((key) => {
  asyncRoutes.push(modules[key].default);
});

export { asyncRoutes };
