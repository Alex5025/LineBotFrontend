<script setup lang="ts">
import { ref, reactive, computed, onMounted, watch } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCustomerStore, type Customer, type CustomerPrivacySettings } from '../stores/customer'

const authStore = useAuthStore()
const customerStore = useCustomerStore()

const isEditing = ref(false)
const isSaving = ref(false)

const form = reactive({
  name: '',
  phone: '',
  email: '',
  address: '',
  age: 0,
  height: 0,
  weight: 0,
  occupation: '',
  hairType: '',
  hairColor: '',
  skinCondition: '',
  notes: '',
})

const privacySettings = reactive<CustomerPrivacySettings>({
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
})

const errors = ref<Record<string, string>>({})

// 獲取當前登入的客戶資料
const currentCustomer = ref(null)

// 根據當前登入用戶獲取對應的客戶資料
const reactiveCurrentCustomer = computed(() => {
  const currentUserId = authStore.currentUser?.id
  let currentCustomerData = null

  if (currentUserId === '1') {
    currentCustomerData = customerStore.wangXiaomei
  } else if (currentUserId === '2') {
    currentCustomerData = customerStore.wangDamei
  }

  // 如果表單還沒有資料或者不是編輯狀態，就更新表單
  if (currentCustomerData && (!form.name || !isEditing.value)) {
    Object.assign(form, {
      name: currentCustomerData.name || '',
      phone: currentCustomerData.phone || '',
      email: currentCustomerData.email || '',
      address: currentCustomerData.address || '',
      age: currentCustomerData.age || 0,
      height: currentCustomerData.height || 0,
      weight: currentCustomerData.weight || 0,
      occupation: currentCustomerData.occupation || '',
      hairType: currentCustomerData.hairType || '',
      hairColor: currentCustomerData.hairColor || '',
      skinCondition: currentCustomerData.skinCondition || '',
      notes: currentCustomerData.notes || '',
    })

    if (currentCustomerData.privacySettings) {
      Object.assign(privacySettings, currentCustomerData.privacySettings)
    }
  }

  return currentCustomerData
})

// 主動尋找客戶資料的函數
const findCurrentCustomer = () => {
  const customerId = authStore.currentUser?.id
  console.log('Debug - 當前用戶ID:', customerId)
  console.log('Debug - 當前��戶:', authStore.currentUser)
  console.log('Debug - 所有客戶:', customerStore.customers)

  if (customerId && customerStore.customers.length > 0) {
    const customer = customerStore.customers.find((customer) => customer.id === customerId)
    console.log('Debug - 找到的客戶:', customer)

    if (customer) {
      currentCustomer.value = customer
      // 立即填入表單資料
      Object.assign(form, {
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        age: customer.age || 0,
        height: customer.height || 0,
        weight: customer.weight || 0,
        occupation: customer.occupation || '',
        hairType: customer.hairType || '',
        hairColor: customer.hairColor || '',
        skinCondition: customer.skinCondition || '',
        notes: customer.notes || '',
      })

      if (customer.privacySettings) {
        Object.assign(privacySettings, customer.privacySettings)
      } else {
        Object.assign(privacySettings, {
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
        })
      }
      console.log('Debug - 資料已填入表單:', form)
    }
    return customer
  }
  return null
}

// ���質選項
const hairTypes = [
  '細軟髮',
  '粗硬髮',
  '自然捲',
  '直髮',
  '波浪髮',
  '受損髮',
  '油性髮質',
  '乾性髮質',
  '正常髮質',
]

// 髮色選項
const hairColors = [
  '黑色',
  '棕色',
  '咖啡色',
  '金色',
  '亞麻色',
  '栗色',
  '紅色',
  '紫色',
  '銀色',
  '其他',
]

// 膚質選項
const skinConditions = [
  '油性肌膚',
  '乾性肌膚',
  '混合性肌膚',
  '敏感性肌膚',
  '正常肌膚',
  '痘痘肌',
  '老化肌膚',
  '色素沉澱',
]

