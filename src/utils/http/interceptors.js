/* eslint-disable prefer-promise-reject-errors */
import { getToken } from '@/utils';
import { resolveResError } from './helpers';

export function reqResolve(config) {
  // 处理不需要token的请求
  if (config.noNeedToken) {
    return config;
  }

  const token = getToken();
  if (!token) {
    return Promise.reject({ code: 401, message: '登录已过期，请重新登录！' });
  }

  /**
   * * 加上 token
   * ! 认证方案: JWT Bearer
   */
  config.headers.Authorization = 'Bearer ' + token;
  config.headers['Accept'] = 'application/json';

  return config;
}

export function reqReject(error) {
  return Promise.reject(error);
}

export function resResolve(response) {
  // TODO: 处理不同的 response.headers
  const { data, status, config, statusText } = response;
  if (status >= 400) {
    const code = status;

    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, data?.message ?? statusText);

    /** 需要错误提醒 */
    !config.noNeedTip && window.$message?.error(message);
    return Promise.reject({ status, message, error: data || response });
  }
  return Promise.resolve(data);
}

export function resReject(error) {
  if (!error || !error.response) {
    const code = error?.code;
    /** 根据code处理对应的操作，并返回处理后的message */
    const message = resolveResError(code, error.message);
    window.$message?.error(message);
    return Promise.reject({ code, message, error });
  }
  const { data, status, config } = error.response;
  const code = data?.code ?? status;
  const message = resolveResError(code, data?.message ?? error.message);
  /** 需要错误提醒 */
  !config?.noNeedTip && window.$message?.error(message);
  return Promise.reject({ code, message, error: error.response?.data || error.response });
}
