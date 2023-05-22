const proxyConfigMappings = {
  dev: {
    prefix: '/api',
    // target: 'https://ai.yisukeyan.com',
    target: 'http://8.142.167.132:3001',
  },
  test: {
    prefix: '/api',
    target: 'http://8.142.167.132:3001',
  },
  prod: {
    prefix: '/api',
    target: 'https://ai.yisukeyan.com',
  },
};

export function getProxyConfig(envType = 'dev') {
  return proxyConfigMappings[envType];
}
