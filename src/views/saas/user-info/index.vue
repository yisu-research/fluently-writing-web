<template>
  <div class="h-full transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <n-layout
      class="h-full p-4"
      :native-scrollbar="false"
      :class="[isMobile ? 'rounded-none shadow-none' : 'border rounded-md shadow-md']"
    >
      <div class="grid grid-cols-12 gap-4">
        <n-card title="个人信息" class="order-1 col-span-12 md:col-span-8 lg:col-span-5 xl:col-span-6 2xl:col-span-5">
          <div class="flex flex-col items-center">
            <user-avatar :size="100" />
            <!-- <user-avatar :size="100" class="cursor-pointer" @click="showAvatarModal = true" /> -->
            <div v-if="user.username" class="mt-2 text-2xl font-bold">
              {{ user.username ?? '一粟创作助手' }}
            </div>
          </div>
          <div class="grid grid-cols-2 mt-6 text-md gap-x-2 gap-y-1">
            <div v-if="Number.isFinite(user.balance)">
              <span class="font-bold">剩余次数：</span>
              <span>{{ user.balance.toLocaleString() }}</span>
            </div>
            <div v-if="user.created_at">
              <span class="font-bold">创建日期：</span>
              <span>{{ formatDate(new Date(user.created_at)) }}</span>
            </div>
          </div>
          <template #action>
            <div class="text-end">
              <n-popconfirm placement="bottom" @positive-click="handleLogout($event)">
                <template #trigger>
                  <n-button quaternary type="error" class="text-rose-500">退出登录</n-button>
                </template>
                确认退出登录么？
              </n-popconfirm>
            </div>
          </template>
        </n-card>
        <n-card title="账号设置" class="order-2 col-span-12 md:col-span-10 lg:col-span-7 xl:col-span-6 2xl:col-span-5">
          <n-alert title="温馨提示" type="info" closable>尝试获取验证码但没收到邮件？检查一下垃圾箱吧！</n-alert>
          <div class="setting-item">
            <div>
              <div class="text-base font-bold">邮箱地址</div>
              <div class="text-md">
                <span v-if="user.email">已绑定 {{ user.email }}</span>
                <span v-else>暂未绑定邮箱（首次绑定可获赠&thinsp;10&thinsp;次创作体验）</span>
              </div>
            </div>
            <n-badge dot :show="!user.email" :offset="[0, 2]">
              <n-button type="primary" ghost @click="showEmailModal = true">{{
                user.email ? '更改' : '绑定'
              }}</n-button>
            </n-badge>
          </div>
          <div class="setting-item">
            <div>
              <div class="text-base font-bold">更改密码</div>
              <div class="text-md">密码必须至少为&thinsp;8&thinsp;个字符，最多为&thinsp;32&thinsp;个字符</div>
            </div>
            <n-button type="primary" ghost @click="showPasswordModal = true">更改</n-button>
          </div>
          <div v-if="false" class="setting-item">
            <div>
              <div class="text-base font-bold">更改头像</div>
              <div class="text-md">图片必须是&thinsp;PNG&thinsp;或&thinsp;JPG&thinsp;格式</div>
            </div>
            <n-button type="primary" ghost @click="showAvatarModal = true">更改</n-button>
          </div>
        </n-card>
        <PromoShare />
        <PromoHistory />
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
          <n-alert title="安全提示" type="warning" class="mb-6">为了保障您的账号安全，请您及时绑定邮箱！</n-alert>
          <n-form ref="refEmailBind" :model="modelEmailBind" :rules="ruleEmailBind">
            <n-form-item-row label="邮箱地址" path="email">
              <n-input v-model:value="modelEmailBind.email" placeholder="请输入邮箱地址" />
            </n-form-item-row>
            <n-form-item-row label="验证码" path="code">
              <n-input
                v-model:value="modelEmailBind.code"
                placeholder="请输入验证码"
                :disabled="!modelEmailBind.email"
              />
              <n-button
                type="primary"
                dashed
                class="ml-2"
                :disabled="!modelEmailBind.email || freezeEmailCode"
                :loading="loadEmailCode"
                @click="handleSendEmailCode(modelEmailBind.email)"
              >
                <span v-if="freezeEmailCode">{{ countDown }}&thinsp;秒后再发送</span>
                <span v-else>获取验证码</span>
              </n-button>
            </n-form-item-row>
          </n-form>
          <template #footer>
            <div class="flex justify-end">
              <n-button
                :disabled="!modelEmailBind.email || !modelEmailBind.code"
                type="primary"
                :loading="loadEmailBind"
                @click="handleEmailBindClick"
              >
                {{ user.email ? '更改' : '绑定' }}
              </n-button>
            </div>
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
          <n-form ref="refPassChange" :model="modelPassChange" :rules="formPassChangeRules">
            <n-form-item-row v-if="useEmail2ChangePass" label="验证码" path="code">
              <n-input v-model:value="modelPassChange.code" placeholder="请输入验证码" />
              <n-button
                type="primary"
                dashed
                class="ml-2"
                :disabled="freezeEmailCode"
                :loading="loadEmailCode"
                @click="handleSendEmailCode(user.email)"
              >
                <span v-if="freezeEmailCode">{{ countDown }}&thinsp;秒后再发送</span>
                <span v-else>获取验证码</span>
              </n-button>
            </n-form-item-row>
            <n-form-item-row v-else label="旧密码" path="oldPassword">
              <n-input
                v-model:value="modelPassChange.oldPassword"
                placeholder="请输入旧密码"
                type="password"
                @keydown.enter.prevent
              />
            </n-form-item-row>
            <n-form-item-row label="新密码" path="newPassword">
              <n-input
                v-model:value="modelPassChange.newPassword"
                placeholder="请输入新密码"
                type="password"
                @input="handlePasswordInput"
                @keydown.enter.prevent
              />
            </n-form-item-row>
            <n-form-item-row ref="refPassConfirm" label="确认新密码" path="confirmedPassword" first>
              <n-input
                v-model:value="modelPassChange.confirmedPassword"
                placeholder="请再次输入新密码"
                :disabled="!modelPassChange.newPassword"
                type="password"
                @keydown.enter.prevent
              />
            </n-form-item-row>
          </n-form>
          <div v-if="user.email" class="flex justify-end">
            <n-button quaternary type="primary" @click="useEmail2ChangePass = !useEmail2ChangePass">
              <span v-if="useEmail2ChangePass">收不到验证码？改用密码验证 </span>
              <span v-else>不记得旧密码？改用邮箱认证</span>
              <n-icon size="24" class="-translate-y-[3px]">
                <icon-ic:baseline-keyboard-double-arrow-right />
              </n-icon>
            </n-button>
          </div>
          <template #footer>
            <div class="flex justify-end">
              <n-button
                :disabled="
                  !modelPassChange.newPassword ||
                  !modelPassChange.confirmedPassword ||
                  modelPassChange.newPassword !== modelPassChange.confirmedPassword
                "
                type="primary"
                :loading="loadPassChange"
                @click="handlePassChangeClick"
              >
                更改
              </n-button>
            </div>
          </template>
        </n-card>
      </n-modal>
      <n-modal v-model:show="showAvatarModal">
        <n-card style="width: 600px" title="更改头像" :bordered="false" size="huge" role="dialog" aria-modal="true">
          <template #header-extra>
            <n-button strong secondary class="text-md" @click="showAvatarModal = false">
              <icon-ic:sharp-close />
            </n-button>
          </template>
          <user-avatar class="flex justify-center mb-8" :size="160" />
          <n-upload
            :max="1"
            action="#"
            :default-file-list="dataAvatar"
            :show-file-list="false"
            accept="image/png, image/jpeg"
            class="flex justify-center mb-6"
            :custom-request="handleAvatarUpload"
            @before-upload="beforeAvatarUpload"
          >
            <n-button size="large">上传&thinsp;PNG&thinsp;或&thinsp;JPG&thinsp;文件</n-button>
          </n-upload>
        </n-card>
      </n-modal>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useAppStore, useUserStore } from '@/store';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { formatDate, isValidEmail, isValidPassword, lStorage } from '@/utils';