// 載入客戶資料
const loadCustomerData = () => {
  console.log('Debug - 載入王小美資料')

  // 直接從 customer store 獲取王小美資料
  const wangXiaomei = customerStore.wangXiaomei

  if (wangXiaomei) {
    console.log('Debug - 王小美資料:', wangXiaomei)

    Object.assign(form, {
      name: wangXiaomei.name || '',
      phone: wangXiaomei.phone || '',
      email: wangXiaomei.email || '',
      address: wangXiaomei.address || '',
      age: wangXiaomei.age || 0,
      height: wangXiaomei.height || 0,
      weight: wangXiaomei.weight || 0,
      occupation: wangXiaomei.occupation || '',
      hairType: wangXiaomei.hairType || '',
      hairColor: wangXiaomei.hairColor || '',
      skinCondition: wangXiaomei.skinCondition || '',
      notes: wangXiaomei.notes || '',
    })

    if (wangXiaomei.privacySettings) {
      Object.assign(privacySettings, wangXiaomei.privacySettings)
    }

    currentCustomer.value = wangXiaomei
    console.log('Debug - 表單資料已更新:', form)
  } else {
    console.log('Debug - 找不到王小美資料！')
  }
}

// 驗證���單
const validateForm = () => {
  errors.value = {}

  if (!form.name.trim()) {
    errors.value.name = '姓名為必填項目'
  }

  if (!form.phone.trim()) {
    errors.value.phone = '電話為必填項目'
  } else if (!/^[\d-+()\ ]+$/.test(form.phone)) {
    errors.value.phone = '電話格式不正確'
  }

  if (!form.email.trim()) {
    errors.value.email = 'Email為必填項目'
  } else if (!/\S+@\S+\.\S+/.test(form.email)) {
    errors.value.email = 'Email格式不正確'
  }

  if (form.age < 1 || form.age > 120) {
    errors.value.age = '年齡必須在1-120之間'
  }

  if (form.height < 1 || form.height > 300) {
    errors.value.height = '身高必須在1-300公分之間'
  }

  if (form.weight < 1 || form.weight > 500) {
    errors.value.weight = '體重必須在1-500公斤之間'
  }

  return Object.keys(errors.value).length === 0
}

// 強制重新載入資料
const forceReloadData = () => {
  console.log('強制重新載入資料')

  // 重新初始化認���
  authStore.initializeAuth()

  // 清除當前客戶資料
  currentCustomer.value = null

  // 重新載入
  setTimeout(() => {
    loadCustomerData()

    // 強制更新響應式資料
    const customer = reactiveCurrentCustomer.value
    if (customer) {
      console.log('強制更新後的客戶資料:', customer)
      Object.assign(form, {
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        age: customer.age || 0,
        height: customer.height || 0,
        weight: customer.weight || 0,
        occupation: customer.occupation || '',
        hairType: customer.hairType || '',
        hairColor: customer.hairColor || '',
        skinCondition: customer.skinCondition || '',
        notes: customer.notes || '',
      })

      if (customer.privacySettings) {
        Object.assign(privacySettings, customer.privacySettings)
      }
    }
  }, 100)
}

// 開始編輯
const startEditing = () => {
  loadCustomerData() // 先載入最新資料
  isEditing.value = true
}

// 取消編輯
const cancelEditing = () => {
  isEditing.value = false
  loadCustomerData() // 重新載入原始資料
  errors.value = {}
}

// 儲存資料
const saveProfile = async () => {
  if (!validateForm()) {
    return
  }

  isSaving.value = true

  try {
    const currentUserId = authStore.currentUser?.id

    // 根據當前用戶更新對應的客戶資料
    if (currentUserId === '1') {
      customerStore.updateWangXiaomei({
        ...form,
        privacySettings: { ...privacySettings },
      })
      console.log('王小美個人資料更新成功')
    } else if (currentUserId === '2') {
      customerStore.updateWangDamei({
        ...form,
        privacySettings: { ...privacySettings },
      })
      console.log('王大美個人資料更新成功')
    }

    // 同步更新 auth store 中的用戶資訊
    authStore.updateUser({
      name: form.name,
      email: form.email,
      phone: form.phone,
    })

    isEditing.value = false
    errors.value = {}

    console.log('個人資料更新成功')
  } catch (error) {
    console.error('儲存失敗:', error)
  } finally {
    isSaving.value = false
  }
}

// 隱私設定項目標籤
const privacyLabels = {
  name: '姓名',
  phone: '電話',
  email: 'Email',
  address: '地址',
  age: '年齡',
  height: '身高',
  weight: '體重',
  occupation: '職業',
  hairType: '髮質',
  hairColor: '髮色',
  skinCondition: '膚質狀況',
  notes: '備註',
}

