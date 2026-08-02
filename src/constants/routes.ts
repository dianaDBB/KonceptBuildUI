export const RouteNames = {
  login: 'login',
  home: 'home',
  works: 'works',
  clients: 'clients',
  clientInvoices: 'clients-invoices',
  clientPayments: 'clients-payments',
  dashboard: 'dashboard',
  workers: 'workers',
  timesheet: 'timesheet',
  wages: 'wages',
} as const;

export const RoutePaths = {
  login: '/login',
  home: '/',
  works: '/works/list',
  clients: '/sales/clients',
  clientInvoices: '/sales/client-invoices',
  clientPayments: '/sales/client-payments',
  dashboard: '/hr/dashboard',
  workers: '/hr/workers',
  timesheet: '/hr/timsheet',
  wages: '/hr/wages',
} as const;
