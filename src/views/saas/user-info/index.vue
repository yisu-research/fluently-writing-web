<template>
  <div class="h-full transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <n-layout
      class="h-full p-4"
      :native-scrollbar="false"
      :class="[isMobile ? 'rounded-none shadow-none' : 'border rounded-md shadow-md']"
    >
      <div class="grid grid-cols-12 gap-4">
        <n-card title="个人信息" class="col-span-12 md:col-span-8 lg:col-span-5 xl:col-span-6 2xl:col-span-5 order-1">
          <div class="flex flex-col items-center">
            <img class="w-[100px] h-[100px] rounded-full" src="@/assets/avatar.jpg" alt="" />
            <div v-if="user.username" class="mt-2 text-2xl font-bold">
              {{ user.username ?? '一粟创作助手' }}
            </div>
          </div>
          <div class="text-md grid grid-cols-2 gap-x-2 gap-y-1 mt-4">
            <div class="col-span-2">
              <span class="font-bold">邮箱：</span>
              <span>{{ user.email ?? '暂未绑定' }}</span>
            </div>
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
        <n-card title="账号设置" class="col-span-12 md:col-span-10 lg:col-span-7 xl:col-span-6 2xl:col-span-5 order-2">
          <div class="setting-item">
            <div>
              <div class="text-base font-bold">邮箱地址</div>
              <div class="text-md">
                <span v-if="user.email">已绑定 {{ user.email }}</span>
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
        <n-card
          title="邀请新用户"
          class="col-span-12 md:col-span-10 lg:col-span-10 xl:col-span-6 2xl:col-span-5 order-3"
        >
          <p>以下是您的邀请码和邀请链接，新用户通过您的邀请码注册并使用时，您将获得相应的奖励！具体方案为：</p>
          <p>
            每成功邀请一位新用户完成注册并绑定邮箱，您和新用户都将<span class="font-bold text-teal-600"
              >获得&thinsp;10&thinsp;次创作体验！</span
            >
          </p>
          <p>
            当您邀请的新用户首次充值时，您将<span class="font-bold text-teal-600"
              >获得&thinsp;20%&thinsp;的现金奖励！</span
            >
          </p>
          <p>
            例如，新用户首次充值了&thinsp;100&thinsp;元，您将获得&thinsp;20&thinsp;元的现金奖励。<span
              class="font-bold text-teal-600"
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
                class="cursor-pointer hover:text-teal-500"
                @click="copyToClipboard(user.invite_code)"
              >
                <n-icon class="ml-2 mr-0.5" size="16">
                  <icon-ic:baseline-content-copy />
                </n-icon>
                <span>点击以复制邀请码</span>
              </span>
            </span>
            <span v-else>点击<span class="font-bold underline">下方按钮</span>以生成邀请码</span>
          </div>
          <div>
            <span>邀请链接：</span>
            <span v-if="user.invite_code" class="ml-1">
              <a :href="inviteLink" target="__blank" class="text-teal-600 hover:underline">
                {{ inviteLink }}
              </a>
              <span class="cursor-pointer hover:text-teal-500" @click="copyToClipboard(inviteLink)">
                <n-icon class="ml-2 mr-0.5" size="16">
                  <icon-ic:baseline-content-copy />
                </n-icon>
                <span>点击以复制邀请链接</span>
              </span>
            </span>
            <span v-else>点击<span class="font-bold underline">下方按钮</span>以生成邀请链接</span>
          </div>
          <template #action>
            <n-button
              :disabled="!!user.invite_code"
              type="primary"
              :loading="loadInviteCode"
              @click="handleGetInviteCode"
            >
              生成邀请码
            </n-button>
            <n-button :disabled="!user.invite_code" type="primary" class="ml-4" @click="handleCopyInviteText">
              复制邀请文案
            </n-button>
          </template>
        </n-card>
        <n-card
          title="邀请奖励记录"
          class="col-span-12 md:col-span-10 lg:col-span-10 xl:col-span-6 2xl:col-span-5 order-4"
        >
          <template #header-extra>
            <n-button strong secondary type="primary" @click="handleIncomeWithdraw">我要提现</n-button>
          </template>
          <h2 class="text-lg mb-2">统计</h2>
          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
            <div v-if="Number.isFinite(user.invitation_count?.invitee_count)">
              <div class="font-bold text-md">邀请人数</div>
              <div class="text-sm">{{ user.invitation_count.invitee_count }}</div>
            </div>
            <div v-if="Number.isFinite(user.invitation_count?.call_count)">
              <div class="font-bold text-md">奖励体验次数</div>
              <div class="text-sm">{{ user.invitation_count.call_count }}</div>
            </div>
            <div v-if="Number.isFinite(user.invitation_count?.total_income)">
              <div class="font-bold text-md">累计现金奖励</div>
              <div class="text-sm">{{ user.invitation_count.total_income }}</div>
            </div>
          </div>
          <h2 class="mb-2 text-lg">明细</h2>
          <n-data-table
            remote
            :columns="columnIncome"
            :data="dataIncome"
            :loading="loadInviteIncome"
            :pagination="pageIncome"
            :bordered="false"
            @update:page="handleGetInviteIncome"
          />
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
      <n-modal v-model:show="showWithdrawModal">
        <n-card style="width: 600px" title="奖励提现" :bordered="false" size="huge" role="dialog" aria-modal="true">
          <template #header-extra>
            <n-button strong secondary class="text-md" @click="showWithdrawModal = false">
              <icon-ic:sharp-close />
            </n-button>
          </template>
          <div class="flex flex-col items-center">
            <p>感谢您的支持与推广！</p>
            <p class="flex items-end">
              <span>当前可提现奖励</span>
              <n-statistic tabular-nums class="mx-1" style="--n-value-font-size: 20px">
                <n-number-animation
                  :from="0.0"
                  :to="user.invitation_count?.total_income"
                  :precision="2"
                  active
                  show-separator
                />
              </n-statistic>
              <span>&thinsp;元</span>
            </p>
            <!-- <p>当前可提现奖励为：{{ user.invitation_count?.total_income }}&thinsp;元</p> -->
            <div class="rainbow-container shadow-lg my-4">
              <img :src="ChatImg" alt="QR Code" />
              <div class="rainbows">
                <div class="rainbow"></div>
                <div class="rainbow"></div>
              </div>
            </div>
            <p>微信扫描上方二维码</p>
            <p>联系客服即可提现</p>
          </div>
        </n-card>
      </n-modal>
    </n-layout>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue';
