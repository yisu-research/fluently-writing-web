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
  getChatListApi: (data) => request.get('/api/conversations', { noNeedTip: true, params: data }),

  // 删除对话
  deleteChatApi: (id) => request.put(`/api/conversations/${id}/inactive`, { noNeedTip: true }),

  // 更新对话
  updateChatApi: (id, data) => request.put(`/api/conversations/${id}`, data, { noNeedTip: true }),

  // 消息流
  getMessageStreamApi: (data) => request.get('/api/messages/stream', { noNeedTip: true, data: data, params: data }),

  // 获取消息列表
  getMessageListApi: (data) => request.get('/api/messages', { noNeedTip: true, params: data, data: data }),

  // 用户详情
  getUserInfoApi: () => request.get('/api/users/current', { noNeedTip: true, noNeedToken: false }),

  // 生成邀请码
  createInviteCodeApi: (data) => request.post('/api/users/invite', data, { noNeedTip: true }),

  // 产品列表
  getProductListApi: (data) => request.get('/api/products', data, { noNeedTip: true }),

  // 订单列表
  getOrderListApi: (data) => request.get('/api/orders', { noNeedTip: true, params: data }),

  // 创建订单
  postOrderApi: (data) => request.post('/api/orders', data, { noNeedTip: true }),

  // 取消未支付订单
  cancelOrderApi: (id) => request.post(`/api/orders/${id}/cancel`, { noNeedTip: true }),

  // 订单详情
  getOrderDetailApi: (id) => request.get(`/api/orders/${id}`, { noNeedTip: true }),

  // 邀请奖励
  getInviteIncomeApi: (data) => request.get('/api/incomes', data, { noNeedTip: true }),

  // 发送验证码
  postVerificationApi: (data) => request.post('/api/verifications', data, { noNeedTip: true }),
};
