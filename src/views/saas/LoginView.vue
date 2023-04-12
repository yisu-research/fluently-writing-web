<template>
  <div></div>
  <div class="bg-teal-50/[0.3] w-full overflow-hidden h-[100dvh]">
    <div class="flex flex-col items-center justify-center h-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div
        class="flex flex-col justify-between w-full h-full my-4 overflow-hidden bg-white rounded-lg shadow-sm sm:h-auto ring-slate-100 ring-1"
      >
        <div class="px-4 sm:p-6 sm:flex sm:justify-center">
          <!-- 插画 -->
          <div
            class="hidden w-full py-8 sm:rounded-sm ring-13 ring-white/10 bg-teal-50 lg:flex lg:flex-1 lg:justify-center"
          >
            <img :src="NatureSvg" alt="Product screenshot" class="mx-10 w-80" />
          </div>

          <!-- 登录表单 -->
          <div class="flex flex-col items-center justify-between sm:px-6 sm:w-96 flex-2">
            <RouterLink to="/" class="text-sm font-semibold leading-6 text-gray-900">
              <div class="flex items-center justify-center my-4">
                <img class="w-auto h-12 mr-4" :src="LogoSvg" alt="Your Company" />
                <h2 class="text-3xl font-bold tracking-tight text-center text-gray-900">一粟创作助手</h2>
              </div>
            </RouterLink>
            <div class="w-full mt-4">
              <n-tabs default-value="signin-username" size="large" justify-content="center">
                <n-tab-pane name="signin-username" tab="密码登录">
                  <n-form ref="formUserRef" :model="formUser" :rules="rulesForUser">
                    <n-form-item-row label="用户名" path="username">
                      <n-input v-model:value="formUser.username" placeholder="请输入用户名或邮箱" />
                    </n-form-item-row>
                    <n-form-item-row label="密码" path="password">
                      <n-input v-model:value="formUser.password" placeholder="请输入密码" type="password" />
                    </n-form-item-row>
                    <div class="flex flex-row-reverse">
                      <n-button text @click="showForgetModal = true">忘记密码？</n-button>
                    </div>
                  </n-form>
                  <n-button
                    class="mt-8"
                    type="primary"
                    :loading="loadLogin"
                    block
                    secondary
                    strong
                    @click.prevent="onSignupForUser"
                  >
                    登录
                  </n-button>
                </n-tab-pane>
                <n-tab-pane name="signin-email" tab="验证码登录">
                  <n-form ref="formEmailRef" :model="formEmail" :rules="rulesForEmail">
                    <n-form-item-row label="邮箱" path="email">
                      <n-input v-model:value="formEmail.email" placeholder="请输入邮箱地址" />
                    </n-form-item-row>
                    <n-form-item-row label="验证码" path="code">
                      <n-input v-model:value="formEmail.code" placeholder="请输入验证码" />
                      <n-button
                        strong
                        secondary
                        type="primary"
                        class="ml-4"
                        :disabled="freezeEmailCode"
                        :loading="loadEmailCode"
                        @click="handleSendEmailCode(formEmail.email)"
                      >
                        <span v-if="freezeEmailCode">{{ countDown }}&thinsp;秒后再发送</span>
                        <span v-else>获取验证码</span>
                      </n-button>
                    </n-form-item-row>
                  </n-form>

                  <n-button
                    type="primary"
                    block
                    secondary
                    strong
                    class="mt-8"
                    :loading="loadLogin"
                    @click.prevent="onSignupForEmail"
                  >
                    登录
                  </n-button>
                </n-tab-pane>
              </n-tabs>
              <div class="flex items-center justify-end">
                <n-button text class="my-4 sm:mb-0"><router-link to="/signup">没有账号？去注册</router-link> </n-button>
              </div>
            </div>
          </div>
        </div>

        <!-- 忘记密码 -->
        <n-modal v-model:show="showForgetModal">
          <n-card style="width: 600px" title="温馨提示" :bordered="false" size="huge" preset="dialog" aria-modal="true">
            <template #header-extra>
              <n-button strong secondary class="text-md" @click="showForgetModal = false">
                <icon-ic:sharp-close />
              </n-button>
            </template>
            <p class="py-4 text-lg">请您联系客服找回密码</p>
            <div class="py-2 mx-auto w-50 sm:w-60 lg:py-4 lg:px-8">
              <img
                :src="QrCodeImg"
                alt="Product screenshot"
                class="p-4 rounded-xl sm:rounded-lg ring-2 ring-teal-400"
              />
            </div>
          </n-card>
        </n-modal>

        <!-- 封底 -->
        <div class="px-4 sm:px-6">
          <div class="py-4 border-t border-slate-900/5">
            <div class="flex flex-wrap items-center justify-center">
              <img :src="YisuImg" width="36" class="mr-2" />
              <p class="font-bold">一粟科研</p>
            </div>
            <p class="mt-5 text-sm leading-6 text-center text-slate-500">© 2023 一粟科研 Inc. All rights reserved.</p>
          </div>
          <p></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import { setToken, isValidEmail, isValidPassword } from '@/utils';
import QrCodeImg from '@/assets/images/qrcode.jpg';
import YisuImg from '@/assets/svg/yisu.svg';
import LogoSvg from '@/assets/svg/logo.svg';
import NatureSvg from '@/assets/svg/nature.svg';
import api from './api';

const router = useRouter();
const message = useMessage();

const showForgetModal = ref(false);
const loadLogin = ref(false);

const formUserRef = ref(null);
const formEmailRef = ref(null);

const formUser = ref({
  username: '',
  password: '',
  login_type: 'username',
});

const formEmail = ref({
  email: '',
  code: '',
  login_type: 'email_code',
});

const rulesForUser = {
  username: {
    required: true,
    message: '请输入用户名或邮箱',
    trigger: 'blur',
  },
  password: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请输入密码');
      } else if (!isValidPassword(value)) {
        return new Error('密码应为 8~32 位，且包含数字或字母');
      }
      return true;
    },
    trigger: 'blur',
  },
};

const rulesForEmail = {
  email: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请填写邮箱');
      } else if (!isValidEmail(value)) {
        return new Error('请填写正确的邮箱地址');
      }
      return true;
    },
    trigger: 'blur',
  },
  code: {
    required: true,
    message: '请输入验证码',
    trigger: 'blur',
  },
};

const onSignupForUser = async () => {
  formUserRef.value?.validate(async (err) => {
    if (!err) {
      loadLogin.value = true;
      try {
        const res = await api.loginApi(formUser.value);
        setToken(res.token);
        router.push('/chat');
        message.success('登录成功');
      } catch (_err) {
        console.error(_err);
        message.error(`登录失败，${_err.error.message}`);
      } finally {
        setTimeout(() => {
          loadLogin.value = false;
        }, 1000);
      }
    } else {
      console.error(err);
      message.error('请按要求填写账号信息');
    }
  });
};

const onSignupForEmail = async () => {
  formEmailRef.value?.validate(async (err) => {
    if (!err) {
      loadLogin.value = true;
      try {
        const res = await api.loginApi(formEmail.value);
        setToken(res.token);
        router.push('/chat');
        message.success('登录成功');
      } catch (_err) {
        console.error(_err);
        message.error(`登录失败，${_err.error.message}`);
      } finally {
        setTimeout(() => {
          loadLogin.value = false;
        }, 1000);
      }
    } else {
      console.error(err);
      message.error('请按要求填写账号信息');
    }
  });
};

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
</script>
