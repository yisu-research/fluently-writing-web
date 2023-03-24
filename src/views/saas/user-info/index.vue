<template>
  <div class="h-full transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <n-layout
      class="h-full p-4"
      :native-scrollbar="false"
      :class="[isMobile ? 'rounded-none shadow-none' : 'border rounded-md shadow-md']"
    >
      <div class="grid grid-cols-12 gap-4">
        <n-card v-if="false" title="账号设置" class="col-span-12 lg:col-span-8 order-2 lg:order-1">
          <div class="setting-item">
            <div>
              <div class="text-base font-bold">邮箱地址</div>
              <div class="text-md">
                <span v-if="user.email">{{ user.email }}</span>
                <span v-else>暂未绑定邮箱（首次绑定可获赠&thinsp;5&thinsp;次创作体验）</span>
              </div>
            </div>
            <n-button type="primary" ghost @click="showEmailModal = true">{{ user.email ? '更改' : '绑定' }}</n-button>
          </div>
          <div class="setting-item">
            <div>
              <div class="text-base font-bold">更改密码</div>
              <div class="text-md">密码必须至少为&thinsp;8&thinsp;个字符，最多为&thinsp;32&thinsp;个字符</div>
            </div>
            <n-button type="primary" ghost @click="showPasswordModal = true">更改</n-button>
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
            <div v-if="Number.isFinite(user.balance)">
              <div class="text-md font-bold">剩余次数</div>
              <div class="text-sm">{{ user.balance.toLocaleString() }}</div>
            </div>
            <div v-if="user.created_at">
              <div class="text-md font-bold">创建日期</div>
              <div class="text-sm">{{ new Date(user.created_at).toLocaleDateString() }}</div>
            </div>
            <div v-if="Number.isFinite(user.invitation_count?.invitee_count)">
              <div class="text-md font-bold">邀请人数</div>
              <div class="text-sm">{{ user.invitation_count.invitee_count }}</div>
            </div>
            <div v-if="Number.isFinite(user.invitation_count?.total_income)">
              <div class="text-md font-bold">邀请奖励</div>
              <div class="text-sm">{{ user.invitation_count.total_income }}</div>
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
        <n-card title="邀请新用户" class="col-span-12 lg:col-span-8 order-2 lg:order-1">
          <p>以下是您的邀请码和邀请链接，新用户通过您的邀请码注册并使用时，您将获得相应的奖励！具体方案为：</p>
          <p>
            每成功邀请一位新用户完成注册并绑定邮箱，您和新用户都将<span class="text-teal-600 font-bold"
              >获得&thinsp;10&thinsp;次创作体验！</span
            >
          </p>
          <p>
            当您邀请的新用户首次充值时，您将<span class="text-teal-600 font-bold"
              >获得&thinsp;20%&thinsp;的现金奖励！</span
            >
          </p>
          <p>
            例如，新用户首次充值了&thinsp;100&thinsp;元，您将获得&thinsp;20&thinsp;元的现金奖励。<span
              class="text-teal-600 font-bold"
              >现金奖励累积到&thinsp;50&thinsp;元即可提现！</span
            >
          </p>
          <p>感谢您的推广与支持，让最先进的&thinsp;AI&thinsp;触达更多的人。</p>
          <div class="mt-4">
            <span>邀请码：</span>
            <span v-if="user.invite_code" class="ml-1">
              <span>{{ user.invite_code }}</span>
              <span
                v-if="user.invite_code"
                class="hover:text-teal-500 cursor-pointer"
                @click="copyToClipboard(user.invite_code)"
              >
                <n-icon class="ml-2 mr-0.5" size="16">
                  <icon-ic:baseline-content-copy />
                </n-icon>
                <span>点击以复制邀请码</span>
              </span>
            </span>
            <span v-else>点击<span class="underline font-bold">下方按钮</span>以生成邀请码</span>
          </div>
          <div>
            <span>邀请链接：</span>
            <span v-if="user.invite_code" class="ml-1">
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
            <span v-else>点击<span class="underline font-bold">下方按钮</span>以生成邀请链接</span>
          </div>
          <template #action>
            <n-button :disabled="!!user.invite_code" type="info" :loading="loadInviteCode" @click="handleGetInviteCode">
              生成邀请码
            </n-button>
            <n-button :disabled="!user.invite_code" type="info" class="ml-4" @click="handleCopyInviteText">
              复制邀请文案
            </n-button>
          </template>
        </n-card>
        <n-card v-if="false" title="邀请奖励记录" class="col-span-12 lg:col-span-8 order-4">
          <template #header-extra>
            <n-button strong secondary type="info">奖励提现</n-button>
          </template>
          卡片内容
          <template #footer> #footer </template>
          <template #action> #action </template>
        </n-card>
      </div>
      <n-modal v-model:show="showEmailModal">
        <n-card
          style="width: 600px"
          :title="`${user.email ? '更改' : '绑定'}邮箱地址`"
          :bordered="false"
          size="huge"
          role="dialog"
          aria-modal="true"
        >
          <template #header-extra>
            <n-button strong secondary class="text-md" @click="showEmailModal = false">
              <icon-ic:sharp-close />
            </n-button>
          </template>
          <n-form ref="formEmailBindRef" :model="formEmailBind" :rules="formEmailBindRules">
            <n-form-item-row label="邮箱地址" path="email">
              <n-input v-model:value="formEmailBind.email" placeholder="请输入邮箱地址" />
            </n-form-item-row>
            <n-form-item-row label="验证码" path="code">
              <n-input v-model:value="formEmailBind.code" placeholder="请输入验证码" />
              <n-button type="primary" dashed class="ml-2">获取验证码</n-button>
            </n-form-item-row>
          </n-form>
          <template #footer>
            <n-button
              :disabled="formEmailBind.email === null || formEmailBind.code === null"
              type="primary"
              @click="handleEmailBindClick"
            >
              {{ user.email ? '更改' : '绑定' }}
            </n-button>
          </template>
        </n-card>
      </n-modal>
      <n-modal v-model:show="showPasswordModal">
        <n-card style="width: 600px" title="更改密码" :bordered="false" size="huge" role="dialog" aria-modal="true">
          <template #header-extra>
            <n-button strong secondary class="text-md" @click="showPasswordModal = false">
              <icon-ic:sharp-close />
            </n-button>
          </template>
          <n-form ref="formPassChangeRef" :model="formPassChangeBind" :rules="formPassChangeRules">
            <n-form-item-row label="验证码" path="code">
              <n-input v-model:value="formPassChangeBind.code" placeholder="请输入验证码" />
              <n-button type="primary" dashed class="ml-2">获取验证码</n-button>
            </n-form-item-row>
            <n-form-item-row label="新密码" path="password">
              <n-input
                v-model:value="formPassChangeBind.password"
                placeholder="请输入新密码"
                type="password"
                @input="handlePasswordInput"
                @keydown.enter.prevent
              />
            </n-form-item-row>
            <n-form-item-row ref="formPassConfirmRef" label="确认新密码" path="confirmedPassword" first>
              <n-input
                v-model:value="formPassChangeBind.confirmedPassword"
                placeholder="请再次输入新密码"
                :disabled="!formPassChangeBind.password"
              />
            </n-form-item-row>
          </n-form>
          <template #footer>
            <n-button :disabled="formPassChangeBind.code === null" type="primary" @click="handlePassChangeClick">
              更改
            </n-button>
          </template>
        </n-card>
      </n-modal>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useUserStore } from '@/store';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { copyToClipboard } from '@/utils';