// 格式化日期
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

// 格式化貨幣
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(amount)
}

// 業務類型標籤
const businessTypeLabels = {
  beauty: '美容美體',
  hair: '美髮造型',
  fitness: '健身指導',
}

// 監聽auth store的變化
watch(
  () => authStore.currentUser,
  (newUser) => {
    console.log('Debug - 用戶變化:', newUser)
    if (newUser) {
      console.log('Debug - 用戶變化，重新載入��料')
      loadCustomerData()
    }
  },
  { immediate: true },
)

// 監聽客戶store的變化
watch(
  () => customerStore.customers,
  (newCustomers) => {
    console.log('Debug - 客戶列表變化:', newCustomers)
    if (newCustomers.length > 0 && authStore.currentUser) {
      console.log('Debug - 客戶列表變化，重新載入資料')
      loadCustomerData()
    }
  },
  { immediate: true },
)

onMounted(() => {
  console.log('Debug - 組件載入')
  console.log('Debug - 當前用戶:', authStore.currentUser)
  console.log('Debug - 是否已驗證:', authStore.isAuthenticated)

  // 確保認證狀態
  if (!authStore.isAuthenticated) {
    console.log('Debug - 用戶未登入，初始化認證...')
    authStore.initializeAuth()
  }

  // 立即嘗試載入資料
  loadCustomerData()

  // 延遲再次載入確保資料正確
  setTimeout(() => {
    console.log('Debug - 延遲載入客戶資料')
    loadCustomerData()

    // 強制更新響應式資料
    const customer = reactiveCurrentCustomer.value
    if (customer) {
      console.log('Debug - 強制更新表單資料:', customer)
      Object.assign(form, {
        name: customer.name || '',
        phone: customer.phone || '',
        email: customer.email || '',
        address: customer.address || '',
        age: customer.age || 0,
        height: customer.height || 0,
        weight: customer.weight || 0,
        occupation: customer.occupation || '',
        hairType: customer.hairType || '',
        hairColor: customer.hairColor || '',
        skinCondition: customer.skinCondition || '',
        notes: customer.notes || '',
      })
    }
  }, 200)
})
</script>

