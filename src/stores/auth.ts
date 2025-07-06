import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export type UserRole = 'owner' | 'customer' | null

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  lineUserId?: string
  avatar?: string
  phone?: string
  registeredAt: Date
}

export const useAuthStore = defineStore('auth', () => {
  const currentUser = ref<User | null>(null)
  const isAuthenticated = ref(false)

  // 計算屬性
  const userRole = computed(() => currentUser.value?.role)
  const isOwner = computed(() => userRole.value === 'owner')
  const isCustomer = computed(() => userRole.value === 'customer')

  // 登入業主
  function loginAsOwner(userData: Omit<User, 'role' | 'registeredAt'>) {
    const user: User = {
      ...userData,
      role: 'owner',
      registeredAt: new Date(),
    }
    currentUser.value = user
    isAuthenticated.value = true
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  // 登入顧客
  function loginAsCustomer(userData: Omit<User, 'role' | 'registeredAt'>) {
    const user: User = {
      ...userData,
      role: 'customer',
      registeredAt: new Date(),
    }
    currentUser.value = user
    isAuthenticated.value = true
    localStorage.setItem('currentUser', JSON.stringify(user))
  }

  // 登出
  function logout() {
    currentUser.value = null
    isAuthenticated.value = false
    localStorage.removeItem('currentUser')
    localStorage.removeItem('lineAuth')
  }

  // 從 localStorage 恢復用戶狀態
  function restoreUserSession() {
    const storedUser = localStorage.getItem('currentUser')
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser)
        currentUser.value = user
        isAuthenticated.value = true
      } catch (error) {
        console.error('恢復用戶會話失敗:', error)
        logout()
      }
    }
  }

  // 更新用戶資訊
  function updateUser(updates: Partial<User>) {
    if (currentUser.value) {
      currentUser.value = { ...currentUser.value, ...updates }
      localStorage.setItem('currentUser', JSON.stringify(currentUser.value))
    }
  }

  // 初始化時恢復會話
  restoreUserSession()

  return {
    currentUser,
    isAuthenticated,
    userRole,
    isOwner,
    isCustomer,
    loginAsOwner,
    loginAsCustomer,
    logout,
    updateUser,
    restoreUserSession,
  }
})
