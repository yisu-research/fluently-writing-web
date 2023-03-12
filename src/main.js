import '@/styles/reset.css';
// import './styles/style.css';
// import './styles/preflight.css';
import 'uno.css';
import 'virtual:svg-icons-register';
import { createApp } from 'vue';
import { setupRouter } from '@/router';
import { setupStore } from '@/store';
import { setupAssets } from './plugins';
import App from './App.vue';

async function setupApp() {
  const app = createApp(App);
  setupAssets();

  setupStore(app);

  await setupRouter(app);

  const meta = document.createElement('meta');
  meta.name = 'naive-ui-style';
  document.head.appendChild(meta);

  app.mount('#app');
}

setupApp();
