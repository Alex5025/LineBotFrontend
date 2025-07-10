import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

// 地址介面
export interface Address {
  street: string
  city: string
  state: string
  zip: string
}

// 服務項目介面
export interface Service {
  service_name: string
  service_ID: string
  amount: number
  status: 'completed' | 'scheduled' | 'cancelled'
  date: string
  timeStart: string
  timeEnd: string
  description: string
  notes: string
}

// 服務提供者介面
export interface ServiceProvider {
  name: string
  tel: string
  cell: string
  lineLink: string
  address: Address
  services: Service[]
}

// 服務資���回應介面
export interface ServiceDataResponse {
  ServiceInfo: ServiceProvider[]
}

// 用戶個人資料介面（基於服務資料推導）
export interface UserProfile {
  uuid: string
  name: string
  phone: string
  email: string
  address: string
  preferredServices: string[]
  totalSpent: number
  lastVisit?: Date
  registeredAt: Date
}

export const useServiceDataStore = defineStore('serviceData', () => {
  // 當前用戶 UUID
  const currentUserUUID = ref<string>('')

  // 服務資料
  const serviceData = ref<ServiceDataResponse | null>(null)

  // 當前用戶個人資料
  const currentUserProfile = ref<UserProfile | null>(null)

  // 載入狀態
  const isLoading = ref(false)
  const error = ref<string | null>(null)

  // 模擬的服務資料（之後會從 API 取得）
  const mockServiceData: ServiceDataResponse = {
    ServiceInfo: [
      {
        name: '哆啦美容美體中心',
        tel: '123-456-7890',
        cell: '098-765-4321',
        lineLink: 'https://line.me/ti/p/1234567890',
        address: {
          street: '123 Example St',
          city: 'Example City',
          state: 'EX',
          zip: '12345',
        },
        services: [
          {
            service_name: '深層清潔護膚療程',
            service_ID: 'SB001',
            amount: 1500,
            status: 'completed',
            date: '2025-12-01',
            timeStart: '10:00 AM',
            timeEnd: '11:30 AM',
            description: '90分鐘深層清潔護膚療程',
            notes: '效果很好，皮膚變得更光滑',
          },
          {
            service_name: '全身按摩',
            service_ID: 'SB002',
            amount: 2000,
            status: 'scheduled',
            date: '2025-08-05',
            timeStart: '02:00 PM',
            timeEnd: '03:00 PM',
            description: '60分鐘全身放鬆按摩',
            notes: '需要特別注意肩頸部位',
          },
          {
            service_name: '美甲服務',
            service_ID: 'SB003',
            amount: 800,
            status: 'completed',
            date: '2025-10-10',
            timeStart: '11:00 AM',
            timeEnd: '12:00 PM',
            description: '美甲和手部護理服務',
            notes: '',
          },
          {
            service_name: '深層護髮護理',
            service_ID: 'SB004',
            amount: 2200,
            status: 'completed',
            date: '2025-08-05',
            timeStart: '09:00 AM',
            timeEnd: '10:30 AM',
            description: '90分鐘深層修護護髮療程',
            notes: '髮質明顯改善，光澤度增加',
          },
          {
            service_name: '臉部SPA護理',
            service_ID: 'SB005',
            amount: 1800,
            status: 'scheduled',
            date: '2025-06-15',
            timeStart: '03:00 PM',
            timeEnd: '04:30 PM',
            description: '90分鐘臉部深層護理',
            notes: '夏季護膚專案',
          },
        ],
      },
      {
        name: '大肌肌健身房',
        tel: '987-654-3210',
        cell: '012-345-6789',
        lineLink: 'https://line.me/ti/p/0987654321',
        address: {
          street: '456 Sample Ave',
          city: 'Sample City',
          state: 'SA',
          zip: '67890',
        },
        services: [
          {
            service_name: '個人訓練課程',
            service_ID: 'SB006',
            amount: 2500,
            status: 'scheduled',
            date: '2025-08-10',
            timeStart: '09:00 AM',
            timeEnd: '10:00 AM',
            description: '60分鐘個人訓練課程',
            notes: '需要攜帶運動鞋和水壺',
          },
          {
            service_name: '瑜伽課程',
            service_ID: 'SB007',
            amount: 1200,
            status: 'completed',
            date: '2025-10-15',
            timeStart: '06:00 PM',
            timeEnd: '07:00 PM',
            description: '60分鐘瑜伽放鬆課程',
            notes: '',
          },
          {
            service_name: '體能評估',
            service_ID: 'SB008',
            amount: 800,
            status: 'completed',
            date: '2025-12-05',
            timeStart: '10:00 AM',
            timeEnd: '11:00 AM',
            description: '全面體能評估和訓練計畫制定',
            notes: '體能狀況良好，可進行中強度訓練',
          },
        ],
      },
    ],
  }

  // 模擬用戶個人資料
  const mockUserProfiles: Record<string, UserProfile> = {
    'uuid-wang-xiaomei-001': {
      uuid: 'uuid-wang-xiaomei-001',
      name: '王小美',
      phone: '0912-345-678',
      email: 'wang@example.com',
      address: '台北市信義區信義路123號',
      preferredServices: ['beauty', 'spa'],
      totalSpent: 15000,
      lastVisit: new Date('2025-12-10'),
      registeredAt: new Date('2025-01-15'),
    },
    'uuid-wang-damei-002': {
      uuid: 'uuid-wang-damei-002',
      name: '王大美',
      phone: '0987-654-321',
      email: 'wangdamei@example.com',
      address: '新北市板橋區中山路456號',
      preferredServices: ['hair', 'fitness'],
      totalSpent: 22000,
      lastVisit: new Date('2025-12-12'),
      registeredAt: new Date('2025-02-20'),
    },
  }

  // 計算屬性：所有服務
  const allServices = computed(() => {
    if (!serviceData.value) return []
    return serviceData.value.ServiceInfo.flatMap((provider) =>
      provider.services.map((service) => ({
        ...service,
        providerName: provider.name,
        providerContact: provider.cell,
      })),
    )
  })

  // 計算屬性：已完成的服務
  const completedServices = computed(() => {
    return allServices.value.filter((service) => service.status === 'completed')
  })

  // 計算屬性：預約中的服務
  const scheduledServices = computed(() => {
    return allServices.value.filter((service) => service.status === 'scheduled')
  })

  // 計算屬性：總消費金額
  const totalSpent = computed(() => {
    return completedServices.value.reduce((sum, service) => sum + service.amount, 0)
  })

  // 計算屬性：月度統計
  const getMonthlyStats = (year: number, month: number) => {
    return computed(() => {
      const monthServices = allServices.value.filter((service) => {
        const serviceDate = new Date(service.date)
        return serviceDate.getFullYear() === year && serviceDate.getMonth() === month - 1
      })

      const completedInMonth = monthServices.filter((s) => s.status === 'completed')
      const scheduledInMonth = monthServices.filter((s) => s.status === 'scheduled')

      return {
        totalSpent: completedInMonth.reduce((sum, service) => sum + service.amount, 0),
        serviceCount: completedInMonth.length,
        appointmentCount: scheduledInMonth.length,
        totalActivities: monthServices.length,
      }
    })
  }

  // 計算屬性：近期活動
  const getRecentActivities = (limit: number = 5) => {
    return computed(() => {
      return allServices.value
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit)
    })
  }

  // 計算屬性：即將到來的預約
  const getUpcomingAppointments = (limit: number = 5) => {
    return computed(() => {
      const now = new Date()
      return scheduledServices.value
        .filter((service) => new Date(service.date) >= now)
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, limit)
    })
  }

  // 通過 UUID 載入服務資料
  async function loadServiceDataByUUID(uuid: string) {
    isLoading.value = true
    error.value = null

    try {
      currentUserUUID.value = uuid

      // 模擬 API 呼叫延遲
      await new Promise((resolve) => setTimeout(resolve, 500))

      // 載入服務資料（模擬）
      serviceData.value = mockServiceData

      // 載入用戶個人資���
      currentUserProfile.value = mockUserProfiles[uuid] || null

      if (!currentUserProfile.value) {
        throw new Error('找不到用戶資料')
      }

      console.log('成功載入服務資料:', serviceData.value)
      console.log('成功載入用戶資料:', currentUserProfile.value)
    } catch (err) {
      error.value = err instanceof Error ? err.message : '載入資料失敗'
      console.error('載入服務資料失敗:', err)
    } finally {
      isLoading.value = false
    }
  }

  // 更新用戶個人資料
  function updateUserProfile(updates: Partial<UserProfile>) {
    if (currentUserProfile.value) {
      currentUserProfile.value = { ...currentUserProfile.value, ...updates }
      console.log('用戶資料已更新:', currentUserProfile.value)
    }
  }

  // 清除資料
  function clearData() {
    currentUserUUID.value = ''
    serviceData.value = null
    currentUserProfile.value = null
    error.value = null
  }

  // 模擬 LINE 登入並獲取 UUID
  function simulateLineLogin(userType: 'xiaomei' | 'damei' = 'xiaomei') {
    const uuid = userType === 'xiaomei' ? 'uuid-wang-xiaomei-001' : 'uuid-wang-damei-002'
    return loadServiceDataByUUID(uuid)
  }

  return {
    // 狀態
    currentUserUUID,
    serviceData,
    currentUserProfile,
    isLoading,
    error,

    // 計算屬性
    allServices,
    completedServices,
    scheduledServices,
    totalSpent,

    // 方法
    loadServiceDataByUUID,
    updateUserProfile,
    clearData,
    simulateLineLogin,
    getMonthlyStats,
    getRecentActivities,
    getUpcomingAppointments,
  }
})
