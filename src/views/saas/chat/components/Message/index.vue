<script setup>
import { ref, onMounted } from 'vue';
import { NDropdown, NCheckbox } from 'naive-ui';
import AvatarComponent from './ChatAvatar.vue';
import TextComponent from './ChatText.vue';
import { copyText } from '@/utils/format';
import { useIconRender } from '@/hooks/useIconRender';
import { useChatStore } from '@/store';

const props = defineProps({
  dateTime: String,
  text: String,
  inversion: Boolean,
  error: Boolean,
  loading: Boolean,
  index: Number,
});

const emit = defineEmits(['regenerate', 'delete', 'handle-box']);

const { iconRender } = useIconRender();

const chatStore = useChatStore();

const textRef = ref();

const id = ref('');

const options = [
  {
    label: '复制',
    key: 'copyText',
    icon: iconRender({ icon: 'ri:file-copy-2-line' }),
  },
  {
    label: '删除',
    key: 'delete',
    icon: iconRender({ icon: 'ri:delete-bin-line' }),
  },
];

function handleSelect(key) {
  switch (key) {
    case 'copyText':
      copyText({ text: props.text ?? '' });
      return;
    case 'delete':
      emit('delete');
  }
}

onMounted(() => {
  id.value = props.index;
});

// function handleRegenerate() {
//   emit('regenerate');
// }
</script>

<template>
  <div :id="id" class="flex items-start justify-start">
    <!-- 选择框 -->
    <NCheckbox v-if="chatStore.isCheck" class="mt-1 mr-2" :value="id" />
    <div class="flex w-full mb-6 overflow-hidden" :class="[{ 'flex-row-reverse': inversion }]">
      <div
        class="flex items-center justify-center flex-shrink-0 h-8 overflow-hidden rounded-full basis-8"
        :class="[inversion ? 'ml-2' : 'mr-2']"
      >
        <AvatarComponent :image="inversion" />
      </div>
      <div class="overflow-hidden text-sm" :class="[inversion ? 'items-end' : 'items-start']">
        <p class="text-xs text-[#b4bbc4]" :class="[inversion ? 'text-right' : 'text-left']">
          {{ props.dateTime }}
        </p>
        <div class="flex items-end gap-1 mt-2" :class="[inversion ? 'flex-row-reverse' : 'flex-row']">
          <TextComponent ref="textRef" :inversion="inversion" :error="error" :text="text" :loading="loading" />
          <div class="flex flex-col">
            <!-- <button
            v-if="!inversion"
            class="mb-2 text-gray-300 transition bg-transparent hover:text-neutral-800"
            @click="handleRegenerate"
          >
            <SvgIcon icon="ri:restart-line" />
          </button> -->
            <NDropdown :placement="!inversion ? 'right' : 'left'" :options="options" @select="handleSelect">
              <button class="transition bg-transparent text-neutral-300 hover:text-neutral-800">
                <SvgIcon icon="ri:more-2-fill" />
              </button>
            </NDropdown>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
