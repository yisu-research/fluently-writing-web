const Layout = () => import('@/layout/index.vue');

export const basicRoutes = [
  {
    name: 'home',
    path: '/',
    isHidden: true,
    component: () => import('@/views/HomeView.vue'),
  },
  // {
  //   name: '404',
  //   path: '/404',
  //   component: () => import('@/views/error-page/404.vue'),
  //   isHidden: true,
  // },

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
    name: 'Creation',
    path: '/saas',
    component: Layout,
    redirect: '/saas/creation',
    children: [
      {
        name: 'Creation',
        path: 'creation',
        component: () => import('@/views/saas/creation/index.vue'),
        meta: {
          title: '新的创作',
          icon: 'mdi:home',
          order: 0,
        },
      },
    ],
  },

  {
    name: 'userCenter',
    path: '/saas',
    component: Layout,
    redirect: 'saas/user-center',
    children: [
      {
        name: 'UserCenter',
        path: 'user-center',
        component: () => import('@/views/saas/user-info/index.vue'),
        meta: {
          title: '个人中心',
          icon: 'mdi:home',
          order: 0,
        },
      },
    ],
  },

  {
    name: 'Cost',
    path: '/saas',
    component: Layout,
    redirect: '/saas/cost',
    children: [
      {
        name: 'Cost',
        path: 'cost',
        component: () => import('@/views/saas/cost/index.vue'),
        meta: {
          title: '费用中心',
          icon: 'mdi:home',
          order: 0,
        },
      },
    ],
  },

  {
    name: '模版',
    path: '/saas/template',
    component: Layout,
    redirect: '/saas/template/template-one',
    children: [
      {
        name: 'TemplateOnw',
        path: 'template-one',
        component: () => import('@/views/saas/templates/template-one/index.vue'),
        meta: {
          title: '模板一',
          icon: 'mdi:home',
          order: 0,
        },
      },
      {
        name: 'TemplateTwo',
        path: 'template-two',
        component: () => import('@/views/saas/templates/template-two/index.vue'),
        meta: {
          title: '模板二',
          icon: 'mdi:home',
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
console.log(modules);
const asyncRoutes = [];
Object.keys(modules).forEach((key) => {
  asyncRoutes.push(modules[key].default);
});
console.log(asyncRoutes);

export { asyncRoutes };
