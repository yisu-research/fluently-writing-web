const proxyConfigMappings = {
  dev: {
    prefix: '/api',
    target: 'https://ai.yisukeyan.com',
  },
  test: {
    prefix: '/api',
    target: 'http://localhost:8080',
  },
  prod: {
    prefix: '/api',
    target: 'https://ai.yisukeyan.com',
  },
};

export function getProxyConfig(envType = 'dev') {
  return proxyConfigMappings[envType];
}
