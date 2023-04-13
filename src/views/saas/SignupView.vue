<template>
  <div class="bg-teal-50/[0.3] w-full overflow-hidden h-[100dvh]">
    <div class="flex flex-col items-center justify-center h-full px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div
        class="flex flex-col justify-between w-full h-full my-4 overflow-hidden bg-white rounded-lg shadow-sm ring-slate-100 ring-1 sm:h-auto"
      >
        <div class="px-4 sm:p-6 sm:flex sm:justify-center">
          <!-- 插画 -->
          <div
            class="hidden w-full py-8 sm:rounded-sm ring-13 ring-white/10 bg-teal-50 lg:flex lg:flex-1 lg:justify-center"
          >
            <img :src="WelcomeSvg" alt="Product screenshot" class="mx-10 w-80" />
          </div>

          <!-- 注册表单 -->
          <div class="flex flex-col items-center justify-between w-full sm:px-6 lg:w-1/2 flex-2">
            <RouterLink to="/" class="text-sm font-semibold leading-6 text-gray-900">
              <div class="flex items-center justify-center my-4">
                <img class="w-auto h-12 mr-4" :src="LogoSvg" alt="Your Company" />
                <h2 class="text-3xl font-bold tracking-tight text-center text-gray-900">一粟创作助手</h2>
              </div>
            </RouterLink>
            <div class="w-full mt-12">
              <n-tabs default-value="signin-username" size="large" justify-content="start">
                <n-tab-pane name="signin-username" tab="注册">
                  <n-form ref="formRef" :model="formValue" :rules="rules">
                    <n-form-item-row label="用户名" path="username">
                      <n-input v-model:value="formValue.username" placeholder="用户名由数字和字母组成，长度6-24位" />
                    </n-form-item-row>
                    <n-form-item-row label="邀请码" path="invite_code">
                      <n-input v-model:value="formValue.invite_code" placeholder="邀请码（可选）" />
                    </n-form-item-row>
                    <n-form-item-row label="密码" path="password">
                      <n-input v-model:value="formValue.password" placeholder="有效密码长度为8-32位" type="password" />
                    </n-form-item-row>
                  </n-form>
                  <n-button
                    type="primary"
                    block
                    secondary
                    strong
                    :loading="loadSignup"
                    class="mt-8"
                    @click.prevent="onSignup"
                  >
                    注册
                  </n-button>
                </n-tab-pane>
              </n-tabs>
              <div class="flex items-center justify-end">
                <n-button text class="my-4 sm:mb-0"><router-link to="/login">已有账号？去登录</router-link> </n-button>
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
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { setToken } from '@/utils';
import { useRoute, useRouter } from 'vue-router';
import { useMessage } from 'naive-ui';
import YisuImg from '@/assets/svg/yisu.svg';
import LogoSvg from '@/assets/svg/logo.svg';
import WelcomeSvg from '@/assets/svg/welcome.svg';
import api from './api';

const route = useRoute();
const router = useRouter();
const message = useMessage();

const loadSignup = ref(false);

const formRef = ref(null);
const formValue = ref({
  username: '',
  invite_code: null,
  password: '',
});

const rules = {
  username: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请输入用户名');
      } else if (!/^.{6,24}$/.test(value)) {
        return new Error('用户名长度显示为6-24个字符');
      }
      return true;
    },
    trigger: 'blur',
  },
  password: {
    required: true,
    validator(rule, value) {
      if (!value) {
        return new Error('请填写密码');
      } else if (!/^(?!([^(0-9a-zA-Z)])+$).{8,32}$/.test(value)) {
        return new Error('密码长度8-32位');
      }
      return true;
    },
    trigger: ['input'],
  },
};

onMounted(() => {
  formValue.value.invite_code = route.query.invite_code ?? '';
});

const onSignup = async () => {
  formRef.value?.validate(async (err) => {
    if (!err) {
      loadSignup.value = true;
      try {
        const res = await api.signupApi(formValue.value);
        setToken(res.token);
        message.success('注册成功');
        router.push('/chat');
      } catch (_err) {
        console.error(_err);
        message.error(`注册失败，${_err.error.message}`);
      } finally {
        setTimeout(() => {
          loadSignup.value = false;
        }, 1000);
      }
    } else {
      console.error(err);
      message.error('请按要求填写注册信息');
    }
  });
};
</script>
