<script setup>
import LogoSVG from '@/assets/svg/logo.svg';
import UserAvatar from '@/components/common/UserAvatar.vue';

const props = defineProps({
  image: Boolean,
});
</script>

<template>
  <div>
    <span v-if="props.image">
      <user-avatar :size="32" />
    </span>
    <span v-else>
      <img :src="LogoSVG" alt="Logo" width="32" height="32" />
    </span>
  </div>
</template>
