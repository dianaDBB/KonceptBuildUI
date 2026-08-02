import { createRouter, createWebHistory } from 'vue-router';

import authApi from '@/services/auth-api';
import { RouteNames, RoutePaths } from '@/constants/routes';

const routes = [
  {
    path: RoutePaths.login,
    name: RouteNames.login,
    component: () => import('@/components/LoginView.vue'),
  },
  {
    path: RoutePaths.home,
    name: RouteNames.home,
    component: () => import('@/components/HomeView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RoutePaths.works,
    name: RouteNames.works,
    component: () => import('@/components/WorksView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RoutePaths.clients,
    name: RouteNames.clients,
    component: () => import('@/components/ClientsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RoutePaths.clientInvoices,
    name: RouteNames.clientInvoices,
    component: () => import('@/components/ClientInvoicesView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RoutePaths.clientPayments,
    name: RouteNames.clientPayments,
    component: () => import('@/components/ClientPaymentsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RoutePaths.dashboard,
    name: RouteNames.dashboard,
    component: () => import('@/components/HrDashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RoutePaths.workers,
    name: RouteNames.workers,
    component: () => import('@/components/WorkersView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RoutePaths.timesheet,
    name: RouteNames.timesheet,
    component: () => import('@/components/TimesheetsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RoutePaths.wages,
    name: RouteNames.wages,
    component: () => import('@/components/WagesView.vue'),
    meta: { requiresAuth: true },
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

router.beforeEach((to) => {
  const isAuthenticated = authApi.isAuthenticated();

  if (to.meta.requiresAuth && !isAuthenticated) {
    void authApi.logout();
    return { name: RouteNames.login, query: { redirect: to.fullPath } };
  }

  if (to.name === RouteNames.login && isAuthenticated) {
    return { name: RouteNames.home };
  }
});

export default router;
