import { request } from '@/utils';

export default {
  // 发送验证码
  sendCodeApi: (data) => request.post('/api/short_messages', data, { noNeedTip: false, noNeedToken: true }),

  // 注册
  signupApi: (data) => request.post('/api/signup', data, { noNeedTip: true, noNeedToken: true }),

  // 登录
  loginApi: (data) => request.post('/api/login', data, { noNeedTip: true, noNeedToken: true }),

  // 创建对话
  postChatApi: (data) => request.post('/api/conversations', data, { noNeedTip: true }),

  // 获取对话列表
  getChatListApi: (data) => request.get('/api/conversations', data, { noNeedTip: true }),

  // 更新对话
  updateChatApi: (data) => request.put('/api/conversations/:id', data, { noNeedTip: true }),

  // 发送消息
  postMessageApi: (data) => request.post('/api/messages', data, { noNeedTip: true }),

  // 获取消息列表
  getMessageListApi: (data) => request.get('/api/messages', data, { noNeedTip: true }),

  // 用户详情
  getUserInfoApi: () => request.get('/api/user', { noNeedTip: true, noNeedToken: false }),

  // 产品列表
  getProductListApi: (data) => request.get('/api/products', data, { noNeedTip: true }),

  // 订单列表
  getOrderListApi: (data) => request.get('/api/orders', data, { noNeedTip: true }),

  // 创建订单
  postOrderApi: (data) => request.post('/api/orders', data, { noNeedTip: true }),

  // 取消未支付订单
  cancelOrderApi: (data) => request.delete('/api/orders/:id', data, { noNeedTip: true }),

  // 订单详情
  getOrderDetailApi: (data) => request.get('/api/orders/:id', data, { noNeedTip: true }),
};
