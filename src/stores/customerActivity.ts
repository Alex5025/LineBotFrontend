import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface CustomerActivity {
  id: string
  customerId: string
  type: 'service' | 'appointment' | 'payment' | 'consultation'
  title: string
  description: string
  amount?: number
  date: Date
  status: 'completed' | 'scheduled' | 'cancelled'
  serviceId?: string
  notes?: string
}

export const useCustomerActivityStore = defineStore('customerActivity', () => {
  const activities = ref<CustomerActivity[]>([
    {
      id: '1',
      customerId: 'customer_1',
      type: 'service',
      title: '深層清潔護膚',
      description: '90分鐘深層清潔護膚療程',
      amount: 1500,
      date: new Date('2024-12-01'),
      status: 'completed',
      serviceId: 'service_1',
      notes: '效果很好，皮膚變得更光滑',
    },
    {
      id: '2',
      customerId: 'customer_1',
      type: 'appointment',
      title: '預約下次療程',
      description: '預約下次美容護膚療程',
      date: new Date('2024-12-15'),
      status: 'scheduled',
      notes: '預約週五下午2點',
    },
    {
      id: '3',
      customerId: 'customer_1',
      type: 'payment',
      title: '付款紀錄',
      description: '深層清潔護膚付款',
      amount: 1500,
      date: new Date('2024-12-01'),
      status: 'completed',
    },
    {
      id: '4',
      customerId: 'customer_1',
      type: 'service',
      title: '精油按摩',
      description: '120分鐘全身精油按摩',
      amount: 2000,
      date: new Date('2024-11-20'),
      status: 'completed',
      serviceId: 'service_2',
      notes: '放鬆效果很好',
    },
    {
      id: '5',
      customerId: 'customer_1',
      type: 'consultation',
      title: '膚質諮詢',
      description: '膚質分析和護膚建議',
      date: new Date('2024-11-10'),
      status: 'completed',
      notes: '建議使用保濕產品',
    },
  ])

  // 根據客戶ID獲取活動
  const getActivitiesByCustomerId = (customerId: string) => {
    return computed(() => activities.value.filter((activity) => activity.customerId === customerId))
  }

  // 根據月份獲取活動
  const getActivitiesByMonth = (customerId: string, year: number, month: number) => {
    return computed(() => {
      return activities.value.filter((activity) => {
        const activityDate = new Date(activity.date)
        return (
          activity.customerId === customerId &&
          activityDate.getFullYear() === year &&
          activityDate.getMonth() === month - 1
        )
      })
    })
  }

  // 獲取月份統計
  const getMonthlyStats = (customerId: string, year: number, month: number) => {
    return computed(() => {
      const monthActivities = getActivitiesByMonth(customerId, year, month).value

      const totalSpent = monthActivities
        .filter((activity) => activity.type === 'payment' && activity.amount)
        .reduce((sum, activity) => sum + (activity.amount || 0), 0)

      const serviceCount = monthActivities.filter(
        (activity) => activity.type === 'service' && activity.status === 'completed',
      ).length

      const appointmentCount = monthActivities.filter(
        (activity) => activity.type === 'appointment',
      ).length

      return {
        totalSpent,
        serviceCount,
        appointmentCount,
        totalActivities: monthActivities.length,
      }
    })
  }

  // 獲取最近活動
  const getRecentActivities = (customerId: string, limit: number = 5) => {
    return computed(() => {
      return activities.value
        .filter((activity) => activity.customerId === customerId)
        .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
        .slice(0, limit)
    })
  }

  // 新增活動
  function addActivity(activity: Omit<CustomerActivity, 'id'>) {
    const newActivity: CustomerActivity = {
      ...activity,
      id: Date.now().toString(),
    }
    activities.value.push(newActivity)
  }

  // 更新活動
  function updateActivity(id: string, updates: Partial<CustomerActivity>) {
    const index = activities.value.findIndex((activity) => activity.id === id)
    if (index !== -1) {
      activities.value[index] = { ...activities.value[index], ...updates }
    }
  }

  // 刪除活動
  function deleteActivity(id: string) {
    const index = activities.value.findIndex((activity) => activity.id === id)
    if (index !== -1) {
      activities.value.splice(index, 1)
    }
  }

  return {
    activities,
    getActivitiesByCustomerId,
    getActivitiesByMonth,
    getMonthlyStats,
    getRecentActivities,
    addActivity,
    updateActivity,
    deleteActivity,
  }
})
