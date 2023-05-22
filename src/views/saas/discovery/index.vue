<template>
  <div class="m-4">
    <ul role="list" class="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 bg-slate-100">
      <li
        v-for="(item, index) in shareList"
        :key="item.email"
        class="flex flex-col col-span-1 text-center bg-white divide-y divide-gray-200 rounded-lg shadow"
      >
        <div class="flex flex-col flex-1">
          <img
            class="flex-shrink-0 object-contain object-top w-full h-full rounded-t-md mx-uto"
            :src="item.screenshot"
            alt=""
            @click="onPicture(index)"
          />
        </div>
        <div>
          <div class="flex -mt-px divide-x divide-gray-200">
            <div class="flex flex-1 w-0">
              <div class="flex items-center justify-center flex-1 w-0 gap-4">
                <SvgIcon
                  icon="solar:like-broken"
                  class="hover:text-teal-400 active:text-teal-600"
                  @click="clickLike(item.id)"
                />
                {{ item.likes_count }}
              </div>
            </div>
            <div class="flex flex-1 w-0 -ml-px">
              <div
                class="relative inline-flex items-center justify-center flex-1 w-0 py-4 text-sm font-semibold text-gray-900 border border-transparent rounded-br-lg gap-x-3"
              >
                <n-button text @click="clickShare(index)">
                  <template #icon>
                    <span>
                      <SvgIcon icon="solar:square-share-line-broken" />
                    </span>
                  </template>
                  分享
                </n-button>
              </div>
            </div>
          </div>
        </div>
      </li>
    </ul>
  </div>

  <!-- 分享 -->
  <n-modal v-model:show="showModal">
    <div class="flex flex-col justify-center gap-4 mx-auto item-center sm:max-w-xl">
      <n-button
        class="w-full sm:max-w-xl"
        icon-placement="left"
        strong
        type="info"
        round
        @click="downloadImage(shareList[shareIndex].screenshot)"
      >
        <template #icon>
          <SvgIcon icon="solar:gallery-download-broken" />
        </template>
        下载图片
      </n-button>
    </div>
  </n-modal>

  <!-- 图片 -->
  <n-modal v-model:show="showPicture">
    <div class="flex justify-center">
      <div class="mx-2 sm:max-w-xl">
        <img :src="shareList[pictureIndex].screenshot" alt="" />
      </div>
    </div>
  </n-modal>
</template>

<script setup>
import { SvgIcon } from '@/components/common';
import { onMounted } from 'vue';
import api from '@/views/saas/api.js';

const shareList = ref([]);

const showModal = ref(false);

const showPicture = ref(false);

const pictureIndex = ref(0);

const shareIndex = ref(0);

const onPicture = (i) => {
  pictureIndex.value = i;
  showPicture.value = true;
};

onMounted(async () => {
  shareList.value = await getShares();
});
// 获取分享列表
const getShares = async () => {
  try {
    const res = await api.getShareListApi();
    console.log(res);
    return res.shares;
  } catch (err) {
    console.log(err);
    return [];
  }
};

// 点赞
const clickLike = async (id) => {
  try {
    const res = await api.likeApi(id);
    console.log(res);
    $message.success('点赞成功');
    shareList.value = await getShares();
  } catch (err) {}
};

const clickShare = async (i) => {
  shareIndex.value = i;
  showModal.value = true;
};

const downloadImage = async (dataURL) => {
  // const res = await fetch(dataURL);
  // console.log(res);

  const toDataURL = (url) =>
    fetch(url)
      .then((response) => response.blob())
      .then(
        (blob) =>
          new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onloadend = () => resolve(reader.result);
            reader.onerror = reject;
            reader.readAsDataURL(blob);
          }),
      );
  const res = await toDataURL(dataURL);
  console.log(res);
  // 新建一个a标签
  let oA = document.createElement('a');
  oA.download = Date.now() + '截图'; // 设置下载的文件名
  oA.href = res;
  document.body.appendChild(oA);
  oA.click(); // 模拟点击a标签
  oA.remove(); // 下载之后把创建的元素删除
};
</script>
