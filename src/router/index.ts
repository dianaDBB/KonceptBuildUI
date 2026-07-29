import { createRouter, createWebHistory } from 'vue-router';

import HomeView from '@/components/HomeView.vue';
import LoginView from '@/components/LoginView.vue';
import WorkersView from '@/components/WorkersView.vue';
import ClientsView from '@/components/ClientsView.vue';
import authApi from '@/services/auth-api';
import WorksView from '@/components/WorksView.vue';
import TimesheetsView from '@/components/TimesheetsView.vue';
import WagesView from '@/components/WagesView.vue';
import HrDashboardView from '@/components/HrDashboardView.vue';

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
      path: '/works/list',
      name: 'works',
      component: WorksView,
      meta: { requiresAuth: true },
    },
    {
      path: '/sales/clients',
      name: 'clients',
      component: ClientsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/hr/dashboard',
      name: 'dahsboard',
      component: HrDashboardView,
      meta: { requiresAuth: true },
    },
    {
      path: '/hr/workers',
      name: 'workers',
      component: WorkersView,
      meta: { requiresAuth: true },
    },
    {
      path: '/hr/timsheet',
      name: 'timesheet',
      component: TimesheetsView,
      meta: { requiresAuth: true },
    },
    {
      path: '/hr/wages',
      name: 'wages',
      component: WagesView,
      meta: { requiresAuth: true },
    },
  ],
});

router.beforeEach((to) => {
  if (to.meta.requiresAuth && !authApi.isAuthenticated()) {
    authApi.logout();
    return { name: 'login', query: { redirect: to.fullPath } };
  }

  if (to.name === 'login' && authApi.isAuthenticated()) {
    return { name: 'home' };
  }
});

export default router;