<template>
  <div class="customer-profile">
    <div class="profile-header">
      <div class="header-content">
        <h1>個人資料</h1>
        <p>管理您的個人資訊和隱私設定</p>
      </div>
      <div class="header-actions">
        <div v-if="!isEditing" class="header-btn-group">
          <button @click="forceReloadData" class="reload-btn">
            <span class="btn-icon">🔄</span>
            重新載入
          </button>
          <button @click="startEditing" class="edit-btn">
            <span class="btn-icon">✏️</span>
            編輯資料
          </button>
        </div>
        <div v-else class="editing-actions">
          <button @click="cancelEditing" class="cancel-btn">取消</button>
          <button @click="saveProfile" :disabled="isSaving" class="save-btn">
            <span v-if="isSaving">儲��中...</span>
            <span v-else>儲存</span>
          </button>
        </div>
      </div>
    </div>

    <div class="profile-content">
      <!-- 基本資料區塊 -->
      <div class="info-section">
        <h2>基本資料</h2>
        <div class="info-grid">
          <!-- 姓名 -->
          <div class="info-item">
            <div class="field-header">
              <label>姓名</label>
              <label v-if="isEditing" class="privacy-toggle">
                <input
                  v-model="privacySettings.name"
                  type="checkbox"
                  class="privacy-checkbox-inline"
                />
                <span class="privacy-label-inline">對外公開</span>
              </label>
            </div>
            <input
              v-if="isEditing"
              v-model="form.name"
              type="text"
              :class="{ error: errors.name }"
              placeholder="請輸入姓名"
            />
            <div v-else class="value-with-privacy">
              <span class="value">{{
                reactiveCurrentCustomer?.name || form.name || '未設定'
              }}</span>
              <span
                v-if="reactiveCurrentCustomer?.privacySettings?.name"
                class="privacy-status public"
                >對外公開</span
              >
              <span v-else class="privacy-status private">僅自己可見</span>
            </div>
            <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
          </div>

          <!-- 電話 -->
          <div class="info-item">
            <div class="field-header">
              <label>電話</label>
              <label v-if="isEditing" class="privacy-toggle">
                <input
                  v-model="privacySettings.phone"
                  type="checkbox"
                  class="privacy-checkbox-inline"
                />
                <span class="privacy-label-inline">對外公開</span>
              </label>
            </div>
            <input
              v-if="isEditing"
              v-model="form.phone"
              type="tel"
              :class="{ error: errors.phone }"
              placeholder="0912-345-678"
            />
            <div v-else class="value-with-privacy">
              <span class="value">{{
                reactiveCurrentCustomer?.phone || form.phone || '未設定'
              }}</span>
              <span
                v-if="reactiveCurrentCustomer?.privacySettings?.phone"
                class="privacy-status public"
                >對外公開</span
              >
              <span v-else class="privacy-status private">僅自己可見</span>
            </div>
            <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
          </div>

          <!-- Email -->
          <div class="info-item">
            <div class="field-header">
              <label>Email</label>
              <label v-if="isEditing" class="privacy-toggle">
                <input
                  v-model="privacySettings.email"
                  type="checkbox"
                  class="privacy-checkbox-inline"
                />
                <span class="privacy-label-inline">對外公開</span>
              </label>
            </div>
            <input
              v-if="isEditing"
              v-model="form.email"
              type="email"
              :class="{ error: errors.email }"
              placeholder="example@email.com"
            />
            <div v-else class="value-with-privacy">
              <span class="value">{{
                reactiveCurrentCustomer?.email || form.email || '未設定'
              }}</span>
              <span
                v-if="reactiveCurrentCustomer?.privacySettings?.email"
                class="privacy-status public"
                >對外公開</span
              >
              <span v-else class="privacy-status private">僅自己可見</span>
            </div>
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <!-- 地址 -->
          <div class="info-item full-width">
            <div class="field-header">
              <label>地址</label>
              <label v-if="isEditing" class="privacy-toggle">
                <input
                  v-model="privacySettings.address"
                  type="checkbox"
                  class="privacy-checkbox-inline"
                />
                <span class="privacy-label-inline">對外公開</span>
              </label>
            </div>
            <input
              v-if="isEditing"
              v-model="form.address"
              type="text"
              placeholder="請輸入完整地址"
            />
            <div v-else class="value-with-privacy">
              <span class="value">{{
                reactiveCurrentCustomer?.address || form.address || '未設定'
              }}</span>
              <span
                v-if="reactiveCurrentCustomer?.privacySettings?.address"
                class="privacy-status public"
                >對外公開</span
              >
              <span v-else class="privacy-status private">僅自己可見</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 個人資訊區塊 -->
      <div class="info-section">
        <h2>個人資訊</h2>
        <div class="info-grid">
          <!-- 年齡 -->
          <div class="info-item">
            <div class="field-header">
              <label>年齡</label>
              <label v-if="isEditing" class="privacy-toggle">
                <input
                  v-model="privacySettings.age"
                  type="checkbox"
                  class="privacy-checkbox-inline"
                />
                <span class="privacy-label-inline">對外公開</span>
              </label>
            </div>
            <input
              v-if="isEditing"
              v-model.number="form.age"
              type="number"
              min="1"
              max="120"
              :class="{ error: errors.age }"
              placeholder="25"
            />
            <div v-else class="value-with-privacy">
              <span class="value">{{ reactiveCurrentCustomer?.age || form.age || 0 }} 歲</span>
              <span
                v-if="reactiveCurrentCustomer?.privacySettings?.age"
                class="privacy-status public"
                >對外公開</span
              >
              <span v-else class="privacy-status private">僅自己可見</span>
            </div>
            <span v-if="errors.age" class="error-message">{{ errors.age }}</span>
          </div>

          <!-- 身高 -->
          <div class="info-item">
            <div class="field-header">
              <label>身高</label>
              <label v-if="isEditing" class="privacy-toggle">
                <input
                  v-model="privacySettings.height"
                  type="checkbox"
                  class="privacy-checkbox-inline"
                />
                <span class="privacy-label-inline">對外公開</span>
              </label>
            </div>
            <input
              v-if="isEditing"
              v-model.number="form.height"
              type="number"
              min="1"
              max="300"
              :class="{ error: errors.height }"
              placeholder="165"
            />
            <div v-else class="value-with-privacy">
              <span class="value"
                >{{ reactiveCurrentCustomer?.height || form.height || 0 }} cm</span
              >
              <span
                v-if="reactiveCurrentCustomer?.privacySettings?.height"
                class="privacy-status public"
                >對外公開</span
              >
              <span v-else class="privacy-status private">僅自己可見</span>
            </div>
            <span v-if="errors.height" class="error-message">{{ errors.height }}</span>
          </div>

          <!-- 體重 -->
          <div class="info-item">
            <div class="field-header">
              <label>體重</label>
              <label v-if="isEditing" class="privacy-toggle">
                <input
                  v-model="privacySettings.weight"
                  type="checkbox"
                  class="privacy-checkbox-inline"
                />
                <span class="privacy-label-inline">對外公開</span>
              </label>
            </div>
            <input
              v-if="isEditing"
              v-model.number="form.weight"
              type="number"
              min="1"
              max="500"
              :class="{ error: errors.weight }"
              placeholder="60"
            />
            <div v-else class="value-with-privacy">
              <span class="value">{{ currentCustomer?.weight }} kg</span>
              <span v-if="currentCustomer?.privacySettings?.weight" class="privacy-status public"
                >對外公開</span
              >
              <span v-else class="privacy-status private">僅自己可見</span>
            </div>
            <span v-if="errors.weight" class="error-message">{{ errors.weight }}</span>
          </div>

          <!-- 職業 -->
          <div class="info-item">
            <div class="field-header">
              <label>職業</label>
              <label v-if="isEditing" class="privacy-toggle">
                <input
                  v-model="privacySettings.occupation"
                  type="checkbox"
                  class="privacy-checkbox-inline"
                />
                <span class="privacy-label-inline">對外公開</span>
              </label>
            </div>
            <input
              v-if="isEditing"
              v-model="form.occupation"
              type="text"
              placeholder="請輸入職業"
            />
            <div v-else class="value-with-privacy">
              <span class="value">{{ currentCustomer?.occupation }}</span>
              <span
                v-if="currentCustomer?.privacySettings?.occupation"
                class="privacy-status public"
                >對外公開</span
              >
              <span v-else class="privacy-status private">僅自己可見</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 專業資訊區塊 -->
      <div class="info-section">
        <h2>專業資訊</h2>
        <div class="info-grid">
          <!-- 業務類型 -->
          <div class="info-item">
            <label>主要服務類型</label>
            <span class="value">
              <span
                :class="['business-badge', currentCustomer?.businessType]"
                v-if="currentCustomer?.businessType"
              >
                {{ businessTypeLabels[currentCustomer.businessType] }}
              </span>
            </span>
          </div>

          <!-- 髮質 -->
          <div class="info-item">
            <div class="field-header">
              <label>髮質</label>
              <label v-if="isEditing" class="privacy-toggle">
                <input
                  v-model="privacySettings.hairType"
                  type="checkbox"
                  class="privacy-checkbox-inline"
                />
                <span class="privacy-label-inline">對外公開</span>
              </label>
            </div>
            <select v-if="isEditing" v-model="form.hairType">
              <option value="">請選擇髮質</option>
              <option v-for="type in hairTypes" :key="type" :value="type">
                {{ type }}
              </option>
            </select>
            <div v-else class="value-with-privacy">
              <span class="value">{{ currentCustomer?.hairType || '未設定' }}</span>
              <span v-if="currentCustomer?.privacySettings?.hairType" class="privacy-status public"
                >對外公開</span
              >
              <span v-else class="privacy-status private">僅自己可見</span>
            </div>
          </div>

          <!-- 髮色 -->
          <div class="info-item">
            <div class="field-header">
              <label>髮色</label>
              <label v-if="isEditing" class="privacy-toggle">
                <input
                  v-model="privacySettings.hairColor"
                  type="checkbox"
                  class="privacy-checkbox-inline"
                />
                <span class="privacy-label-inline">對外公開</span>
              </label>
            </div>
            <select v-if="isEditing" v-model="form.hairColor">
              <option value="">請選擇髮色</option>
              <option v-for="color in hairColors" :key="color" :value="color">
                {{ color }}
              </option>
            </select>
            <div v-else class="value-with-privacy">
              <span class="value">{{ currentCustomer?.hairColor || '未設定' }}</span>
              <span v-if="currentCustomer?.privacySettings?.hairColor" class="privacy-status public"
                >對外公開</span
              >
              <span v-else class="privacy-status private">僅自己可見</span>
            </div>
          </div>

          <!-- 膚質狀況 -->
          <div class="info-item">
            <div class="field-header">
              <label>膚質狀況</label>
              <label v-if="isEditing" class="privacy-toggle">
                <input
                  v-model="privacySettings.skinCondition"
                  type="checkbox"
                  class="privacy-checkbox-inline"
                />
                <span class="privacy-label-inline">對外公開</span>
              </label>
            </div>
            <select v-if="isEditing" v-model="form.skinCondition">
              <option value="">請選擇膚質</option>
              <option v-for="condition in skinConditions" :key="condition" :value="condition">
                {{ condition }}
              </option>
            </select>
            <div v-else class="value-with-privacy">
              <span class="value">{{ currentCustomer?.skinCondition || '未設定' }}</span>
              <span
                v-if="currentCustomer?.privacySettings?.skinCondition"
                class="privacy-status public"
                >對外公開</span
              >
              <span v-else class="privacy-status private">僅自己可見</span>
            </div>
          </div>

          <!-- 備註 -->
          <div class="info-item full-width">
            <div class="field-header">
              <label>備註</label>
              <label v-if="isEditing" class="privacy-toggle">
                <input
                  v-model="privacySettings.notes"
                  type="checkbox"
                  class="privacy-checkbox-inline"
                />
                <span class="privacy-label-inline">對外公開</span>
              </label>
            </div>
            <textarea
              v-if="isEditing"
              v-model="form.notes"
              rows="3"
              placeholder="特殊需求、過敏史、偏好等..."
            ></textarea>
            <div v-else class="value-with-privacy">
              <span class="value">{{ currentCustomer?.notes || '無備註' }}</span>
              <span v-if="currentCustomer?.privacySettings?.notes" class="privacy-status public"
                >對外公開</span
              >
              <span v-else class="privacy-status private">僅自己可見</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 帳戶資訊區塊 -->
      <div class="info-section">
        <h2>帳戶資訊</h2>
        <div class="account-stats">
          <div class="stat-item">
            <span class="stat-label">註冊日期</span>
            <span class="stat-value">{{
              formatDate(currentCustomer?.createdAt || new Date())
            }}</span>
          </div>
          <div class="stat-item">
            <span class="stat-label">最後造訪</span>
            <span class="stat-value">
              {{ currentCustomer?.lastVisit ? formatDate(currentCustomer.lastVisit) : '無記錄' }}
            </span>
          </div>
          <div class="stat-item">
            <span class="stat-label">總消費金額</span>
            <span class="stat-value">{{ formatCurrency(currentCustomer?.totalSpent || 0) }}</span>
          </div>
        </div>
      </div>

      <!-- 隱私說明 -->
      <div class="privacy-note-section">
        <div class="privacy-note">
          <div class="note-icon">🔒</div>
          <div class="note-text">
            <p><strong>隱私設定說明：</strong></p>
            <ul>
              <li>每個欄位旁的「對外公開」選項可控制該資訊是否對服務人員可見</li>
              <li>勾選的項目將對服務人員公開，有助於提供更好的服務</li>
              <li>未勾選的項目僅您自己可以看到</li>
              <li>您可以隨時修改這些隱私設定</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customer-profile {
  padding: 2rem;
  max-width: 1000px;
  margin: 0 auto;
}

