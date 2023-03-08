import { request } from '@/utils';

export default {
  // 发送验证码
  sendCodeApi: (data) => request.post('/api/short_messages', data, { noNeedTip: false, noNeedToken: true }),

  // 注册
  signupApi: (data) => request.post('/api/signup', data, { noNeedTip: true, noNeedToken: true }),

  // 登录
  loginApi: (data) => request.post('/api/login', data, { noNeedTip: true, noNeedToken: true }),
};
