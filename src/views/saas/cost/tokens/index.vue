<template>
  <div class="h-full transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <n-layout
      class="h-full"
      :native-scrollbar="false"
      :class="[isMobile ? 'rounded-none shadow-none' : 'border rounded-md shadow-md']"
    >
      <!-- 剩余字符数 -->
      <div class="py-20 bg-teal-500/[0.9] sm:py-16">
        <div class="max-w-4xl px-6 mx-auto lg:px-8">
          <dl class="grid grid-cols-1 text-center gap-y-16 gap-x-8">
            <div class="flex flex-col max-w-xs mx-auto gap-y-4">
              <dt class="text-base leading-7 text-gray-100">剩余次数</dt>
              <dd class="order-first text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                {{ userInfo.balance }}
              </dd>
            </div>
          </dl>
        </div>
      </div>

      <!-- 购买字符 -->
      <div class="sm:py-8">
        <div class="px-6 mx-auto max-w-7xl lg:px-8">
          <!-- 购买套餐 -->
          <div class="max-w-4xl mx-auto text-center">
            <p class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">购买套餐</p>
            <div class="mt-4 text-2xl font-bold leading-8 text-teal-500 animate-pulse">早期尝鲜价格</div>
          </div>

          <!-- 套餐列表 -->
          <div class="grid grid-cols-1 gap-6 mx-auto mt-10 isolate md:grid-cols-2 lg:grid-cols-4 xl:mx-0">
            <div
              v-for="tier in state.products"
              :key="tier.id"
              :class="[
                tier.mostPopular && !userInfo.first_purchase
                  ? 'ring-4 ring-teal-500 hover:shadow-lg delay-100 duration-200 hover:scale-105'
                  : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-teal-500 hover:shadow-lg delay-100 duration-200 hover:scale-105',
                'rounded-2xl p-4 lg:p-8',
              ]"
            >
              <div class="flex items-center justify-between gap-x-4">
                <h3 v-if="tier.isDiscount" :id="tier.id" class="text-xl font-semibold leading-8 text-teal-500">
                  {{ tier.isDiscount ? `${tier.description * 10} 折` : '' }}
                </h3>
                <h3 v-else :id="tier.id" class="text-xl font-semibold leading-8 text-transparent">
                  {{ `${tier.description * 10}折` }}
                </h3>
                <p
                  v-if="tier.isDiscount"
                  class="rounded-full bg-teal-500/10 py-1 px-2.5 text-md font-semibold leading-5 text-teal-500"
                >
                  {{ tier.mostPopular ? '首次充值专享' : '优惠' }}
                </p>
              </div>
              <div class="flex items-center justify-center mt-8">
                <h3 :id="tier.id" class="text-3xl font-semibold leading-8 text-gray-900">
                  {{ `${tier.callCount} 次` }}
                </h3>
              </div>
              <div class="flex items-baseline justify-center mt-6 gap-x-1">
                <div>
                  <span class="text-xl font-bold tracking-tight text-gray-900">￥</span>
                  <span class="text-4xl font-bold tracking-tight text-gray-900">{{ ` ${tier.price}` }}</span>
                </div>
                <span v-if="tier.isDiscount" class="ml-2 text-lg font-normal leading-6 text-gray-400 line-through">{{
                  `${tier.originalPrice}`
                }}</span>
              </div>
              <div
                v-if="!tier.mostPopular || userInfo.first_purchase"
                :aria-describedby="tier.id"
                :class="[
                  tier.mostPopular
                    ? 'bg-teal-500 text-white shadow-sm hover:bg-teal-400'
                    : 'text-teal-500 ring-2 ring-inset ring-gray-200 hover:bg-gray-100',
                  'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600 cursor-pointer',
                ]"
                @click="handleOrder(tier.id)"
              >
                立即购买
              </div>
              <n-modal
                v-model:show="state.showModal"
                class="custom-card"
                preset="card"
                :showIcon="false"
                aria-modal="true"
                :style="bodyStyle"
                size="huge"
                title="订单支付"
                :closable="false"
                :bordered="false"
                :mask-closable="false"
              >
                <!-- <template #header-extra> 订单支付 </template> -->
                <n-spin :show="state.orderLoading" stroke="10BA9B">
                  <div v-if="state.orderLoading" class="h-40"></div>
                  <div v-else class="mt-4">
                    <div class="flex flex-col justify-between md:flex-row lg:flex-row">
                      <div class="flex md:base-2/3">
                        <div class="flex flex-col items-start justify-start">
                          <div v-for="item in orderData" :key="item.title" class="mt-2">
                            <div class="flex flex-col justify-start sm:flex-row">
                              <p class="text-md">{{ `${item.title}：` }}</p>
                              <p class="text-teal-600">{{ ` ${item.value}` }}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div class="flex flex-col items-center justify-center mt-6 md:base-2/3 md:mt-0">
                        <div class="">
                          <img :src="qrcode.value" alt="QR Code" class="w-40 h-40" />
                        </div>
                        <div class="flex">
                          <p>使用微信扫一扫支付</p>
                        </div>
                      </div>
                    </div>
                    <div class="flex items-end justify-end mt-8">
                      <n-popconfirm
                        v-if="state.orderDetail.state === 'pending'"
                        placement="bottom"
                        @positive-click="handlePayCancel()"
                      >
                        <template #trigger>
                          <n-button strong secondary round type="warning" class="mr-8"> 取消订单 </n-button>
                        </template>
                        确定取消订单?
                      </n-popconfirm>
                      <n-button strong secondary round type="success" class="mr-4" @click="handleClose">
                        稍后支付
                      </n-button>
                    </div>
                    <div v-if="isMobile" class="flex justify-start mt-6">
                      <n-icon class="mr-1" size="16">
                        <icon-material-symbols:qr-code-scanner />
                      </n-icon>
                      <span>手机用户请长按图片或截屏，再使用微信的「扫一扫 -> 相册」来完成支付</span>
                    </div>
                  </div>

                  <template #description>
                    <n-tag :bordered="false" type="success">
                      <p class="text-lg font-medium">正在下单...</p>
                    </n-tag>
                  </template>
                </n-spin>
              </n-modal>
            </div>
          </div>

          <!-- 套餐说明 -->
          <div class="mt-10 text-sm text-slate-600">
            <p>
              <n-icon size="20">
                <icon-ic:baseline-attach-money />
              </n-icon>
              <span class="ml-1">支付满 500 元可联系</span>
              <n-popover trigger="hover">
                <template #trigger>
                  <span class="underline">客服</span>
                </template>
                <img :src="QrCodeImg" alt="Contact Us" class="w-40 h-40" />
              </n-popover>
              <span>开具发票</span>
            </p>
            <p>
              <n-icon size="20">
                <icon-mdi:api />
              </n-icon>
              <span class="ml-1">我们提供大规模 API 调用服务，详情可咨询</span>
              <n-popover trigger="hover">
                <template #trigger>
                  <span class="underline">客服</span>
                </template>
                <img :src="QrCodeImg" alt="Contact Us" class="w-40 h-40" />
              </n-popover>
            </p>
          </div>

          <!-- 消费记录 -->
          <Record />
        </div>
      </div>
    </n-layout>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { useUserStore } from '@/store';