import { useMessage } from 'naive-ui';
import api from '@/views/saas/api';

const userStore = useUserStore();
const user = computed(() => userStore.userInfo);
const inviteLink = computed(() => `https://ai.yisukeyan.com/signup?invite_code=${user.value.invite_code}`);

const { isMobile } = useBasicLayout();
const message = useMessage();

const showEmailModal = ref(false);
const showPasswordModal = ref(false);

const handleLogout = (event) => {
  event?.stopPropagation();
  userStore.logout();
};

const loadInviteCode = ref(false);
const handleGetInviteCode = async () => {
  loadInviteCode.value = true;
  const res = await api.getUserInviteCodeApi();
  loadInviteCode.value = false;
  userStore.setUserInfo(res);
};

const handleCopyInviteText = () => {
  const text = `向大家强烈推荐一个方便好用的 ChatGPT 工具，叫一粟创作助手。写作业、写材料、写代码，都能轻松搞定！助力工作、学习、生活，创作无极限！海量模板，迸发灵感，提升效率！详情可见：https://ai.yisukeyan.com/。通过下方链接注册还可获赠 10 次免费体验：${inviteLink.value}`;
  copyToClipboard(text);
};

const formEmailBindRef = ref(null);
const formEmailBind = ref({
  email: null,
  code: null,
});
const formEmailBindRules = {
  email: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('需要邮箱地址');
        } else if (!isValidEmail(value)) {
          return new Error('邮箱地址不合法');
        }
        return true;
      },
      trigger: ['input', 'blur'],
    },
  ],
  code: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('需要验证码');
        } else if (!isValidCode(value)) {
          return new Error('验证码应为 5 位数字');
        }
        return true;
      },
    },
  ],
};

