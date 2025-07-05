import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface Service {
  id: string
  name: string
  description: string
  price: number
  duration: number // 分鐘
  category: 'beauty' | 'hair' | 'fitness'
  isActive: boolean
  createdAt: Date
}

export interface ServiceRecord {
  id: string
  customerId: string
  serviceId: string
  date: Date
  price: number
  notes?: string
}

export const useServiceStore = defineStore('service', () => {
  const services = ref<Service[]>([
    {
      id: '1',
      name: '深層清潔護膚',
      description: '深層清潔毛孔，去除老廢角質',
      price: 1500,
      duration: 90,
      category: 'beauty',
      isActive: true,
      createdAt: new Date('2024-01-10'),
    },
    {
      id: '2',
      name: '精油紓壓按摩',
      description: '全身精油按摩，舒緩壓力',
      price: 2000,
      duration: 120,
      category: 'beauty',
      isActive: true,
      createdAt: new Date('2024-01-10'),
    },
    {
      id: '3',
      name: '染髮造型',
      description: '專業染髮配色，包含洗剪吹',
      price: 3500,
      duration: 180,
      category: 'hair',
      isActive: true,
      createdAt: new Date('2024-01-10'),
    },
    {
      id: '4',
      name: '個人健身指導',
      description: '一對一健身指導，客製化訓練計畫',
      price: 1200,
      duration: 60,
      category: 'fitness',
      isActive: true,
      createdAt: new Date('2024-01-10'),
    },
  ])

  const serviceRecords = ref<ServiceRecord[]>([
    {
      id: '1',
      customerId: '1',
      serviceId: '1',
      date: new Date('2024-12-10'),
      price: 1500,
      notes: '客戶滿意服務效果',
    },
    {
      id: '2',
      customerId: '2',
      serviceId: '4',
      date: new Date('2024-12-12'),
      price: 1200,
      notes: '完成第一次訓練',
    },
  ])

  const activeServices = computed(() => services.value.filter((service) => service.isActive))

  const servicesByCategory = computed(() => {
    return {
      beauty: services.value.filter((service) => service.category === 'beauty'),
      hair: services.value.filter((service) => service.category === 'hair'),
      fitness: services.value.filter((service) => service.category === 'fitness'),
    }
  })

  const dailyRevenue = computed(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const tomorrow = new Date(today)
    tomorrow.setDate(tomorrow.getDate() + 1)

    return serviceRecords.value
      .filter((record) => record.date >= today && record.date < tomorrow)
      .reduce((sum, record) => sum + record.price, 0)
  })

  const monthlyRevenue = computed(() => {
    const now = new Date()
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)

    return serviceRecords.value
      .filter((record) => record.date >= startOfMonth && record.date <= endOfMonth)
      .reduce((sum, record) => sum + record.price, 0)
  })

  function addService(service: Omit<Service, 'id' | 'createdAt'>) {
    const newService: Service = {
      ...service,
      id: Date.now().toString(),
      createdAt: new Date(),
    }
    services.value.push(newService)
  }

  function updateService(id: string, updates: Partial<Service>) {
    const index = services.value.findIndex((service) => service.id === id)
    if (index !== -1) {
      services.value[index] = { ...services.value[index], ...updates }
    }
  }

  function deleteService(id: string) {
    const index = services.value.findIndex((service) => service.id === id)
    if (index !== -1) {
      services.value.splice(index, 1)
    }
  }

  function addServiceRecord(record: Omit<ServiceRecord, 'id'>) {
    const newRecord: ServiceRecord = {
      ...record,
      id: Date.now().toString(),
    }
    serviceRecords.value.push(newRecord)
  }

  function getRevenueByDateRange(startDate: Date, endDate: Date) {
    return serviceRecords.value
      .filter((record) => record.date >= startDate && record.date <= endDate)
      .reduce((sum, record) => sum + record.price, 0)
  }

  return {
    services,
    serviceRecords,
    activeServices,
    servicesByCategory,
    dailyRevenue,
    monthlyRevenue,
    addService,
    updateService,
    deleteService,
    addServiceRecord,
    getRevenueByDateRange,
  }
})
