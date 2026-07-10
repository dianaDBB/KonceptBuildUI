import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/components/HomeView.vue';
import WorkersView from '@/components/WorkersView.vue';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/hr/workers',
      name: 'workers',
      component: WorkersView,
    },
  ],
});

export default router;
