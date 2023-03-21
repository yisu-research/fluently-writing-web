<!-- eslint-disable vue/no-duplicate-attributes -->
<template>
  <div class="h-full transition-all" :class="[isMobile ? 'p-0' : 'p-4']">
    <div class="h-full overflow-hidden" :class="getMobileClass">
      <NLayout class="z-40 transition" :class="getContainerClass" has-sider>
        <NLayoutContent class="h-full bg-blue-50/[0.3]">
          <!-- 剩余字符数 -->
          <div class="py-20 bg-teal-500/[0.9] sm:py-16">
            <div class="max-w-4xl px-6 mx-auto lg:px-8">
              <dl class="grid grid-cols-1 text-center gap-y-16 gap-x-8 lg:grid-cols-3">
                <div v-for="stat in stats" :key="stat.id" class="flex flex-col max-w-xs mx-auto gap-y-4">
                  <dt class="text-base leading-7 text-gray-100">{{ stat.name }}</dt>
                  <dd class="order-first text-3xl font-semibold tracking-tight text-white sm:text-4xl">
                    {{ stat.value }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- 订单趋势 -->
          <div class="m-4 my-8 overflow-hidden bg-white divide-y divide-gray-100 rounded-lg shadow-lg">
            <div class="px-4 py-5 text-xl font-bold bg-gray-100 sm:px-6">消费记录</div>
            <n-scrollbar class="max-h-96">
              <div class="py-2 bg-white shadows overflow-hidden sm:rounded-md">
                <ul role="list" class="divide-y divide-gray-200">
                  <li v-for="position in state.orders" :key="position.id">
                    <div class="block hover:bg-gray-50" @click="handleUnpaid(position.id)">
                      <div class="px-4 py-4 sm:px-6">
                        <div class="flex items-center justify-between">
                          <p class="text-sm font-medium text-teal-500 truncate">{{ position.product_name }}</p>
                          <div class="flex flex-shrink-0 ml-2">
                            <p
                              class="inline-flex px-2 text-xs font-semibold leading-5 text-teal-800 bg-green-200 rounded-full"
                            >
                              {{ stateMap[position.state] }}
                            </p>
                          </div>
                        </div>

                        <div class="mt-2 md:flex sm:justify-between">
                          <div class="sm:flex">
                            <p class="flex items-center mr-4 text-sm text-gray-500">
                              <span class="mr-1">
                                <SvgIcon icon="majesticons:translate" />
                              </span>
                              {{ position.product_tokens }} 字符
                            </p>
                          </div>
                          <div class="sm:flex">
                            <p class="flex items-center text-sm text-gray-500">
                              <span class="mr-1">
                                <SvgIcon icon="icon-park-twotone:transaction-order" />
                              </span>
                              {{ position.out_trade_no }}
                            </p>
                          </div>
                          <div class="flex items-center mt-2 text-sm text-gray-500 sm:mt-0">
                            <span>
                              <SvgIcon icon="ph:timer-duotone" />
                            </span>
                            {{ formatDateTime(position.created_at) }}
                          </div>
                        </div>
                      </div>
                    </div>
                    <n-modal
                      v-model:show="state.orderModal"
                      class="custom-card"
                      preset="card"
                      :style="bodyStyle"
                      title="订单详情"
                      size="huge"
                      :bordered="false"
                      :segmented="segmented"
                      :mask-closable="false"
                      :on-close="handleClose"
                    >
                      <template #header-extra></template>
                      <div class="text-md">
                        <p class="my-2 text-gray-800">
                          订单名称：<span>{{ state.orderDetail.product_name }}</span>
                        </p>
                        <p class="my-2 text-gray-800">
                          订单编号：<span>{{ state.orderDetail.out_trade_no }}</span>
                        </p>
                        <p class="my-2 text-gray-800">
                          订单的价格：<span>￥ {{ state.orderDetail.product_price }}</span>
                        </p>
                        <p class="my-2 text-gray-800">
                          购买字符数：<span>{{ state.orderDetail.product_tokens }}</span>
                        </p>
                        <p class="my-2 text-gray-800">
                          订单状态：<span>{{ stateMap[state.orderDetail.state] }}</span>
                        </p>
                      </div>
                      <div v-if="state.orderDetail.state === 'pending'">
                        <div class="flex items-center justify-center">
                          <img :src="qrcode" alt="QR Code" class="w-40 h-40" />
                        </div>
                        <div class="flex items-center justify-center">
                          <p>使用微信扫一扫支付</p>
                        </div>
                      </div>
                      <template #footer>
                        <div class="flex justify-end">
                          <n-popconfirm
                            v-if="state.orderDetail.state === 'pending'"
                            placement="bottom"
                            @positive-click="handlePayCancel(1)"
                          >
                            <template #trigger>
                              <n-button strong secondary round type="warning" class="mr-4"> 取消支付 </n-button>
                            </template>
                            确定取消支付?
                          </n-popconfirm>
                        </div>
                      </template>
                    </n-modal>
                  </li>
                </ul>
              </div>
            </n-scrollbar>
          </div>

          <!-- 购买字符 -->
          <div class="py-8 m-4 bg-white border-gray-200 rounded-md sm:py-8 border-1">
            <div class="px-6 mx-auto max-w-7xl lg:px-8">
              <div class="max-w-4xl mx-auto text-center">
                <p class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">购买字符</p>
                <div :class="['animate-pulse', 'text-teal-500', 'text-2xl font-bold leading-8 mt-4']">
                  早期尝鲜价格!
                </div>
              </div>
              <div
                class="grid max-w-md grid-cols-1 mx-auto mt-10 gap-9 isolate md:max-w-2xl lg:grid-cols-3 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-3"
              >
                <div
                  v-for="tier in state.products"
                  :key="tier.id"
                  :class="[
                    tier.mostPopular
                      ? 'ring-4 ring-teal-400 bg-teal-50 hover:shadow-lg delay-100 duration-200 hover:scale-105'
                      : 'ring-1 ring-gray-200 hover:ring-2 hover:ring-teal-400 hover:shadow-lg delay-100 duration-200 hover:scale-105',
                    'rounded-2xl p-8',
                  ]"
                >
                  <div class="flex items-center justify-start">
                    <h3 :id="tier.id" :class="['text-gray-900', 'text-lg font-semibold leading-8']">
                      {{ tier.name }}
                    </h3>
                    <p class="ml-4 text-lg leading-6 text-rose-600">{{ tier.description }}</p>
                  </div>

                  <p class="flex items-baseline mt-6 gap-x-1">
                    <span class="text-4xl font-bold tracking-tight text-gray-900">{{ `￥ ${tier.price}` }}</span>
                    <span class="text-sm font-semibold leading-6 text-gray-600">{{ `/ ${tier.tokens} 字符额度` }}</span>
                  </p>
                  <a
                    :aria-describedby="tier.id"
                    :class="[
                      tier.mostPopular
                        ? 'bg-teal-400 text-white shadow-sm hover:bg-teal-500'
                        : 'text-teal-600 ring-1 ring-inset ring-gray-200',
                      'mt-6 block rounded-md py-2 px-3 text-center text-sm font-semibold leading-6 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600',
                    ]"
                    @click="handleOrder(tier.id)"
                    >立即购买</a
                  >
                  <n-modal
                    v-model:show="state.showModal"
                    class="custom-card"
                    preset="card"
                    :style="bodyStyle"
                    title="微信支付"
                    size="huge"
                    :bordered="false"
                    :segmented="segmented"
                    :on-after-leave="handleAfterLeave"
                    :mask-closable="false"
                    :on-close="handleClose"
                  >
                    <template #header-extra></template>
                    <div class="flex items-center justify-center">
                      <img :src="qrcode" alt="QR Code" class="w-40 h-40" />
                    </div>
                    <div class="flex items-center justify-center">
                      <p>使用微信扫一扫支付</p>
                    </div>
                    <template #footer>
                      <n-popconfirm
                        v-if="state.productState === 'pending'"
                        placement="bottom"
                        @positive-click="handlePayCancel(2)"
                      >
                        <template #trigger>
                          <n-button strong secondary round type="warning" class="mr-4"> 取消支付 </n-button>
                        </template>
                        确定取消支付?
                      </n-popconfirm>
                    </template>
                  </n-modal>
                </div>
              </div>
            </div>
          </div>
        </NLayoutContent>
      </NLayout>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted, reactive } from 'vue';