import { useMessage } from 'naive-ui';
import api from '@/views/saas/api';
import UserAvatar from '@/components/common/UserAvatar.vue';
import { PromoShare, PromoHistory } from '@/views/saas/user-info/components';

const appStore = useAppStore();
const isEmailReminded = computed(() => appStore.isEmailReminded);

const userStore = useUserStore();
const user = computed(() => userStore.userInfo);

const { isMobile } = useBasicLayout();
const message = useMessage();

const handleLogout = (event) => {
  event?.stopPropagation();
  userStore.logout();
};

// bind email
const showEmailModal = ref(false);

onMounted(() => {
  if (!isEmailReminded.value) {
    showEmailModal.value = true;
    appStore.setEmailReminded(true);
  }
});

const refEmailBind = ref(null);
const modelEmailBind = ref({
  email: null,
  code: null,
});
const ruleEmailBind = {
  email: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('请输入邮箱地址');
        } else if (!isValidEmail(value)) {
          return new Error('邮箱地址不合法');
        }
        return true;
      },
      trigger: 'blur',
    },
  ],
  code: [
    {
      required: true,
      message: '请输入验证码',
      trigger: 'blur',
    },
  ],
};

const loadEmailBind = ref(false);
const handleEmailBindClick = (e) => {
  e.preventDefault();
  const action = user.value.email ? '更改' : '绑定';
  refEmailBind.value?.validate(async (err) => {
    if (!err) {
      loadEmailBind.value = true;
      try {
        await api.bindEmailApi({ email: modelEmailBind.value.email, code: modelEmailBind.value.code });
        message.success(`邮箱${action}成功`);
        await userStore.getUserInfo();
      } catch (err) {
        console.error(err);
        message.success(`邮箱${action}失败，${err.error.message}`);
      } finally {
        modelEmailBind.value = {
          email: null,
          code: null,
        };
        loadEmailBind.value = false;
      }
    } else {
      console.error(err);
      message.error('请按提示正确填写内容');
    }
    showEmailModal.value = false;
  });
};

