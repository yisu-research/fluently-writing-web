import { getProxyConfig } from '../../settings';

export function createViteProxy(isUseProxy = true, proxyType) {
  if (!isUseProxy) return undefined;

  console.log(proxyType);
  const proxyConfig = getProxyConfig(proxyType);
  console.log(proxyConfig);
  const proxy = {
    [proxyConfig.prefix]: {
      target: proxyConfig.target,
      changeOrigin: true,
      // rewrite: (path) => path.replace(/^\/api/, '/api'),
    },
  };
  return proxy;
}