import { NLayout, NLayoutContent, NButton } from 'naive-ui';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { useUserStore } from '@/store';
import { formatDateTime } from '@/utils';

import api from '../api';
import { useQRCode } from '@vueuse/integrations/useQRCode';

// `qrcode` will be a ref of data URL
const text = ref('请求错误！');
const qrcode = useQRCode(text);

const userStore = useUserStore();

const { isMobile } = useBasicLayout();

const state = reactive({
  products: [],
  orders: [],
  showModal: false,
  orderModal: false,
  orderDetail: {},
  pollingST: null,
  productId: null,
  productState: null,
  orderId: null,
});

const stateMap = {
  pending: '待支付',
  paid: '已支付',
  canceled: '已取消',
  closed: '已关闭',
};

const handlePayCancel = async (index) => {
  try {
    if (index === 1) {
      await api.cancelOrderApi(state.orderDetail.product_id);
    } else {
      await api.cancelOrderApi(state.orderId);
    }
    state.showModal = false;
    state.orderModal = false;
  } catch (error) {
    console.log(error);
  }
};

const handleUnpaid = async (id) => {
  state.orderModal = true;
  try {
    let res = await api.getOrderDetailApi(id);
    console.log(res);
    state.orderDetail = res;
    text.value = res.code_url;
  } catch (err) {
    console.log(err);
  }
  console.log(id);
  // text.value = url;
};

