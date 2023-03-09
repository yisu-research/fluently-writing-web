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
                  <dd class="order-first text-3xl font-semibold tracking-tight text-white sm:text-5xl">
                    {{ stat.value }}
                  </dd>
                </div>
              </dl>
            </div>
          </div>

          <!-- 订单趋势 -->
          <div class="m-4 my-8 overflow-hidden bg-white divide-y divide-gray-100 rounded-lg shadow-lg">
            <div class="px-4 py-5 sm:px-6">消费趋势</div>
            <div class="px-4 py-5 bg-gray-100 sm:p-6 h-96">图表</div>
          </div>
          <div class="py-24 bg-white sm:py-32">
            <div class="px-6 mx-auto max-w-7xl lg:px-8">
              <div class="max-w-4xl mx-auto text-center">
                <p class="mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl">购买字符</p>
              </div>
              <div
                class="grid max-w-md grid-cols-1 gap-8 mx-auto mt-10 isolate md:max-w-2xl md:grid-cols-2 lg:max-w-4xl xl:mx-0 xl:max-w-none xl:grid-cols-4"
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
import { NLayout, NLayoutContent } from 'naive-ui';
import { useBasicLayout } from '@/hooks/useBasicLayout';
import { useUserStore } from '@/store';

import api from '../api';
import { useQRCode } from '@vueuse/integrations/useQRCode';

// `qrcode` will be a ref of data URL
const text = ref('请求错误！');
const qrcode = useQRCode(text);

const userStore = useUserStore();

const { isMobile } = useBasicLayout();

const state = reactive({
  products: [],
  showModal: false,
});

const handleOrder = async (id) => {
  state.showModal = true;
  console.log(id);

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
const handleAfterLeave = () => {};
onMounted(async () => {
  const data = await api.getProductListApi();
  // const res = await api.getOrderListApi();

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
