import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

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
}

export const useCustomerStore = defineStore('customer', () => {
  const customers = ref<Customer[]>([
    {
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
    },
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

  return {
    customers,
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
  }
})