import { useUserStore } from '@/store';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { formatDate, formatDateTime, copyToClipboard, isValidEmail, isValidPassword } from '@/utils';
import { useMessage } from 'naive-ui';
import ChatImg from '@/assets/images/chat.png';
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
  const res = await api.createInviteCodeApi();
  loadInviteCode.value = false;
  userStore.setUserInfo(res);
};

const handleCopyInviteText = () => {
  const text = `向大家强烈推荐一个方便好用的 ChatGPT 工具，叫一粟创作助手。写作业、写材料、写代码，都能轻松搞定！助力工作、学习、生活，创作无极限！海量模板，迸发灵感，提升效率！详情可见：https://ai.yisukeyan.com/。通过下方链接注册还可获赠 10 次免费体验：${inviteLink.value}`;
  copyToClipboard(text);
};

const dataIncome = ref([]);
const columnIncome = [
  {
    title: '时间',
    key: 'time',
  },
  {
    title: '来源',
    key: 'action',
  },
  {
    title: '奖励',
    key: 'income',
  },
];
const pageIncome = reactive({
  page: 1,
  pageCount: 1,
  pageSize: 10,
  prefix({ itemCount }) {
    return `共 ${itemCount} 条`;
  },
});
const loadInviteIncome = ref(false);
const handleGetInviteIncome = async (currentPage = 1) => {
  loadInviteIncome.value = true;
  try {
    const res = await api.getInviteIncomeApi({ limit: pageIncome.pageSize, page: currentPage });
    dataIncome.value = res.incomes.map((item) => {
      return {
        key: item.id,
        time: formatDateTime(new Date(item.created_at)),
        action: item.action,
        income: item.description,
      };
    });
    pageIncome.page = currentPage;
    pageIncome.itemCount = res.total_count;
    pageIncome.pageCount = Math.ceil(res.total_count / pageIncome.pageSize);
  } catch (err) {
    console.error(err);
    message.error(`邀请码生成失败，${err.error.message}`);
  }
  loadInviteIncome.value = false;
};

onMounted(() => {
  handleGetInviteIncome();
});

const showWithdrawModal = ref(false);
const handleIncomeWithdraw = () => {
  if (!Number.isFinite(user.value.invitation_count?.total_income) || user.value.invitation_count.total_income < 50) {
    message.error('现金奖励累计不满 50 元，暂时无法提现');
    return;
  }
  showWithdrawModal.value = true;
};

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

const loadEmailCode = ref(false);
const freezeEmailCode = ref(false);
const countDown = ref(30);

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

// const isValidCode = (code) => {
//   const regex = /^\d{5}$/;
//   return regex.test(code);
// };
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

.rainbow-container {
  --color-first: #65587f;
  --color-second: #f18867;
  --color-third: #e85f99;
  --color-forth: #50bda1;
  --border-width: 12px;
  --border-radius-outer: 8px;
  --border-radius-inner: calc(var(--border-radius-outer) / 2);

  overflow: hidden;
  position: relative;
  width: 240px;
  height: 240px;
  border-radius: var(--border-radius-outer);

  img {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: calc(100% - var(--border-width));
    height: calc(100% - var(--border-width));
    border-radius: var(--border-radius-inner);
    z-index: 1;
  }

  .rainbows {
    width: 100%;
    height: 100%;
    animation: o-rotate-360 linear 8s infinite;

    .rainbow {
      display: block;
      width: 100%;
      height: 100%;
      position: relative;
      transform: translate(-50%, -50%);

      &:after {
        display: block;
        content: '';
        width: 100%;
        height: 100%;
        position: absolute;
        left: 100%;
      }

      &:first-child {
        background: var(--color-first);
        &:after {
          background: var(--color-second);
        }
      }

      &:last-child {
        background: var(--color-third);
        &:after {
          background: var(--color-forth);
        }
      }
    }
  }
}

@keyframes o-rotate-360 {
  0% {
    transform: rotate(0);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
