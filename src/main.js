import { createApp } from 'vue';
import { createPinia } from 'pinia';

import App from './App.vue';
import router from './router';

import './assets/style.css';

const app = createApp(App);

await setTimeout(() => {
  app.config.globalProperties.$message.success('hello');
}, 5000);

app.use(createPinia());
app.use(router);

const meta = document.createElement('meta');
meta.name = 'naive-ui-style';
document.head.appendChild(meta);

app.mount('#app');
