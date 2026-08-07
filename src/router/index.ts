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
  // WORKS
  {
    path: RoutePaths.works.list,
    name: RouteNames.worksList,
    component: () => import('@/components/WorksView.vue'),
    meta: { requiresAuth: true },
  },
  // SALES
  {
    path: RoutePaths.sales.dashboard,
    name: RouteNames.salesDashboard,
    component: () => import('@/components/SalesDashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RoutePaths.sales.clients,
    name: RouteNames.salesClients,
    component: () => import('@/components/ClientsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RoutePaths.sales.invoices,
    name: RouteNames.salesInvoices,
    component: () => import('@/components/ClientInvoicesView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RoutePaths.sales.payments,
    name: RouteNames.salesPayments,
    component: () => import('@/components/ClientPaymentsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RoutePaths.sales.clientReport,
    name: RouteNames.salesClientReport,
    component: () => import('@/components/SalesClientReportView.vue'),
    meta: { requiresAuth: true },
  },
  // HR
  {
    path: RoutePaths.hr.dashboard,
    name: RouteNames.hrDashboard,
    component: () => import('@/components/HrDashboardView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RoutePaths.hr.workers,
    name: RouteNames.hrWorkers,
    component: () => import('@/components/WorkersView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RoutePaths.hr.timesheet,
    name: RouteNames.hrTimesheet,
    component: () => import('@/components/TimesheetsView.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: RoutePaths.hr.wages,
    name: RouteNames.hrWages,
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
