<script setup>
import { useAppStore, useChatStore } from '@/store';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import api from '@/views/saas/api';
import { onMounted } from 'vue';
import { router } from '@/router';

const appStore = useAppStore();
const chatStore = useChatStore();

const { isMobile } = useBasicLayout();

// 获取对话列表
const dataSources = computed(() => chatStore.history);

// 处理选择对话
async function handleSelect({ id }) {
  console.log(id);
  if (isActive(id)) return;

  if (chatStore.active) chatStore.updateHistory(chatStore.active, { isEdit: false });
  await chatStore.setActive(id);

  if (isMobile.value) appStore.setSiderCollapsed(true);
}

onMounted(async () => {
  if (!chatStore.active && dataSources.value.length) {
    await chatStore.setActive(dataSources.value[0].id);
    if (chatStore.active) chatStore.updateHistory(chatStore.active, { isEdit: false });
  }
  await router.push({ path: `/chat/${chatStore.active}` });
});

async function handleEdit({ id, name }, isEdit, event) {
  event?.stopPropagation();

  try {
    if (!isEdit) await api.updateChatApi(id, { name: name });
  } catch (err) {
    console.error(err);
    $message.success('保存失败，请重试');
  }
  chatStore.updateHistory(id, { isEdit });
}

function handleDelete(index, event) {
  event?.stopPropagation();
  chatStore.deleteHistory(index);
}

function handleEnter({ id }, isEdit, event) {
  event?.stopPropagation();
  if (event.key === 'Enter') chatStore.updateHistory(id, { isEdit });
}

function isActive(id) {
  return chatStore.active === id;
}
</script>

<template>
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
          <div
            class="relative z-50 flex items-center gap-3 px-3 py-3 break-all border rounded-md cursor-pointer hover:text-teal-500 hover:border-teal-500 hover:scale-98 hover:shadow-md group"
            :class="isActive(item.id) && ['border-teal-500', 'bg-teal-50/[0.4]', 'text-teal-500', 'pr-14']"
            @click="handleSelect(item)"
          >
            <span>
              <SvgIcon icon="uil:comment-dots" />
            </span>
            <div class="relative flex-1 overflow-hidden break-all text-ellipsis whitespace-nowrap">
              <n-input
                v-if="item.isEdit"
                v-model:value="item.name"
                size="tiny"
                @keypress="handleEnter(item, false, $event)"
              />
              <span v-else>{{ item.name }}</span>
            </div>
            <div v-if="isActive(item.id)" class="absolute z-10 flex visible right-1">
              <template v-if="item.isEdit">
                <button class="p-1 bg-transparent" @click="handleEdit(item, false, $event)">
                  <SvgIcon icon="uil:save" />
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
          </div>
        </div>
      </template>
    </div>
  </n-scrollbar>
</template>
