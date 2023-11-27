<template>
  <n-card title="邀请新用户" class="order-3 col-span-12 md:col-span-10 lg:col-span-10 xl:col-span-6 2xl:col-span-5">
    <template #header-extra>
      <div class="flex justify-end gap-4">
        <n-button v-if="userCode" class="ml-4" type="primary" @click="showPromoModal = true">复制邀请文案</n-button>
        <n-button v-else type="primary" :loading="loadInviteCode" @click="handleGetInviteCode"> 生成邀请码 </n-button>
        <n-button type="info" @click="showInvite = true">生成邀请图片</n-button>
      </div>
    </template>
    <p class="mb-4">以下是您的邀请码和邀请链接，新用户通过您的邀请码注册并使用时，您将获得相应的奖励！</p>
    <ul class="list-disc list-inside">
      <li>
        成功邀请新用户<span class="font-bold text-teal-600">完成注册</span>并绑定邮箱，您和新用户都将获得<span
          class="font-bold text-teal-600"
          >&thinsp;10&thinsp;次创作体验！</span
        >
      </li>
      <li>
        您邀请的新用户<span class="font-bold text-teal-600">首次充值</span>时，您将获得<span
          class="font-bold text-teal-600"
          >&thinsp;20%&thinsp;的现金奖励！</span
        >例如，新用户首次充值了&thinsp;100&thinsp;元，您将获得&thinsp;20&thinsp;元的奖励。
      </li>
      <li>现金奖励累积到&thinsp;50&thinsp;元<span class="font-bold text-teal-600">可提现！</span></li>
    </ul>
    <div class="mt-4">
      <span>邀请码：</span>
      <span v-if="userCode" class="ml-1">
        <span>{{ userCode }}</span>
        <span v-if="userCode" class="cursor-pointer hover:text-teal-500" @click="copyToClipboard(userCode)">
          <n-icon class="ml-2 mr-0.5" size="16">
            <icon-ic:baseline-content-copy />
          </n-icon>
          <span>复制</span>
        </span>
      </span>
      <span v-else>点击<span class="font-bold underline">下方按钮</span>以生成邀请码</span>
    </div>
    <div>
      <span>邀请链接：</span>
      <span v-if="userCode" class="ml-1">
        <a :href="inviteLink" target="__blank" class="text-teal-600 hover:underline">
          {{ inviteLink }}
        </a>
        <span class="cursor-pointer hover:text-teal-500" @click="copyToClipboard(inviteLink)">
          <n-icon class="ml-2 mr-0.5" size="16">
            <icon-ic:baseline-content-copy />
          </n-icon>
          <span>复制</span>
        </span>
      </span>
      <span v-else>点击<span class="font-bold underline">下方按钮</span>以生成邀请链接</span>
    </div>
  </n-card>

  <n-modal v-model:show="showPromoModal">
    <n-card style="width: 600px" title="邀请文案" :bordered="false" size="huge" role="dialog" aria-modal="true">
      <template #header-extra>
        <n-button strong secondary class="text-md" @click="showPromoModal = false">
          <icon-ic:sharp-close />
        </n-button>
      </template>
      <div class="p-4 border-teal-600 border-dashed rounded-md border-3">
        <p>{{ invitePromo }}</p>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <n-button type="primary" @click="copyToClipboard(invitePromo)">复制邀请文案</n-button>
        </div>
      </template>
    </n-card>
  </n-modal>

  <!-- 邀请图片 -->
  <n-modal v-model:show="showInvite">
    <div>
      <div id="invite-image" class="overflow-hidden shadow">
        <div class="relative">
          <img :src="inviteImg" alt="phone" class="relative w-80" />
          <vue-qr
            class="absolute bottom-4 right-10"
            :logoSrc="Logo"
            :text="inviteLink"
            :callback="test"
            qid="testid"
            :size="90"
            :margin="10"
          ></vue-qr>
        </div>
      </div>
      <n-button
        class="w-full h-12 my-4 sm:max-w-xl"
        icon-placement="left"
        strong
        type="info"
        round
        @click="downloadImage()"
      >
        <template #icon>
          <SvgIcon icon="solar:gallery-download-broken" />
        </template>
        下载图片
      </n-button>
    </div>
  </n-modal>
</template>

<script setup>
import { ref, computed } from 'vue';
import { copyToClipboard } from '@/utils';
import { useMessage } from 'naive-ui';
import { useUserStore } from '@/store';

import { SvgIcon } from '@/components/common';
import vueQr from 'vue-qr/src/packages/vue-qr.vue';
import Logo from '@/assets/svg/logo.svg';
import html2canvas from 'html2canvas';
import inviteImg from '@/assets/images/invite.png';

const message = useMessage();
const showPromoModal = ref(false);

const userStore = useUserStore();
const userCode = computed(() => userStore.userInfo.invite_code);

const loadInviteCode = ref(false);
const showInvite = ref(false);
const handleGetInviteCode = async () => {
  loadInviteCode.value = true;
  try {
    const res = await api.createInviteCodeApi();
    userStore.setUserInfo(res);
  } catch (err) {
    console.error(err);
    message.error(`邀请码生成失败，${err.error.message}`);
  }
  loadInviteCode.value = false;
};

const inviteLink = computed(() => `https://ai.yisukeyan.com/signup?invite_code=${userCode.value}`);

const invitePromo = computed(
  () =>
    `向大家强烈推荐一个方便好用的 ChatGPT 工具，叫一粟创作助手。写作业、写材料、写代码，都能轻松搞定！助力工作、学习、生活，创作无极限！海量模板，迸发灵感，提升效率！详情可见：https://ai.yisukeyan.com/。通过下方链接注册还可获赠 10 次免费体验：${inviteLink.value}`,
);

const downloadImage = () => {
  const inviteImage = document.getElementById('invite-image');
  html2canvas(inviteImage, {
    width: inviteImage.offsetWidth,
    height: inviteImage.offsetHeight,
  }).then((canvas) => {
    const dataURL = canvas.toDataURL('image/png');
    console.log(dataURL);
    download(dataURL);
  });
};

const download = (dataURL) => {
  // 新建一个a标签
  let oA = document.createElement('a');
  oA.download = Date.now() + '截图'; // 设置下载的文件名
  oA.href = dataURL;
  document.body.appendChild(oA);
  oA.click(); // 模拟点击a标签
  oA.remove(); // 下载之后把创建的元素删除
};
</script>