const destroyed = () => {
  clearTimeout(state.pollingST);
};

const polling = (id) => {
  api.getOrderDetailApi(id).then((res) => {
    if (res.state !== 'pending') {
      console.log('支付成功');
      state.showModal = false;
      destroyed();
    }
    state.pollingST = setTimeout(() => {
      clearTimeout(state.pollingST);
      polling(id);
    }, 5000);
  });
};

const handleOrder = async (id) => {
  state.showModal = true;
  state.productId = id;
  try {
    let res = await api.postOrderApi({ product_id: id });
    console.log(res);
    text.value = res.code_url;
    state.productState = res.state;
    state.orderId = res.product_id;
    polling(res.id);
  } catch (error) {}
};

const bodyStyle = {
  width: '600px',
};

const segmented = {
  content: 'soft',
  footer: 'soft',
};

const handleClose = () => {
  state.showModal = false;
};

// 关闭后更新页面数据
const handleAfterLeave = async () => {
  destroyed();
  const res = await api.getOrderListApi();
  state.orders = [];
  state.orders = res;
  state.orderDetail = {};
  state.pollingST = null;
  state.productId = null;
  state.productState = null;
  state.orderId = null;
  const userStore = useUserStore();
  await userStore.getUserInfo();
  stats[1].value = `${userStore.maxTokens} 个`;
};
onMounted(async () => {
  const data = await api.getProductListApi();
  const res = await api.getOrderListApi();

  console.log(data);

  state.orders = res;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];
    if (item.price === 100 || item.price === 1000 || item.price === 10000) {
      item.price = item.price / 100;
      let obj = {};
      obj['id'] = item.id;
      obj['name'] = item.name;
      obj['price'] = item.price;
      obj['tokens'] = item.tokens;
      if (item.price === 1) obj['description'] = '';
      if (item.price === 10) obj['description'] = '8折优惠';
      if (item.price === 100) obj['description'] = '1折优惠';

      if (item.price === 100) {
        obj.mostPopular = true;
      } else {
        obj.mostPopular = false;
      }
      state.products.push(obj);
    }
  }
});

const stats = reactive([
  { id: 1, name: '', value: '' },
  { id: 2, name: '可用字符额度', value: `${userStore.maxTokens} 个` },
  { id: 3, name: '', value: '' },
]);

const getMobileClass = computed(() => {
  if (isMobile.value) return ['rounded-none', 'shadow-none'];
  return ['border', 'rounded-md', 'shadow-md'];
});

const getContainerClass = computed(() => {
  return ['h-full'];
});
</script>