// change password
const showPasswordModal = ref(false);

const refPassChange = ref(null);
const modelPassChange = ref({
  code: null,
  oldPassword: null,
  newPassword: null,
  confirmedPassword: null,
});
const refPassConfirm = ref(null);
const useEmail2ChangePass = ref(false);

const validatePasswordStartWith = (rule, value) => {
  return (
    !!modelPassChange.value.newPassword &&
    modelPassChange.value.newPassword.startsWith(value) &&
    modelPassChange.value.newPassword.length >= value.length
  );
};
const validatePasswordSame = (rule, value) => {
  return value === modelPassChange.value.newPassword;
};
const handlePasswordInput = () => {
  if (modelPassChange.value.confirmedPassword) {
    refPassConfirm.value?.validate({ trigger: 'password-input' });
  }
};

const formPassChangeRules = {
  code: [
    {
      key: 'code',
      required: true,
      message: '请输入验证码',
      trigger: 'blur',
    },
  ],
  oldPassword: [
    {
      key: 'old',
      required: true,
      message: '请输入旧密码',
      trigger: 'blur',
    },
  ],
  newPassword: [
    {
      required: true,
      validator(rule, value) {
        if (!value) {
          return new Error('请输入新密码');
        } else if (!isValidPassword(value)) {
          return new Error('密码应为 8~32 位，且包含数字或字母');
        }
        return true;
      },
      trigger: 'blur',
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

const loadPassChange = ref(false);
const handlePassChangeClick = async (e) => {
  e.preventDefault();
  const useEmail = useEmail2ChangePass.value;
  refPassChange.value?.validate(
    async (err) => {
      if (!err) {
        loadPassChange.value = true;
        try {
          if (useEmail) {
            await api.resetPasswordApi({
              email: user.value.email,
              code: modelPassChange.value.code,
              password: modelPassChange.value.newPassword,
            });
            message.success('密码重置成功');
          } else {
            await api.updatePasswordApi({
              old_password: modelPassChange.value.oldPassword,
              new_password: modelPassChange.value.newPassword,
            });
            message.success('密码更改成功');
          }
        } catch (_err) {
          console.error(_err);
          if (useEmail) {
            message.error(`密码重置失败，${_err.error.message}`);
          } else {
            message.error(`密码更改失败，${_err.error.message}`);
          }
        } finally {
          modelPassChange.value = {
            code: null,
            oldPassword: null,
            newPassword: null,
            confirmedPassword: null,
          };
          loadPassChange.value = false;
        }
      } else {
        console.error(err);
        message.error('请按提示正确填写内容');
      }
      showPasswordModal.value = false;
    },
    (rule) => {
      return rule?.key !== (useEmail ? 'old' : 'code');
    },
  );
};

// send verify code
const loadEmailCode = ref(false);
const freezeEmailCode = ref(false);
const countDown = ref(60);

const handleSendEmailCode = async (email) => {
  if (!isValidEmail(email)) {
    message.error('邮箱地址不合法');
    return;
  }
  loadEmailCode.value = true;
  try {
    await api.sendCodeApi({ category: 'email', email });
    message.success('验证码已发送，请注意查收');
    freezeEmailCode.value = true;
    const timer = setInterval(() => {
      countDown.value--;
      if (countDown.value === 0) {
        clearInterval(timer);
        freezeEmailCode.value = false;
        countDown.value = 30;
      }
    }, 1000);
  } catch (err) {
    console.error(err);
    message.error(`验证码发送失败，${err.error.message}`);
  } finally {
    loadEmailCode.value = false;
  }
};

// change avatar
const showAvatarModal = ref(false);
const dataAvatar = ref([]);

const beforeAvatarUpload = ({ file }) => {
  const fileType = file.file?.type;
  const allowedTypes = ['image/jpeg', 'image/png'];
  const fileSize = file.file?.size ?? 0;
  const maxSize = 1 * 1024 * 1024; // 1MB
  if (!allowedTypes.includes(fileType)) {
    message.error('只能上传 PNG 或 JPG 格式的图片，请重新上传');
    return false;
  } else if (fileSize > maxSize) {
    message.error('只能大小不超过 1MB 的图片，请重新上传');
    return false;
  }
  return true;
};

const loadAvatarChange = ref(false);
const handleAvatarUpload = ({ file }) => {
  const reader = new FileReader();
  reader.onload = (e) => {
    let base64 = e.target.result;

    const AVATAR_NAME = 'userAvatar';
    let userAvatar = lStorage.get(AVATAR_NAME);
    if (!userAvatar) {
      userAvatar = {};
    }

    userAvatar[user.value.id] = base64;
    lStorage.set(AVATAR_NAME, userAvatar);
    userStore.setUserInfo({ avatar: base64 });

    message.success('头像更换成功');
    showAvatarModal.value = false;
  };
  reader.onerror = (err) => {
    console.error(err);
    message.error(`头像更换失败，${err.error.message}`);
  };
  reader.onloadend = () => {
    loadAvatarChange.value = false;
  };

  loadAvatarChange.value = true;
  reader.readAsDataURL(file.file);

  dataAvatar.value = [];
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
