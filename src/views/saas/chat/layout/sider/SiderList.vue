<script setup>
import { useAppStore, useChatStore } from '@/store';
import { useBasicLayout } from '@/hooks/useBasicLayout';

const appStore = useAppStore();
const chatStore = useChatStore();

const { isMobile } = useBasicLayout();

const dataSources = computed(() => chatStore.history);
async function handleSelect({ uuid }) {
  if (isActive(uuid)) return;

  if (chatStore.active) chatStore.updateHistory(chatStore.active, { isEdit: false });
  await chatStore.setActive(uuid);

  if (isMobile.value) appStore.setSiderCollapsed(true);
}

function handleEdit({ uuid }, isEdit, event) {
  event?.stopPropagation();
  chatStore.updateHistory(uuid, { isEdit });
}

function handleDelete(index, event) {
  event?.stopPropagation();
  chatStore.deleteHistory(index);
}

function handleEnter({ uuid }, isEdit, event) {
  event?.stopPropagation();
  if (event.key === 'Enter') chatStore.updateHistory(uuid, { isEdit });
}

function isActive(uuid) {
  return chatStore.active === uuid;
}
</script>

<template>
  <!-- eslint-disable vue/no-duplicate-attributes -->
  <n-scrollbar class="px-4">
    <div class="flex flex-col h-20 gap-2 text-sm">
      <template v-if="!dataSources.length">
        <div class="flex flex-col items-center mt-4 text-center text-neutral-300">
          <SvgIcon icon="ri:inbox-line" class="mb-2 text-3xl" />
          <span>暂无对话</span>
        </div>
      </template>
      <template v-else>
        <div v-for="(item, index) of dataSources" :key="index">
          <a
            class="relative flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:text-teal-4 hover:border-teal-3 hover:bg-teal-50 group"
            :class="isActive(item.uuid) && ['border-teal-300', 'bg-teal-50', 'text-teal-500', 'pr-14']"
            @click="handleSelect(item)"
          >
            <span>
              <SvgIcon icon="uil:comment-verify" />
            </span>
            <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
              <n-input
                v-if="item.isEdit"
                v-model:value="item.title"
                size="tiny"
                @keypress="handleEnter(item, false, $event)"
              />
              <span v-else>{{ item.title }}</span>
            </div>
            <div v-if="isActive(item.uuid)" class="absolute z-10 flex visible right-1">
              <template v-if="item.isEdit">
                <button class="p-1 bg-transparent" @click="handleEdit(item, false, $event)">
                  <SvgIcon icon="ri:save-line" />
                </button>
              </template>
              <template v-else>
                <button class="p-1 bg-transparent">
                  <SvgIcon icon="uil:comment-edit" @click="handleEdit(item, true, $event)" />
                </button>
                <n-popconfirm placement="bottom" @positive-click="handleDelete(index, $event)">
                  <template #trigger>
                    <button class="p-1 bg-transparent">
                      <SvgIcon icon="uil:multiply" />
                    </button>
                  </template>
                  确定删除此记录?
                </n-popconfirm>
              </template>
            </div>
          </a>
        </div>
      </template>
    </div>
  </n-scrollbar>
</template>
