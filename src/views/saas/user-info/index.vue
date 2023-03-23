<template>
  <div class="h-full transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <n-layout
      class="h-full p-4"
      :native-scrollbar="false"
      :class="[isMobile ? 'rounded-none shadow-none' : 'border rounded-md shadow-md']"
    >
      <div class="grid grid-cols-12 gap-4">
        <n-card title="账号设置" class="col-span-12 lg:col-span-8 order-2 lg:order-1">
          <div class="setting-item">
            <div>
              <div class="text-base font-bold">邮箱地址</div>
              <div class="text-md">
                <span v-if="user.email">{{ user.email }}</span>
                <span v-else>暂未绑定邮箱（首次绑定可获赠&thinsp;5&thinsp;次创作体验）</span>
              </div>
            </div>
            <n-button type="primary" ghost>{{ true ? '绑定' : '更改' }}</n-button>
          </div>
          <div class="setting-item">
            <div>
              <div class="text-base font-bold">更改密码</div>
              <div class="text-md">密码必须至少为&thinsp;8&thinsp;个字符，最多为&thinsp;32&thinsp;个字符</div>
            </div>
            <n-button type="primary" ghost>更改</n-button>
          </div>
          <div class="font-bold text-slate-500 mt-4">更多功能即将上线，敬请期待！</div>
        </n-card>
        <n-card title="个人简介" class="col-span-12 lg:col-span-4 order-1 lg:order-2">
          <div class="flex flex-col items-center">
            <img class="w-[100px] h-[100px] rounded-full" src="@/assets/avatar.jpg" alt="" />
            <div v-if="user.username" class="font-bold text-2xl mt-2">
              {{ user.username ?? '一粟创作助手' }}
            </div>
          </div>
          <div class="grid grid-cols-2 gap-4 mt-6">
            <div v-if="user.id">
              <div class="text-md font-bold">用户&thinsp;ID</div>
              <div class="text-sm">{{ user.id }}</div>
            </div>
            <div v-if="Number.isFinite(user.balance)">
              <div class="text-md font-bold">剩余次数</div>
              <div class="text-sm">{{ user.balance }}</div>
            </div>
            <div v-if="user.created_at">
              <div class="text-md font-bold">创建日期</div>
              <div class="text-sm">{{ new Date(user.created_at).toLocaleDateString() }}</div>
            </div>
          </div>
          <template #action>
            <div class="text-center">
              <n-popconfirm placement="bottom" @positive-click="handleLogout($event)">
                <template #trigger>
                  <n-button strong secondary type="error">退出登录</n-button>
                </template>
                确认退出登录么？
              </n-popconfirm>
            </div>
          </template>
        </n-card>
        <n-card title="邀请新用户" class="col-span-12 lg:col-span-8 order-3">
          <p>以下是您的邀请码和邀请链接，新用户通过您的邀请码注册并使用时，您将获得相应的奖励！具体方案为：</p>
          <p>
            每成功邀请一位新用户完成注册并绑定邮箱，您和新用户都将<span class="text-teal-600 font-bold"
              >获得&thinsp;10&thinsp;次创作体验！</span
            >
          </p>
          <p>
            当您邀请的新用户首次充值时，您将<span class="text-teal-600 font-bold">获得&thinsp;20%&thinsp;的奖励！</span>
          </p>
          <p>
            例如，新用户首次充值了&thinsp;100&thinsp;元，您将获得&thinsp;20&thinsp;元的奖励，<span
              class="text-teal-600 font-bold"
              >奖励累积到&thinsp;50&thinsp;元即可提现！</span
            >
          </p>
          <p>感谢您的推广与支持，让最先进的&thinsp;AI&thinsp;触达更多的人。</p>
          <div class="mt-4">
            <span>邀请码：</span>
            <span class="ml-1">{{ user.invite_code }}</span>
            <span class="hover:text-teal-500 cursor-pointer" @click="copyToClipboard(user.invite_code)">
              <n-icon class="ml-2 mr-0.5" size="16">
                <icon-ic:baseline-content-copy />
              </n-icon>
              <span>点击以复制邀请码</span>
            </span>
          </div>
          <div>
            <span>邀请链接：</span>
            <span class="ml-1">
              <a :href="inviteLink" target="__blank" class="text-teal-600 hover:underline">
                {{ inviteLink }}
              </a>
              <span class="hover:text-teal-500 cursor-pointer" @click="copyToClipboard(inviteLink)">
                <n-icon class="ml-2 mr-0.5" size="16">
                  <icon-ic:baseline-content-copy />
                </n-icon>
                <span>点击以复制邀请链接</span>
              </span>
            </span>
          </div>
          <template #action>
            <n-button strong secondary>生成邀请码</n-button>
          </template>
        </n-card>
        <n-card title="邀请奖励记录" class="col-span-12 lg:col-span-8 order-4">
          <template #header-extra>
            <n-button strong secondary>奖励提现</n-button>
          </template>
          卡片内容
          <template #footer> #footer </template>
          <template #action> #action </template>
        </n-card>
      </div>

      <!-- <div class="h-full transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <NLayoutContent class="h-full">
          <figure class="p-8 m-4 lg:w-1/2 md:flex md:justify-start bg-slate-100 rounded-xl md:p-0 dark:bg-slate-900">
          
            <div class="pt-1 text-center spa1ce-y-4 md:p-8 md:text-left">
              <figcaption class="font-medium">
                <div class="mb-2 text-teal-500">用户名：{{ userStore.name }}</div>
              </figcaption>
            </div>
          </figure>
          <div class="flex justify-center m-4 lg:w-1/2">
            <n-popconfirm placement="bottom" @positive-click="handleLogout($event)">
              <template #trigger>
                <n-button type="error" dashed block> 退出账号 </n-button>
              </template>
              确定退出?
            </n-popconfirm>
          </div>
        </NLayoutContent>
      </NLayout>
    </div>
  </div> -->
    </n-layout>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useUserStore } from '@/store';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { copyToClipboard } from '@/utils';

const userStore = useUserStore();
const user = computed(() => userStore.userInfo);
const inviteLink = computed(() => `https://zhs.center/auth/register?code=${user.value.invite_code}`);
console.log('userInfo', userStore.userInfo);
console.log('inviteLink', inviteLink);

const { isMobile } = useBasicLayout();

const handleLogout = (event) => {
  event?.stopPropagation();
  userStore.logout();
};
</script>

<style lang="scss">
.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  &:not(:first-of-type) {
    margin-top: 12px;
  }
}
</style>