import { formatDateTime } from '@/utils';
import Record from '../record/index.vue';

import api from '../../api';
import { useQRCode } from '@vueuse/integrations/useQRCode';
import QrCodeImg from '@/assets/images/qrcode.jpg';

const state = reactive({
  products: [],
  showModal: false,
  orderLoading: false,
  qrCode: '无效的二维码',
  orderDetail: {
    id: null,
    product_id: 1,
    user_id: 2,
    out_trade_no: '202303190324221234567895',
    expired_at: '2023-03-19T11:34:22.857+08:00',
    amount: 100,
    state: '',
    product_name: '1块钱10次',
    product_price: 100,
    product_call_count: 10,
    product_description: '1',
    code_url: '无效的二维码',
    paid_at: null,
    canceled_at: null,
    transaction_id: null,
    created_at: '2023-03-19T11:24:22.858+08:00',
    updated_at: '2023-03-19T11:24:23.287+08:00',
  },
});

let pollingST = null;

const polling = (id) => {
  api.getOrderDetailApi(id).then(async (res) => {
    if (res.state !== 'pending') {
      console.log('支付成功');
      state.showModal = false;
      destroyed();
      $message.success('支付成功');
      try {
        const userStore = useUserStore();
        await userStore.getUserInfo();
      } catch (error) {
        console.error(error);
      }
    } else {
      pollingST = setTimeout(() => {
        clearTimeout(pollingST);
        polling(id);
      }, 2000);
    }
  });
};

const orderData = computed(() => [
  {
    title: '套餐',
    value: `${state.orderDetail.product_call_count} 次`,
  },
  {
    title: '金额',
    value: `${state.orderDetail.product_price / 100} 元`,
  },
  {
    title: '订单号',
    value: state.orderDetail.out_trade_no,
  },

  {
    title: '下单时间',
    value: formatDateTime(state.orderDetail.created_at),
  },
  {
    title: '订单过期时间',
    value: `${formatDateTime(state.orderDetail.expired_at)}`,
  },
]);

const qrcode = computed(() =>
  useQRCode(state.qrCode, {
    errorCorrectionLevel: 'H',
    margin: 3,
  }),
);

const userStore = useUserStore();

const userInfo = computed(() => userStore.userInfo);

const { isMobile } = useBasicLayout();

const handlePayCancel = async () => {
  try {
    await api.cancelOrderApi(state.orderDetail.id);
    state.showModal = false;
    handleAfterLeave();
    $message.success('订单取消成功');
  } catch (error) {
    console.error(error);
    $message.success('取消订单失败，请稍后重试');
  }
};

const destroyed = () => {
  clearTimeout(pollingST);
  pollingST = null;
};

const handleOrder = async (id) => {
  state.showModal = true;
  state.orderLoading = true;
  try {
    let res = await api.postOrderApi({ product_id: id });
    state.orderLoading = false;
    console.log(res);
    state.orderDetail = res;
    state.qrCode = res.code_url;
    polling(res.id);
  } catch (error) {
    console.error(error);
  }
};

const bodyStyle = {
  width: '600px',
};

const handleClose = () => {
  state.showModal = false;
  handleAfterLeave();
};

// 关闭后更新页面数据
const handleAfterLeave = async () => {
  destroyed();
};

onMounted(async () => {
  try {
    const products = await api.getProductListApi();
    // await userStore.getUserInfo();

    state.products = products
      .map((item) => {
        const price = item.price / 100;
        const isDiscount = item.description !== '1';
        const mostPopular = price === 100;

        return {
          id: item.id,
          name: item.name,
          price,
          description: item.description,
          callCount: item.call_count,
          originalPrice: price / Number(item.description),
          isDiscount,
          mostPopular,
        };
      })
      .sort((a, b) => a.price - b.price);
  } catch (err) {
    console.error(err);
  }
});
</script>
