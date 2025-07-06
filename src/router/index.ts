import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import LoginPage from '../views/LoginPage.vue'
import RegisterPage from '../views/RegisterPage.vue'
import OwnerDashboard from '../views/OwnerDashboard.vue'
import CustomerDashboard from '../views/CustomerDashboard.vue'
import CustomerManagement from '../views/CustomerManagement.vue'
import ServiceManagement from '../views/ServiceManagement.vue'
import FinancialReports from '../views/FinancialReports.vue'
import LineAuthCallback from '../views/LineAuthCallback.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/login',
    },
    {
      path: '/login',
      name: 'login',
      component: LoginPage,
      meta: { requiresGuest: true },
    },
    {
      path: '/register',
      name: 'register',
      component: RegisterPage,
      meta: { requiresGuest: true },
    },
    {
      path: '/owner',
      name: 'owner-dashboard',
      component: OwnerDashboard,
      meta: { requiresAuth: true, role: 'owner' },
    },
    {
      path: '/customer',
      name: 'customer-dashboard',
      component: CustomerDashboard,
      meta: { requiresAuth: true, role: 'customer' },
    },
    {
      path: '/customers',
      name: 'customers',
      component: CustomerManagement,
      meta: { requiresAuth: true, role: 'owner' },
    },
    {
      path: '/services',
      name: 'services',
      component: ServiceManagement,
      meta: { requiresAuth: true, role: 'owner' },
    },
    {
      path: '/reports',
      name: 'reports',
      component: FinancialReports,
      meta: { requiresAuth: true, role: 'owner' },
    },
    {
      path: '/auth/line/callback',
      name: 'line-auth-callback',
      component: LineAuthCallback,
    },
    {
      path: '/test-login',
      name: 'test-login',
      component: () => import('../views/TestLogin.vue'),
    },
    {
      path: '/about',
      name: 'about',
      component: () => import('../views/AboutView.vue'),
    },
  ],
})

// 路由守衛
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  console.log('路由守衛檢查:', {
    to: to.path,
    isAuthenticated: authStore.isAuthenticated,
    userRole: authStore.userRole,
    meta: to.meta,
  })

  // 檢查是否需要身份驗證
  if (to.meta.requiresAuth) {
    if (!authStore.isAuthenticated) {
      console.log('未登入，重定向到登入頁面')
      next('/login')
      return
    }

    // 檢查角色權限
    if (to.meta.role && authStore.userRole !== to.meta.role) {
      console.log('角色不匹配，重定向')
      // 重定向到對應角色的首頁
      if (authStore.isOwner) {
        next('/owner')
      } else if (authStore.isCustomer) {
        next('/customer')
      } else {
        next('/login')
      }
      return
    }
  }

  // 檢查是否為遊客頁面（登入/註冊）
  if (to.meta.requiresGuest && authStore.isAuthenticated) {
    console.log('已登入用戶訪問登入頁面，重定向到對應首頁')
    // 已登入用戶重定向到對應首頁
    if (authStore.isOwner) {
      next('/owner')
    } else if (authStore.isCustomer) {
      next('/customer')
    }
    return
  }

  console.log('路由檢查通過，繼續導航')
  next()
})

export default router