.profile-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 2px solid var(--color-border);
}

.header-content h1 {
  color: var(--color-heading);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.header-content p {
  color: var(--color-text);
  opacity: 0.8;
  font-size: 1rem;
}

.header-actions {
  display: flex;
  gap: 1rem;
}

.header-btn-group {
  display: flex;
  gap: 1rem;
}

.reload-btn,
.edit-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.reload-btn {
  background: #10b981;
  color: white;
}

.reload-btn:hover {
  background: #059669;
  transform: translateY(-2px);
}

.edit-btn {
  background: #8b5cf6;
  color: white;
}

.edit-btn:hover {
  background: #7c3aed;
  transform: translateY(-2px);
}

.editing-actions {
  display: flex;
  gap: 1rem;
}

.cancel-btn,
.save-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.cancel-btn {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.cancel-btn:hover {
  background: var(--color-background-mute);
}

.save-btn {
  background: #10b981;
  color: white;
}

.save-btn:hover:not(:disabled) {
  background: #059669;
}

.save-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.profile-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.info-section {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2rem;
}

.info-section h2 {
  color: var(--color-heading);
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
}

.info-item {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.info-item.full-width {
  grid-column: 1 / -1;
}

.field-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.field-header label {
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.9rem;
}

.privacy-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.8;
  cursor: pointer;
}

.privacy-checkbox-inline {
  width: 16px;
  height: 16px;
  accent-color: #10b981;
  cursor: pointer;
}

.privacy-label-inline {
  white-space: nowrap;
  font-weight: 400;
}

.value-with-privacy {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem 0;
  min-height: 1.5rem;
}

.info-item label {
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.9rem;
}

.info-item input,
.info-item select,
.info-item textarea {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.info-item input:focus,
.info-item select:focus,
.info-item textarea:focus {
  outline: none;
  border-color: #8b5cf6;
}

.info-item input.error,
.info-item select.error,
.info-item textarea.error {
  border-color: #ef4444;
}

.value {
  color: var(--color-heading);
  font-weight: 500;
  padding: 0.75rem 0;
  min-height: 1.5rem;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
}

.privacy-status {
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
  flex-shrink: 0;
}

.privacy-status.public {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.privacy-status.private {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.business-badge {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.business-badge.beauty {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
}

.business-badge.hair {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.business-badge.fitness {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.account-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1.5rem;
}

.stat-item {
  background: var(--color-background);
  padding: 1.5rem;
  border-radius: 8px;
  border: 1px solid var(--color-border);
  text-align: center;
}

.stat-label {
  display: block;
  color: var(--color-text);
  opacity: 0.8;
  font-size: 0.9rem;
  margin-bottom: 0.5rem;
}

.stat-value {
  color: var(--color-heading);
  font-weight: 600;
  font-size: 1.1rem;
}

.privacy-note-section {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(16, 185, 129, 0.05));
  border: 1px solid rgba(139, 92, 246, 0.2);
  border-radius: 12px;
  padding: 2rem;
}

.section-header {
  margin-bottom: 2rem;
}

.section-header h2 {
  color: var(--color-heading);
  font-size: 1.3rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.section-header p {
  color: var(--color-text);
  opacity: 0.8;
}

.privacy-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.privacy-item {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
  transition: all 0.2s ease;
}

.privacy-item:hover {
  border-color: #8b5cf6;
}

.privacy-label {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  cursor: pointer;
  position: relative;
}

.privacy-checkbox {
  position: absolute;
  opacity: 0;
  cursor: pointer;
}

.checkmark {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.privacy-checkbox:checked + .checkmark {
  background: #8b5cf6;
  border-color: #8b5cf6;
}

.privacy-checkbox:checked + .checkmark::after {
  content: '✓';
  color: white;
  font-weight: bold;
  font-size: 12px;
}

.label-text {
  flex: 1;
  color: var(--color-heading);
  font-weight: 500;
}

.visibility-status {
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 500;
  flex-shrink: 0;
}

.visibility-status.public {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.visibility-status.private {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.privacy-note {
  background: rgba(59, 130, 246, 0.05);
  border: 1px solid rgba(59, 130, 246, 0.2);
  border-radius: 8px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
}

.note-icon {
  font-size: 1.5rem;
  flex-shrink: 0;
}

.note-text {
  flex: 1;
}

.note-text p {
  color: var(--color-heading);
  margin-bottom: 0.8rem;
  font-weight: 500;
}

.note-text ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.note-text li {
  color: var(--color-text);
  margin-bottom: 0.5rem;
  padding-left: 1rem;
  position: relative;
}

.note-text li::before {
  content: '•';
  color: #3b82f6;
  position: absolute;
  left: 0;
  font-weight: bold;
}

@media (max-width: 768px) {
  .customer-profile {
    padding: 1rem;
  }

  .profile-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-actions {
    justify-content: center;
  }

  .editing-actions {
    justify-content: center;
  }

  .info-grid {
    grid-template-columns: 1fr;
  }

  .field-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .value-with-privacy {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.5rem;
  }

  .privacy-note {
    flex-direction: column;
    text-align: center;
  }

  .account-stats {
    grid-template-columns: 1fr;
  }
}
</style>
