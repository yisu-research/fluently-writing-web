const Layout = () => import('@/layout/index.vue');
const ChartLayout = () => import('@/views/saas/chat/layout/ChatLayout.vue');

export const basicRoutes = [
  {
    name: 'home',
    path: '/',
    isHidden: true,
    component: () => import('@/views/HomeView.vue'),
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
    name: 'Chat',
    path: '/',
    component: Layout,
    redirect: '/chat',
    children: [
      {
        name: 'Chat',
        path: 'chat',
        component: ChartLayout,
        meta: {
          title: '新的创作',
          icon: 'uil:facebook-messenger-alt',
          order: 0,
        },
        children: [
          {
            name: 'Chat',
            path: ':id',
            isHidden: true,
            component: () => import('@/views/saas/chat/index.vue'),
          },
        ],
      },
    ],
  },

  {
    name: 'UserCenter',
    path: '/',
    component: Layout,
    redirect: '/user-center',
    children: [
      {
        name: 'UserCenter',
        path: 'user-center',
        component: () => import('@/views/saas/user-info/index.vue'),
        meta: {
          title: '个人中心',
          icon: 'uil:user',
          order: 0,
        },
      },
    ],
  },
  // {
  //   name: 'Discovery',
  //   path: '/',
  //   component: Layout,
  //   redirect: '/discovery',
  //   children: [
  //     {
  //       name: 'Discovery',
  //       path: 'discovery',
  //       component: () => import('@/views/saas/discovery/index.vue'),
  //       meta: {
  //         title: '探索发现',
  //         icon: 'uil:compass',
  //         order: 0,
  //       },
  //     },
  //   ],
  // },

  {
    name: 'Cost',
    path: '/',
    component: Layout,
    redirect: '/cost',
    children: [
      {
        name: 'Cost',
        path: 'cost',
        component: () => import('@/views/saas/cost/tokens/index.vue'),
        meta: {
          title: '费用中心',
          icon: 'uil:receipt-alt',
          order: 0,
        },
      },
    ],
  },

  {
    name: 'Help',
    path: '/',
    component: Layout,
    redirect: '/help',
    children: [
      {
        name: 'Help',
        path: 'help',
        component: () => import('@/views/saas/help/index.vue'),
        meta: {
          title: '模板中心',
          icon: 'uil:comment-image',
          order: 0,
        },
      },
    ],
  },

  // {
  //   name: 'Intro',
  //   path: '/',
  //   component: Layout,
  //   redirect: '/intro',
  //   children: [
  //     {
  //       name: 'Intro',
  //       path: 'intro',
  //       component: () => import('@/views/saas/intro/index.vue'),
  //       meta: {
  //         title: '系统说明',
  //         icon: 'uil:book-reader',
  //         order: 0,
  //       },
  //     },
  //   ],
  // },

  {
    name: 'Mobile',
    path: '/',
    component: Layout,
    redirect: '/mobile',
    children: [
      {
        name: 'Mobile',
        path: 'mobile',
        component: () => import('@/views/saas/mobile/index.vue'),
        meta: {
          title: '手机访问',
          icon: 'uil:mobile-vibrate',
          order: 0,
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
