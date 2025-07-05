import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import CustomerManagement from '../views/CustomerManagement.vue'
import ServiceManagement from '../views/ServiceManagement.vue'
import FinancialReports from '../views/FinancialReports.vue'
import CustomerRegister from '../views/CustomerRegister.vue'
import LineAuthCallback from '../views/LineAuthCallback.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView,
    },
    {
      path: '/customers',
      name: 'customers',
      component: CustomerManagement,
    },
    {
      path: '/services',
      name: 'services',
      component: ServiceManagement,
    },
    {
      path: '/reports',
      name: 'reports',
      component: FinancialReports,
    },
    {
      path: '/customer-register',
      name: 'customer-register',
      component: CustomerRegister,
    },
    {
      path: '/auth/line/callback',
      name: 'line-auth-callback',
      component: LineAuthCallback,
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

export default router