const handleEmailBindClick = async (e) => {
  e.preventDefault();
  formEmailBindRef.value?.validate((err) => {
    if (!err) {
      message.success('验证成功');
    } else {
      console.log(err);
      message.error('验证失败');
    }
  });
};

const formPassChangeRef = ref(null);
const formPassChangeBind = ref({
  code: null,
  password: null,
  confirmedPassword: null,
});
const formPassConfirmRef = ref(null);

const validatePasswordStartWith = (rule, value) => {
  return (
    !!formPassChangeRef.value.password &&
    formPassChangeRef.value.password.startsWith(value) &&
    formPassChangeRef.value.password.length >= value.length
  );
};
const validatePasswordSame = (rule, value) => {
  return value === formPassChangeRef.value.password;
};
const handlePasswordInput = () => {
  if (formPassChangeRef.value.confirmedPassword) {
    formPassConfirmRef.value?.validate({ trigger: 'password-input' });
  }
};

const formPassChangeRules = {
  code: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('需要验证码');
        } else if (!isValidCode(value)) {
          return new Error('验证码应为 5 位数字');
        }
        return true;
      },
    },
  ],
  password: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('需要密码');
        } else if (!isValidPassword(value)) {
          return new Error('密码应为 8~32 位，且包含数字或字母');
        }
        return true;
      },
    },
  ],
  confirmedPassword: [
    {
      required: true,
      message: '请再次输入密码',
      trigger: ['input', 'blur'],
    },
    {
      validator: validatePasswordStartWith,
      message: '两次密码输入不一致',
      trigger: 'input',
    },
    {
      validator: validatePasswordSame,
      message: '两次密码输入不一致',
      trigger: ['blur', 'password-input'],
    },
  ],
};

const handlePassChangeClick = async (e) => {
  e.preventDefault();
  formEmailBindRef.value?.validate((err) => {
    if (!err) {
      message.success('验证成功');
    } else {
      console.log(err);
      message.error('验证失败');
    }
  });
};

const isValidEmail = (email) => {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
};

const isValidCode = (code) => {
  const regex = /^\d{5}$/;
  return regex.test(code);
};

const isValidPassword = (val) => {
  const regex = /^(?!([^(0-9a-zA-Z)])+$).{8,32}$/;
  return regex.test(val);
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
