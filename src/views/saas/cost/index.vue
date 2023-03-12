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
              <div class="py-2 bg-white shadows ov-8erflow-hidden sm:rounded-md">
                <ul role="list" class="divide-y divide-gray-200">
                  <li v-for="position in state.orders" :key="position.id">
                    <div
                      class="block hover:bg-gray-50"
                      @click="position.state !== 'pending' ? () => {} : handleUnpaid(position.code_url)"
                    >
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
              </div>
              <div
                class="grid max-w-md grid-cols-1 mx-auto mt-10 gap-9 isolate md:max-w-2xl lg:grid-cols-3 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-3"
              >
                <div
                  v-for="tier in state.products"
                  :key="tier.id"
                  :class="[
                    tier.mostPopular
                      ? 'ring-2 ring-teal-500 hover:shadow-lg delay-100 duration-200 hover:scale-105'
                      : 'ring-1 ring-gray-200 hover:shadow-lg delay-100 duration-200 hover:scale-105',
                    'rounded-2xl p-8',
                  ]"
                >
                  <h3 :id="tier.id" :class="['text-gray-900', 'text-lg font-semibold leading-8']">
                    <span
                      v-if="tier.mostPopular"
                      :class="['animate-pulse', 'text-teal-500', 'text-2xl font-bold leading-8 mr-2 ']"
                      >早鸟价!</span
                    >{{ tier.name }}
                  </h3>
                  <p class="mt-4 text-sm leading-6 text-gray-600">{{ tier.description }}</p>
                  <p class="flex items-baseline mt-6 gap-x-1">
                    <span class="text-4xl font-bold tracking-tight text-gray-900">{{ `￥ ${tier.price}` }}</span>
                    <span class="text-sm font-semibold leading-6 text-gray-600">{{ `/ ${tier.tokens} 字符` }}</span>
                  </p>
                  <a
                    :aria-describedby="tier.id"
                    :class="[
                      tier.mostPopular
                        ? 'bg-teal-500 text-white shadow-sm hover:bg-teal-500'
                        : 'text-teal-600 ring-1 ring-inset ring-gray-200 hover:ring-teal-500 hover:ring-2',
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
                      <div class="flex justify-end">
                        <n-button strong secondary round type="success" @click="handlePaySuccess"> 支付成功 </n-button>
                      </div>
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
});

const stateMap = {
  pending: '待支付',
  paid: '已支付',
  canceled: '已取消',
  closed: '已关闭',
};

const handleUnpaid = (url) => {
  state.showModal = true;
  text.value = url;
};

const handleOrder = async (id) => {
  state.showModal = true;

  try {
    let res = await api.postOrderApi({ product_id: id });
    console.log(res);
    text.value = res.code_url;
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
  const res = await api.getOrderListApi();
  state.orders = [];
  state.orders = res;
};
onMounted(async () => {
  const data = await api.getProductListApi();
  const res = await api.getOrderListApi();

  state.orders = res;

  for (let i = 0; i < data.length; i++) {
    const item = data[i];

    item.price = item.price / 100;
    let obj = {};
    obj['id'] = item.id;
    obj['name'] = item.name;
    obj['price'] = item.price;
    obj['tokens'] = item.tokens;
    obj['description'] = item.description;
    if (item.id === 1) {
      obj.mostPopular = true;
    } else {
      obj.mostPopular = false;
    }
    state.products.push(obj);
  }
});

const handlePaySuccess = async () => {
  const userStore = useUserStore();
  await userStore.getUserInfo();
  stats[1].value = `${userStore.maxTokens} 个`;
  state.showModal = false;
};

const stats = reactive([
  { id: 1, name: '', value: '' },
  { id: 2, name: '可用字符数', value: `${userStore.maxTokens} 个` },
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
