export const RouteNames = {
  login: 'login',
  home: 'home',
  // works
  worksList: 'works',
  // sales
  salesDashboard: 'sales-dashboard',
  salesClients: 'clients',
  salesInvoices: 'clients-invoices',
  salesPayments: 'clients-payments',
  // hr
  hrDashboard: 'hr-dashboard',
  hrWorkers: 'workers',
  hrTimesheet: 'timesheet',
  hrWages: 'wages',
} as const;

export const RoutePaths = {
  login: '/login',
  home: '/',
  works: {
    list: '/works/list',
  },
  sales: {
    dashboard: '/sales/dashboard',
    clients: '/sales/clients',
    invoices: '/sales/client-invoices',
    payments: '/sales/client-payments',
  },
  hr: {
    dashboard: '/hr/dashboard',
    workers: '/hr/workers',
    timesheet: '/hr/timsheet',
    wages: '/hr/wages',
  },
} as const;
