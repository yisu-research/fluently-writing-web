<template>
  <n-menu
    ref="menu"
    class="side-menu"
    accordion
    :indent="18"
    :collapsed-icon-size="22"
    :collapsed-width="64"
    :options="menuOptions"
    :node-props="nodeProps"
    :value="activeKey"
    @update:value="handleMenuSelect"
  />
</template>

<script setup>
import { ref, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { usePermissionStore, useAppStore, useUserStore } from '@/store';
import { renderCustomIcon, renderIcon, isExternal } from '@/utils';

const router = useRouter();
const curRoute = useRoute();
const permissionStore = usePermissionStore();
const appStore = useAppStore();
const userStore = useUserStore();

const activeKey = computed(() => curRoute.meta?.activeMenu || curRoute.name);

const menuOptions = computed(() => {
  return permissionStore.menus.map((item) => getMenuItem(item)).sort((a, b) => a.order - b.order);
});

const menu = ref(null);
watch(curRoute, async () => {
  await nextTick();
  menu.value?.showOption();
});

function resolvePath(basePath, path) {
  if (isExternal(path)) return path;
  return (
    '/' +
    [basePath, path]
      .filter((path) => !!path && path !== '/')
      .map((path) => path.replace(/(^\/)|(\/$)/g, ''))
      .join('/')
  );
}

function getMenuItem(route, basePath = '') {
  let menuItem = {
    label: route.meta?.title || route.name,
    key: route.name,
    path: resolvePath(basePath, route.path),
    icon: getIcon(route.meta),
    order: route.meta?.order || 0,
  };

  const visibleChildren = route.children ? route.children.filter((item) => item.name && !item.isHidden) : [];

  if (!visibleChildren.length) return menuItem;

  if (visibleChildren.length === 1) {
    // 单个子路由处理
    const singleRoute = visibleChildren[0];
    menuItem = {
      ...menuItem,
      label: singleRoute.meta?.title || singleRoute.name,
      key: singleRoute.name,
      path: resolvePath(menuItem.path, singleRoute.path),
      icon: getIcon(singleRoute.meta),
    };
    const visibleItems = singleRoute.children ? singleRoute.children.filter((item) => item.name && !item.isHidden) : [];

    if (visibleItems.length === 1) {
      menuItem = getMenuItem(visibleItems[0], menuItem.path);
    } else if (visibleItems.length > 1) {
      menuItem.children = visibleItems
        .map((item) => getMenuItem(item, menuItem.path))
        .sort((a, b) => a.order - b.order);
    }
  } else {
    menuItem.children = visibleChildren
      .map((item) => getMenuItem(item, menuItem.path))
      .sort((a, b) => a.order - b.order);
  }
  return menuItem;
}

function getIcon(meta) {
  if (meta?.customIcon) return renderCustomIcon(meta.customIcon, { size: 18 });
  if (meta?.icon) return renderIcon(meta.icon, { size: 18 });
  return null;
}

function nodeProps(option) {
  return {
    class: option.label === '个人中心' && userStore.showBadge ? 'menu-item-active' : '',
  };
}

function handleMenuSelect(key, item) {
  if (isExternal(item.path)) {
    window.open(item.path);
  } else {
    if (item.path === curRoute.path) {
      appStore.reloadPage();
    } else {
      router.push(item.path);
    }
  }
}
</script>

<style lang="scss">
.side-menu:not(.n-menu--collapsed) {
  .n-menu-item-content {
    &::before {
      left: 5px;
      right: 5px;
    }
    &.n-menu-item-content--selected,
    &:hover {
      &::before {
        border-left: 4px solid var(--primary-color);
      }
    }
  }
}

.side-menu {
  .n-menu-item.menu-item-active .n-menu-item-content {
    &::after {
      z-index: auto;
      content: '';
      position: absolute;
      transform: translateY(-50%);
      transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
      top: 50%;
      right: 20px;
      pointer-events: none;
      height: 10px;
      width: 10px;
      border-radius: 10px;
      background: #d03050;
    }
  }
  &.n-menu--collapsed {
    .n-menu-item.menu-item-active .n-menu-item-content {
      &::after {
        transform: none;
        top: 10px;
        right: 16px;
      }
    }
  }
}
</style>
