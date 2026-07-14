import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/components/HomeView.vue';
import LoginView from '@/components/LoginView.vue';
import WorkersView from '@/components/WorkersView.vue';
import api from '@/services/api';

const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: '/login',
      name: 'login',
      component: LoginView,
    },
    {
      path: '/',
      name: 'home',
      component: HomeView,
      meta: { requiresAuth: true },
    },
    {
      path: '/hr/workers',
      name: 'workers',
      component: WorkersView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !api.isAuthenticated()) {
    api.logout();
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.name === 'login' && api.isAuthenticated()) {
    return { name: 'home' };
  }
});

export default router;
