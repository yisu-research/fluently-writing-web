import { h } from 'vue';
import { Icon } from '@iconify/vue';
import { NIcon } from 'naive-ui';
import SvgIcons from '@/components/icons/SvgIcons.vue';

export function renderIcon(icon, props = { size: 12 }) {
  return () => h(NIcon, props, { default: () => h(Icon, { icon }) });
}

export function renderCustomIcon(icon, props = { size: 12 }) {
  return () => h(NIcon, props, { default: () => h(SvgIcons, { icon }) });
}
