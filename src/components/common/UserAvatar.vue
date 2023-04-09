<template>
  <div>
    <n-avatar v-if="isImage" :src="userAvatar" :style="[customStyle]" @error="onImgError"></n-avatar>
    <n-avatar v-else :style="[customStyle]">{{ userInitials }}</n-avatar>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/store';

const props = defineProps({
  background: {
    type: String,
  },
  color: {
    type: String,
  },
  size: {
    type: Number,
    default: 50,
  },
  rounded: {
    type: Boolean,
    default: true,
  },
  lighten: {
    type: Number,
    default: 80,
  },
});

const userStore = useUserStore();
const userName = computed(() => userStore.userInfo.username);
const userAvatar = computed(() => userStore.userInfo.avatar);
const userInitials = computed(() => getInitials(userName.value));
const getInitials = (username) => {
  let parts = username.split(/[ -]/);
  let initials = '';

  for (let i = 0; i < parts.length; i++) {
    initials += parts[i].charAt(0);
  }

  if (initials.length > 3 && initials.search(/[A-Z]/) !== -1) {
    initials = initials.replace(/[a-z]+/g, '');
  }

  initials = initials.slice(0, 3).toUpperCase();

  return initials;
};

const imgError = ref(false);
const onImgError = () => {
  imgError.value = true;
};
const isImage = computed(() => !imgError.value && Boolean(userAvatar.value));

const backgroundColors = [
  '#F44336',
  '#FF4081',
  '#9C27B0',
  '#673AB7',
  '#3F51B5',
  '#2196F3',
  '#03A9F4',
  '#00BCD4',
  '#009688',
  '#4CAF50',
  '#8BC34A',
  '#CDDC39',
  '#FFC107',
  '#FF9800',
  '#FF5722',
  '#795548',
  '#9E9E9E',
  '#607D8B',
];
const backgroundColor = computed(
  () => props.background || randomBackgroundColor(userName.value.length, backgroundColors),
);
const randomBackgroundColor = (seed, colors) => {
  return colors[seed % colors.length];
};

const fontColor = computed(() => props.color || LightenDarkenColor(backgroundColor, props.lighten));
const LightenDarkenColor = (clr, amount) => {
  let color = clr;
  let usePound = false;

  if (color[0] === '#') {
    color = color.slice(1);
    usePound = true;
  }

  let num = parseInt(color, 16);

  let r = (num >> 16) + amount;

  if (r > 255) r = 255;
  else if (r < 0) r = 0;

  let b = ((num >> 8) & 0x00ff) + amount;

  if (b > 255) b = 255;
  else if (b < 0) b = 0;

  let g = (num & 0x0000ff) + amount;

  if (g > 255) g = 255;
  else if (g < 0) g = 0;

  return (usePound ? '#' : '') + (g | (b << 8) | (r << 16)).toString(16);
};

const customStyle = computed(() => {
  const style = {
    display: 'flex',
    width: `${props.size}px`,
    height: `${props.size}px`,
    borderRadius: props.rounded ? '50%' : 0,
    lineHeight: `${props.size + Math.floor(props.size / 20)}px`,
    fontWeight: 'bold',
    alignItems: 'center',
    justifyContent: 'center',
    textAlign: 'center',
    userSelect: 'none',
  };

  const imgBackgroundAndFontStyle = {
    background: `transparent url('${userAvatar.value}') no-repeat scroll 0% 0% / ${props.size}px ${props.size}px content-box border-box`,
  };

  const initialBackgroundAndFontStyle = {
    backgroundColor: backgroundColor.value,
    font: `${Math.floor(props.size / 2.5)}px/${props.size}px Helvetica, Arial, sans-serif`,
    color: fontColor.value,
  };

  const backgroundAndFontStyle = isImage.value ? imgBackgroundAndFontStyle : initialBackgroundAndFontStyle;

  Object.assign(style, backgroundAndFontStyle);

  return style;
});
</script>

<style>
.n-tag__close {
  box-sizing: content-box;
  border-radius: 50%;
  font-size: 12px;
  padding: 2px;
  transform: scale(0.9);
  transform: translateX(5px);
  transition: all 0.3s;
}
</style>
