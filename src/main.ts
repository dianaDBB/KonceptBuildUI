import { createApp } from 'vue';
import App from './App.vue';
import './assets/styles/main.scss';
import router from './router';
import { loadConfigs } from './composables/useConfigs.ts';

async function bootstrap() {
  await loadConfigs();

  const app = createApp(App);
  app.use(router);
  app.mount('#app');
}

bootstrap();
