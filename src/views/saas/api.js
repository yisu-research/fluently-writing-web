import { request } from '@/utils';

export default {
  sendCodeApi: (data) => request.post('/short_messages', data, { noNeedTip: true, noNeedToken: true }),
};
