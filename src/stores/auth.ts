import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { useServiceDataStore } from './serviceData'

export type UserRole = 'owner' | 'customer' | null

export interface User {
  uuid: string
  name: string
  email: string
  phone: string
  role: UserRole
  lineUserId?: string
  avatar?: string
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
    console.log('業主登入成功:', user)
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
    console.log('顧客登入成功:', user)
  }

  // 通過 UUID 登入（模擬 LINE 登入流程）
  async function loginWithUUID(uuid: string) {
    const serviceDataStore = useServiceDataStore()

    try {
      // 載入服務資料
      await serviceDataStore.loadServiceDataByUUID(uuid)

      // 從服務資料 store 獲取用戶資料
      const userProfile = serviceDataStore.currentUserProfile

      if (userProfile) {
        const user: User = {
          uuid: userProfile.uuid,
          name: userProfile.name,
          email: userProfile.email,
          phone: userProfile.phone,
          role: 'customer',
          registeredAt: userProfile.registeredAt,
        }

        currentUser.value = user
        isAuthenticated.value = true
        localStorage.setItem('currentUser', JSON.stringify(user))
        console.log('用戶登入成功，UUID:', uuid, '用戶資料:', user)
      } else {
        throw new Error('無法獲取用戶資料')
      }
    } catch (error) {
      console.error('登入失敗:', error)
      throw error
    }
  }

  // 登入王小美（使用新的 UUID 方式）
  async function loginAsWangXiaomei() {
    await loginWithUUID('uuid-wang-xiaomei-001')
  }

  // 登入王大美（使用新的 UUID 方式）
  async function loginAsWangDamei() {
    await loginWithUUID('uuid-wang-damei-002')
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

      // 同步更新到服務資料 store
      const serviceDataStore = useServiceDataStore()
      serviceDataStore.updateUserProfile({
        name: updates.name,
        email: updates.email,
        phone: updates.phone,
      })
    }
  }

  // 初始化時恢復會話，如果沒有用戶則自動登入為測試顧客
  async function initializeAuth() {
    restoreUserSession()

    // 如果沒有已登入的用戶，自動登入為王小美
    if (!isAuthenticated.value) {
      console.log('自動登入為王小美...')
      try {
        await loginAsWangXiaomei()
      } catch (error) {
        console.error('自動登入失敗:', error)
      }
    }
  }

  // 初始化認證
  initializeAuth()

  return {
    currentUser,
    isAuthenticated,
    userRole,
    isOwner,
    isCustomer,
    loginAsOwner,
    loginAsCustomer,
    loginWithUUID,
    loginAsWangXiaomei,
    loginAsWangDamei,
    logout,
    updateUser,
    restoreUserSession,
    initializeAuth,
  }
})
