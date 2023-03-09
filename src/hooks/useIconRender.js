import { h } from 'vue';

export const useIconRender = () => {
  const iconRender = (config) => {
    const { color, fontSize, icon } = config;

    const style = {};

    if (color) style.color = color;

    if (fontSize) style.fontSize = `${fontSize}px`;

    if (!icon) window.console.warn('iconRender: icon is required');

    return () => h(SvgIcon, { icon, style });
  };

  return {
    iconRender,
  };
};
