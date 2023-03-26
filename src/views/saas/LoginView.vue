<template>
  <div></div>
  <div class="bg-teal-50/[0.3] w-full overflow-hidden h-screen">
    <div class="flex flex-col items-center justify-center h-screen px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div
        class="flex flex-col justify-between w-full h-screen my-4 overflow-hidden bg-white rounded-lg shadow-sm sm:h-auto ring-slate-100 ring-1"
      >
        <div class="px-4 sm:p-6 sm:flex sm:justify-center">
          <!-- Content goes here -->

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
                    <div class="flex flex-row-reverse"><n-button text @click="handleForget">忘记密码？</n-button></div>
                    <n-modal v-model:show="state.showModal">
                      <n-card
                        style="width: 600px"
                        title="温馨提示"
                        :bordered="false"
                        size="huge"
                        preset="dialog"
                        aria-modal="true"
                      >
                        <template #header-extra
                          ><SvgIcon icon="uil:times" class="text-2xl text-slate-800" @click="handleClose"
                        /></template>
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
                  </n-form>
                  <n-button
                    class="mt-8"
                    type="primary"
                    :disabled="state.loading"
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
                      <n-button strong secondary type="primary" class="ml-4" :disabled="disabled" @click="sendCode"
                        >{{ timer === 0 ? '发送验证码' : `${timer}秒后重新发送` }}
                      </n-button>
                    </n-form-item-row>
                  </n-form>

                  <n-button
                    type="primary"
                    block
                    secondary
                    strong
                    class="mt-8"
                    :disabled="state.loading"
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

        <!-- footer -->
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
import LogoSvg from '@/assets/svg/logo.svg';
import NatureSvg from '@/assets/svg/nature.svg';
import { setToken } from '@/utils';
import api from './api';
import { useMessage } from 'naive-ui';
import { ref, reactive } from 'vue';
import { useDebounceFn, useIntervalFn } from '@vueuse/core';
import QrCodeImg from '@/assets/images/qrcode.jpg';
import YisuImg from '@/assets/svg/yisu.svg';

const state = reactive({
  loading: false,
  showModal: false,
});

const router = useRouter();

/// 定时器
const timer = ref(0);

/// 禁用按钮
const disabled = ref(false);

const formUserRef = ref(null);

const formEmailRef = ref(null);

const message = useMessage();

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
    message: '请输入姓名',
    trigger: 'blur',
  },
  password: {
    required: true,
    trigger: ['input'],
    validator(rule, value) {
      if (!value) {
        return new Error('请填写密码');
      } else if (!/^(?!([^(0-9a-zA-Z)])+$).{8,32}$/.test(value)) {
        return new Error('密码长度8-32位');
      }
      return true;
    },
  },
};

const rulesForEmail = {
  email: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请填写邮箱');
      } else if (!isEmail(value)) {
        return new Error('请填写正确的邮箱地址');
      }
      return true;
    },
    trigger: 'blur',
  },
  code: {
    required: true,
    message: '请输入验证码',
    trigger: ['input'],
  },
};

const handleForget = useDebounceFn(() => {
  state.showModal = true;
}, 500);

const handleClose = () => {
  state.showModal = false;
};

const onSignupForUser = useDebounceFn(async () => {
  state.loading = true;
  formUserRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        let res = await api.loginApi(formUser.value);
        setToken(res.token);
        router.push('/chat');
        $message.success('登录成功');
      } catch (error) {
        console.log(error.error.message);
        $message.error(error.error.message);
      } finally {
        state.loading = false;
      }
    } else {
      console.log(errors);
      state.loading = false;
      message.error('请按要求填写账号信息');
    }
  });
}, 600);

const onSignupForEmail = useDebounceFn(async () => {
  state.loading = true;
  formEmailRef.value?.validate(async (errors) => {
    if (!errors) {
      try {
        let res = await api.loginApi(formEmail.value);
        setToken(res.token);
        router.push('/chat');
        $message.success('登录成功');
      } catch (error) {
        console.log(error.error.message);
        $message.error(error.error.message);
      } finally {
        state.loading = false;
      }
    } else {
      console.log(errors);
      state.loading = false;
      message.error('请按要求填写账号信息');
    }
  });
}, 600);

const { pause, resume } = useIntervalFn(
  () => {
    /// 每次定时任务 控制时间递减
    if (timer.value <= 0) {
      // 恢复按钮
      disabled.value = false;
      // 停止递减： 停止定时器
      pause();
    } else {
      timer.value -= 1;
    }
  },
  1000,
  {
    // 首次是否自动启动定时任务：true（默认值，自动启动），false，不需要自动启动
    immediate: false,
    // 是否延时执行定时任务（false(默认值)，不延时；true表示延时）
    immediateCallback: false,
  },
);

// 校验邮箱地址是否合法
const isEmail = (email) => {
  return /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
    email,
  );
};

const sendCode = async () => {
  if (formEmail.value.email === '' || !isEmail(formEmail.value.email)) {
    message.error('无效的邮箱地址');
    return;
  }
  try {
    await api.sendCodeApi({ phone_number: formPhone.value.phone_number });
    message.success('发送成功！');
    // 开启定时效果
    if (timer.value === 0) {
      // 禁用按钮
      disabled.value = true;
      timer.value = 60;
      // 重启定时器
      resume();
    } else {
      return;
    }
  } catch (error) {
    console.log(error);
    message.error('验证码发送失败');
  }
};
</script>
