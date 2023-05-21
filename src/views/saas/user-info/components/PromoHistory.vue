<template>
  <n-card title="邀请奖励记录" class="order-4 col-span-12 md:col-span-10 lg:col-span-10 xl:col-span-6 2xl:col-span-5">
    <template #header-extra>
      <n-button strong secondary type="primary" @click="handleIncomeWithdraw">我要提现</n-button>
    </template>
    <div class="grid grid-cols-1 gap-4 mb-4 sm:grid-cols-3">
      <div v-if="Number.isFinite(user.invitation_count?.invitee_count)">
        <div class="font-bold text-md">邀请人数</div>
        <div class="text-sm">{{ user.invitation_count.invitee_count }}</div>
      </div>
      <div v-if="Number.isFinite(user.invitation_count?.call_count)">
        <div class="font-bold text-md">累计体验奖励</div>
        <div class="text-sm">{{ user.invitation_count.call_count }}</div>
      </div>
      <div v-if="Number.isFinite(user.invitation_count?.total_income)">
        <div class="font-bold text-md">累计现金奖励</div>
        <div class="text-sm">￥ {{ user.invitation_count.total_income / 100 }}</div>
      </div>
    </div>
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
              :to="`${user.invitation_count.total_income / 100}`"
              :precision="2"
              active
              show-separator
            />
          </n-statistic>
          <span>&thinsp;元</span>
        </p>
        <!-- <p>当前可提现奖励为：{{ user.invitation_count?.total_income }}&thinsp;元</p> -->
        <div class="my-4 shadow-lg rainbow-container">
          <img :src="QrCodeImg" alt="QR Code" />
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
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { formatDateTime } from '@/utils';
import { useMessage } from 'naive-ui';
import { useUserStore } from '@/store';
import QrCodeImg from '@/assets/images/qrcode.jpg';
import api from '@/views/saas/api';

const message = useMessage();

const userStore = useUserStore();
const user = computed(() => userStore.userInfo);

// invite income
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
  pageSize: 5,
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
    message.error(`奖励记录获取失败，${err.error.message}`);
  }
  loadInviteIncome.value = false;
};

onMounted(() => {
  handleGetInviteIncome();
});

// withdraw income
const showWithdrawModal = ref(false);
const handleIncomeWithdraw = () => {
  if (!Number.isFinite(user.value.invitation_count?.total_income) || user.value.invitation_count.total_income < 50) {
    message.error('现金奖励累计不满 50 元，暂时无法提现');
    return;
  }
  showWithdrawModal.value = true;
};
</script>

<style lang="scss">
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
