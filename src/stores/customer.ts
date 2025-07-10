import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface CustomerPrivacySettings {
  name: boolean
  phone: boolean
  email: boolean
  address: boolean
  age: boolean
  height: boolean
  weight: boolean
  occupation: boolean
  hairType: boolean
  hairColor: boolean
  skinCondition: boolean
  notes: boolean
}

export interface Customer {
  id: string
  name: string
  phone: string
  email: string
  address: string
  age: number
  height: number
  weight: number
  occupation: string
  hairType: string
  hairColor: string
  skinCondition: string
  businessType: 'beauty' | 'hair' | 'fitness'
  notes: string
  createdAt: Date
  lastVisit?: Date
  totalSpent: number
  privacySettings?: CustomerPrivacySettings
}

export const useCustomerStore = defineStore('customer', () => {
  // 王小美作為主要客戶資料，所有地方都從這裡取得
  const wangXiaomei = ref<Customer>({
    id: '1',
    name: '王小美',
    phone: '0912-345-678',
    email: 'wang@example.com',
    address: '台北市信義區信義路123號',
    age: 28,
    height: 165,
    weight: 52,
    occupation: '上班族',
    hairType: '細軟髮',
    hairColor: '棕色',
    skinCondition: '混合性肌膚',
    businessType: 'beauty',
    notes: '對染髮過敏',
    createdAt: new Date('2024-01-15'),
    lastVisit: new Date('2024-12-10'),
    totalSpent: 15000,
    privacySettings: {
      name: true,
      phone: false,
      email: false,
      address: false,
      age: true,
      height: false,
      weight: false,
      occupation: true,
      hairType: true,
      hairColor: true,
      skinCondition: true,
      notes: false,
    },
  })

  // 王大美的完整客戶資料
  const wangDamei = ref<Customer>({
    id: '2',
    name: '王大美',
    phone: '0987-654-321',
    email: 'wangdamei@example.com',
    address: '新北市板橋區中山路456號',
    age: 32,
    height: 160,
    weight: 55,
    occupation: '設計師',
    hairType: '自然捲',
    hairColor: '亞麻色',
    skinCondition: '乾性肌膚',
    businessType: 'hair',
    notes: '偏好自然風格造型，不喜歡太厚重的妝容',
    createdAt: new Date('2024-02-20'),
    lastVisit: new Date('2024-12-12'),
    totalSpent: 22000,
    privacySettings: {
      name: true,
      phone: true,
      email: false,
      address: false,
      age: false,
      height: true,
      weight: false,
      occupation: true,
      hairType: true,
      hairColor: true,
      skinCondition: true,
      notes: true,
    },
  })

  const customers = ref<Customer[]>([
    wangXiaomei.value,
    wangDamei.value,
    {
      id: '2',
      name: '李健身',
      phone: '0987-654-321',
      email: 'li@example.com',
      address: '新北市板橋區文化路456號',
      age: 35,
      height: 175,
      weight: 70,
      occupation: '工程師',
      hairType: '正常髮質',
      hairColor: '黑色',
      skinCondition: '正常肌膚',
      businessType: 'fitness',
      notes: '目標減重5公斤',
      createdAt: new Date('2024-02-20'),
      lastVisit: new Date('2024-12-12'),
      totalSpent: 8000,
      privacySettings: {
        name: true,
        phone: false,
        email: false,
        address: false,
        age: true,
        height: true,
        weight: true,
        occupation: true,
        hairType: false,
        hairColor: false,
        skinCondition: false,
        notes: false,
      },
    },
  ])

  const currentPage = ref(1)
  const itemsPerPage = ref(10)
  const searchQuery = ref('')
  const filterBusinessType = ref<string>('')

  const filteredCustomers = computed(() => {
    let filtered = customers.value

    if (searchQuery.value) {
      const query = searchQuery.value.toLowerCase()
      filtered = filtered.filter(
        (customer) =>
          customer.name.toLowerCase().includes(query) ||
          customer.phone.includes(query) ||
          customer.email.toLowerCase().includes(query),
      )
    }

    if (filterBusinessType.value) {
      filtered = filtered.filter((customer) => customer.businessType === filterBusinessType.value)
    }

    return filtered
  })

  const paginatedCustomers = computed(() => {
    const start = (currentPage.value - 1) * itemsPerPage.value
    const end = start + itemsPerPage.value
    return filteredCustomers.value.slice(start, end)
  })

  const totalPages = computed(() => {
    return Math.ceil(filteredCustomers.value.length / itemsPerPage.value)
  })

  const totalCustomers = computed(() => customers.value.length)
  const totalRevenue = computed(() =>
    customers.value.reduce((sum, customer) => sum + customer.totalSpent, 0),
  )

  function addCustomer(customer: Omit<Customer, 'id' | 'createdAt' | 'totalSpent'>) {
    const newCustomer: Customer = {
      ...customer,
      id: Date.now().toString(),
      createdAt: new Date(),
      totalSpent: 0,
    }
    customers.value.push(newCustomer)
  }

  function updateCustomer(id: string, updates: Partial<Customer>) {
    const index = customers.value.findIndex((customer) => customer.id === id)
    if (index !== -1) {
      customers.value[index] = { ...customers.value[index], ...updates }
    }
  }

  function deleteCustomer(id: string) {
    const index = customers.value.findIndex((customer) => customer.id === id)
    if (index !== -1) {
      customers.value.splice(index, 1)
    }
  }

  function getCustomerById(id: string) {
    return customers.value.find((customer) => customer.id === id)
  }

  // 專門的王小美資料操作函數
  function getWangXiaomei() {
    return wangXiaomei.value
  }

  function updateWangXiaomei(updates: Partial<Customer>) {
    console.log('更新王小美資料:', updates)
    Object.assign(wangXiaomei.value, updates)

    // 同步更新到 customers 列表中
    const index = customers.value.findIndex((c) => c.id === '1')
    if (index !== -1) {
      customers.value[index] = wangXiaomei.value
    }

    console.log('更新後的王小美資料:', wangXiaomei.value)
  }

  // 專門的王大美資料操作函數
  function getWangDamei() {
    return wangDamei.value
  }

  function updateWangDamei(updates: Partial<Customer>) {
    console.log('更新王大美資料:', updates)
    Object.assign(wangDamei.value, updates)

    // 同步更新到 customers 列表中
    const index = customers.value.findIndex((c) => c.id === '2')
    if (index !== -1) {
      customers.value[index] = wangDamei.value
    }

    console.log('更新後的王大美資料:', wangDamei.value)
  }

  return {
    customers,
    wangXiaomei,
    wangDamei,
    currentPage,
    itemsPerPage,
    searchQuery,
    filterBusinessType,
    filteredCustomers,
    paginatedCustomers,
    totalPages,
    totalCustomers,
    totalRevenue,
    addCustomer,
    updateCustomer,
    deleteCustomer,
    getCustomerById,
    getWangXiaomei,
    updateWangXiaomei,
    getWangDamei,
    updateWangDamei,
  }
})
