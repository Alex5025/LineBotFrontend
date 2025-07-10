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
      customerId: '1',
      type: 'service',
      title: '深層清潔護膚',
      description: '90分鐘深層清潔護膚療程',
      amount: 1500,
      date: new Date('2025-06-01'), // 調整為今天之前
      status: 'completed',
      serviceId: 'service_1',
      notes: '效果很好，皮膚變得更光滑',
    },
    {
      id: '2',
      customerId: '1',
      type: 'appointment',
      title: '深層保濕護膚',
      description: '90分鐘深層保濕護膚療程',
      date: new Date('2025-07-20'),
      status: 'scheduled',
      serviceId: 'service_1',
      amount: 1500,
      notes: '下午3點預約，準備做聖誕節前保養',
    },
    {
      id: '6',
      customerId: '1',
      type: 'appointment',
      title: '精油SPA按摩',
      description: '120分鐘全身精油放鬆按摩',
      date: new Date('2025-08-25'),
      status: 'scheduled',
      serviceId: 'service_2',
      amount: 2200,
      notes: '聖誕節特別療程，已確認預約',
    },
    {
      id: '7',
      customerId: '1',
      type: 'appointment',
      title: '臉部深層清潔',
      description: '60分鐘專業臉部清潔護理',
      date: new Date('2025-06-28'),
      status: 'scheduled',
      serviceId: 'service_3',
      amount: 1200,
      notes: '年末深層清潔，為新年做準備',
    },
    {
      id: '3',
      customerId: '1',
      type: 'payment',
      title: '付款紀錄',
      description: '深層清潔護膚付款',
      amount: 1500,
      date: new Date('2025-06-01'), // 調整為今天之前
      status: 'completed',
    },
    {
      id: '4',
      customerId: '1',
      type: 'service',
      title: '精油按摩',
      description: '120分鐘���身精油按摩',
      amount: 2000,
      date: new Date('2025-06-20'), // 調整為今天之前
      status: 'completed',
      serviceId: 'service_2',
      notes: '放鬆效果很好',
    },
    {
      id: '5',
      customerId: '1',
      type: 'consultation',
      title: '膚質諮詢',
      description: '膚質分析和護膚建議',
      date: new Date('2025-06-10'), // 調整為今天之前
      status: 'completed',
      notes: '建議使用保濕產品',
    },
    {
      id: '8',
      customerId: '2',
      type: 'appointment',
      title: '個人健身指導',
      description: '60分鐘一對一健身訓練',
      date: new Date('2025-12-18'),
      status: 'scheduled',
      serviceId: 'service_4',
      amount: 1200,
      notes: '專注下半身訓練',
    },
    {
      id: '9',
      customerId: '2',
      type: 'service',
      title: '體能評估',
      description: '全面體能評估和訓練計畫制定',
      amount: 800,
      date: new Date('2025-06-05'), // 調整為今天之前
      status: 'completed',
      serviceId: 'service_4',
      notes: '體能狀況良好，可進行中強度訓練',
    },

    // 王大美 2025年8月活動資料
    {
      id: '10',
      customerId: '2',
      type: 'service',
      title: '造型設計諮詢',
      description: '專業髮型設計諮詢和建議',
      amount: 500,
      date: new Date('2025-06-02'), // 調整為今天之前
      status: 'completed',
      serviceId: 'service_hair_1',
      notes: '討論秋季髮型趨勢，建議層次剪裁',
    },
    {
      id: '11',
      customerId: '2',
      type: 'service',
      title: '深層護髮護理',
      description: '90分鐘深層修護護髮療程',
      amount: 2200,
      date: new Date('2025-06-05'), // 調整為今天之前
      status: 'completed',
      serviceId: 'service_hair_2',
      notes: '髮質明顯改善，光澤度增加',
    },
    {
      id: '12',
      customerId: '2',
      type: 'payment',
      title: '護髮療程付款',
      description: '深層護髮護理付款',
      amount: 2200,
      date: new Date('2025-06-05'), // 調整為今天之前
      status: 'completed',
    },
    {
      id: '13',
      customerId: '2',
      type: 'appointment',
      title: '染髮造型',
      description: '自然亞麻色染髮+造型設計',
      amount: 3500,
      date: new Date('2025-06-12'), // 調整為今天之前
      status: 'completed',
      serviceId: 'service_hair_3',
      notes: '顏色效果很自然，很滿意',
    },
    {
      id: '14',
      customerId: '2',
      type: 'payment',
      title: '染髮造型付款',
      description: '染髮造型服務付款',
      amount: 3500,
      date: new Date('2025-06-12'), // 調整為今天之前
      status: 'completed',
    },
    {
      id: '15',
      customerId: '2',
      type: 'service',
      title: '頭皮SPA護理',
      description: '60分鐘頭皮深層清潔和按摩',
      amount: 1200,
      date: new Date('2025-06-18'), // 調整為今天之前
      status: 'completed',
      serviceId: 'service_hair_4',
      notes: '頭皮狀況改善，很放鬆',
    },
    {
      id: '16',
      customerId: '2',
      type: 'payment',
      title: '頭皮SPA付款',
      description: '頭皮SPA護理付款',
      amount: 1200,
      date: new Date('2025-06-18'), // 調整為今天之前
      status: 'completed',
    },
    {
      id: '17',
      customerId: '2',
      type: 'appointment',
      title: '造型維護',
      description: '髮型修剪和造型維護',
      amount: 800,
      date: new Date('2025-06-25'), // 調整為今天之前
      status: 'completed',
      serviceId: 'service_hair_5',
      notes: '維持髮型線條，調整層次',
    },
    {
      id: '18',
      customerId: '2',
      type: 'payment',
      title: '造型維護付款',
      description: '髮型修剪造型付款',
      amount: 800,
      date: new Date('2025-06-25'), // 調整為今天之前
      status: 'completed',
    },

    // 王大美 2025年6月預約資料
    {
      id: '19',
      customerId: '2',
      type: 'appointment',
      title: '夏季髮型設計',
      description: '夏季清爽髮型設計諮詢',
      amount: 600,
      date: new Date('2025-06-05'),
      status: 'scheduled',
      serviceId: 'service_hair_6',
      notes: '希望能有涼爽感的髮型設計',
    },
    {
      id: '20',
      customerId: '2',
      type: 'appointment',
      title: '頭髮護理療程',
      description: '深層修護和保濕護髮',
      amount: 2500,
      date: new Date('2025-06-12'),
      status: 'scheduled',
      serviceId: 'service_hair_7',
      notes: '夏季前的頭髮保養',
    },
    {
      id: '21',
      customerId: '2',
      type: 'appointment',
      title: '造型剪裁',
      description: '專業髮型剪裁和造型',
      amount: 1800,
      date: new Date('2025-06-18'),
      status: 'scheduled',
      serviceId: 'service_hair_8',
      notes: '中長髮層次剪裁',
    },
    {
      id: '22',
      customerId: '2',
      type: 'appointment',
      title: '頭皮護理',
      description: '頭皮深層清潔和營養護理',
      amount: 1400,
      date: new Date('2025-06-28'),
      status: 'scheduled',
      serviceId: 'service_hair_9',
      notes: '改善頭皮油脂分泌',
    },

    // 王大美 2025年7月預約資料
    {
      id: '23',
      customerId: '2',
      type: 'appointment',
      title: '挑染設計',
      description: '局部挑染增加層次感',
      amount: 2800,
      date: new Date('2025-07-08'),
      status: 'scheduled',
      serviceId: 'service_hair_10',
      notes: '希望在亞麻色基礎上增加亮點',
    },
    {
      id: '24',
      customerId: '2',
      type: 'appointment',
      title: '深層護髮',
      description: '蛋白質修護護髮療程',
      amount: 2000,
      date: new Date('2025-07-15'),
      status: 'scheduled',
      serviceId: 'service_hair_11',
      notes: '針對染後髮質修護',
    },
    {
      id: '25',
      customerId: '2',
      type: 'appointment',
      title: '造型諮詢',
      description: '秋季髮型趨勢諮詢',
      amount: 500,
      date: new Date('2025-07-22'),
      status: 'scheduled',
      serviceId: 'service_hair_12',
      notes: '討論秋季可能的髮型變化',
    },
    {
      id: '26',
      customerId: '2',
      type: 'appointment',
      title: '頭皮SPA',
      description: '放鬆頭皮按摩和護理',
      amount: 1300,
      date: new Date('2025-07-29'),
      status: 'scheduled',
      serviceId: 'service_hair_13',
      notes: '夏季頭皮舒緩護理',
    },

    // 王大美 2025年8月預約資料
    {
      id: '27',
      customerId: '2',
      type: 'appointment',
      title: '髮質檢測',
      description: '專業髮質分析和評估',
      amount: 400,
      date: new Date('2025-08-06'),
      status: 'scheduled',
      serviceId: 'service_hair_14',
      notes: '檢測染後髮質狀況',
    },
    {
      id: '28',
      customerId: '2',
      type: 'appointment',
      title: '造型設計',
      description: '特殊場合造型設計',
      amount: 2200,
      date: new Date('2025-08-12'),
      status: 'scheduled',
      serviceId: 'service_hair_15',
      notes: '參加朋友婚禮的特殊造型',
    },
    {
      id: '29',
      customerId: '2',
      type: 'appointment',
      title: '護髮保養',
      description: '日常護髮保養指導',
      amount: 1600,
      date: new Date('2025-08-20'),
      status: 'scheduled',
      serviceId: 'service_hair_16',
      notes: '學習居家護髮技巧',
    },
    {
      id: '30',
      customerId: '2',
      type: 'appointment',
      title: '秋季準備',
      description: '秋季髮型準備和修剪',
      amount: 1500,
      date: new Date('2025-08-28'),
      status: 'scheduled',
      serviceId: 'service_hair_17',
      notes: '為秋季換季做準備',
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

  // 獲取即將到來的預約
  const getUpcomingAppointments = (customerId: string, limit: number = 5) => {
    return computed(() => {
      const now = new Date()
      return activities.value
        .filter(
          (activity) =>
            activity.customerId === customerId &&
            activity.type === 'appointment' &&
            activity.status === 'scheduled' &&
            new Date(activity.date) >= now,
        )
        .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
        .slice(0, limit)
    })
  }

  // 獲取最近預約的服務（包括已完成和即將到來的）
  const getRecentAppointments = (customerId: string, limit: number = 3) => {
    return computed(() => {
      return activities.value
        .filter((activity) => activity.customerId === customerId && activity.type === 'appointment')
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

  // 根據日期自動調整活動狀態
  function autoUpdateStatusByDate() {
    const now = new Date()
    activities.value.forEach((activity) => {
      if (activity.date instanceof Date) {
        if (activity.date > now) {
          activity.status = 'scheduled'
        } else {
          activity.status = 'completed'
        }
      } else {
        const d = new Date(activity.date)
        if (d > now) {
          activity.status = 'scheduled'
        } else {
          activity.status = 'completed'
        }
      }
    })
  }

  // 初始化時自動調整
  autoUpdateStatusByDate()

  return {
    activities,
    getActivitiesByCustomerId,
    getActivitiesByMonth,
    getMonthlyStats,
    getRecentActivities,
    getUpcomingAppointments,
    getRecentAppointments,
    addActivity,
    updateActivity,
    deleteActivity,
  }
})
