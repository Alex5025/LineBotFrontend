<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { useCustomerStore } from '../stores/customer'
import { useRouter, useRoute } from 'vue-router'

const customerStore = useCustomerStore()
const router = useRouter()
const route = useRoute()

const showSuccessMessage = ref(false)
const isSubmitting = ref(false)
const isLineVerified = ref(false)
const lineUserData = ref(null)

// 檢查 LINE 驗證狀態
onMounted(() => {
  checkLineVerification()
})

const checkLineVerification = () => {
  // 檢查 URL 參數是否有驗證成功標記
  if (route.query.verified === 'true') {
    isLineVerified.value = true
    // 清除 URL 參數
    router.replace({ query: {} })
  }

  // 檢查 localStorage 中的 LINE 驗證資訊
  const storedAuth = localStorage.getItem('lineAuth')
  if (storedAuth) {
    try {
      const authData = JSON.parse(storedAuth)
      if (authData.verified) {
        isLineVerified.value = true
        lineUserData.value = authData
        // 自動填入一些基���資訊
        if (authData.displayName && !form.name) {
          form.name = authData.displayName
        }
      }
    } catch (error) {
      console.error('解析 LINE 驗證資料失敗:', error)
    }
  }
}

const initiateLineLogin = () => {
  // 檢查是否有設定 Channel ID
  const clientId = 'YOUR_LINE_CHANNEL_ID' // 請替換為您的 LINE Channel ID

  if (clientId === 'YOUR_LINE_CHANNEL_ID') {
    // 開發測試模式 - 模擬 LINE 驗證成功
    if (confirm('目前為測試模式，是否模擬 LINE 驗證成功？')) {
      simulateLineVerification()
      return
    }
  }

  const redirectUri = encodeURIComponent(`${window.location.origin}/auth/line/callback`)
  const state = Math.random().toString(36).substring(7) // 生成隨機 state
  const scope = 'profile%20openid'

  const lineLoginUrl = `https://access.line.me/oauth2/v2.1/authorize?response_type=code&client_id=${clientId}&redirect_uri=${redirectUri}&state=${state}&scope=${scope}`

  // 儲存 state 用於驗證
  localStorage.setItem('lineOAuthState', state)

  // 跳轉到 LINE 登入頁面
  window.location.href = lineLoginUrl
}

// 模擬 LINE 驗證成功（用於開發測試）
const simulateLineVerification = () => {
  const userData = {
    lineUserId: 'test_line_user_' + Date.now(),
    displayName: '測試用戶',
    pictureUrl: '',
    verified: true,
    verifiedAt: new Date().toISOString(),
  }

  localStorage.setItem('lineAuth', JSON.stringify(userData))

  // 更新狀態
  isLineVerified.value = true
  lineUserData.value = userData

  // 自動填入姓名
  if (!form.name) {
    form.name = userData.displayName
  }
}

// 清除驗證狀態（用於測試）
const clearLineVerification = () => {
  localStorage.removeItem('lineAuth')
  localStorage.removeItem('lineOAuthState')
  isLineVerified.value = false
  lineUserData.value = null
}

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
  businessType: 'beauty' as 'beauty' | 'hair' | 'fitness',
  notes: '',
})

const errors = ref<Record<string, string>>({})

const businessTypes = [
  { value: 'beauty', label: '美容美體', icon: '💆‍♀️' },
  { value: 'hair', label: '美髮造型', icon: '💇‍♀️' },
  { value: 'fitness', label: '健身指導', icon: '💪' },
]

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
    errors.value.age = '年齡必須在1-120之��'
  }

  if (form.height < 1 || form.height > 300) {
    errors.value.height = '身高必須在1-300公分之間'
  }

  if (form.weight < 1 || form.weight > 500) {
    errors.value.weight = '體重必須在1-500公斤之間'
  }

  return Object.keys(errors.value).length === 0
}

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    customerStore.addCustomer(form)
    showSuccessMessage.value = true

    // 3秒後自動跳轉回首頁
    setTimeout(() => {
      router.push('/')
    }, 3000)
  } catch (error) {
    console.error('註冊失敗:', error)
  } finally {
    isSubmitting.value = false
  }
}

const resetForm = () => {
  Object.assign(form, {
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
    businessType: 'beauty' as const,
    notes: '',
  })
  errors.value = {}
}

const goBack = () => {
  router.push('/')
}
</script>

<template>
  <div class="customer-register">
    <!-- 成功訊息 -->
    <div v-if="showSuccessMessage" class="success-overlay">
      <div class="success-modal">
        <div class="success-icon">✅</div>
        <h2>註��成功！</h2>
        <p>感謝您的註冊，我們會盡快與您聯繫。</p>
        <p class="redirect-info">3秒後自動返回首頁...</p>
        <button @click="goBack" class="go-back-btn">立即返回</button>
      </div>
    </div>

    <div class="register-container">
      <div class="register-header">
        <button @click="goBack" class="back-btn">← 返回首頁</button>
        <div class="header-content">
          <h1>客戶資料註冊</h1>
          <p>請填寫您的個人資料，讓我們為您提供更好的服務</p>
        </div>
      </div>

      <!-- LINE 驗證區塊 -->
      <div v-if="!isLineVerified" class="line-verification-section">
        <div class="verification-card">
          <div class="line-logo">
            <img
              src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPHJlY3Qgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiByeD0iOCIgZmlsbD0iIzAwQzMwMCIvPgo8cGF0aCBkPSJNMjguNSAxNi41QzI4LjUgMTMuNDYyNCAyNS41Mzc2IDExIDIyIDExSDEyQzguNDYyNDMgMTEgNS41IDEzLjQ2MjQgNS41IDE2LjVWMjMuNUM1LjUgMjYuNTM3NiA4LjQ2MjQzIDI5IDEyIDI5SDE1LjVMMjAgMzJWMjlIMjJDMjUuNTM3NiAyOSAyOC41IDI2LjUzNzYgMjguNSAyMy41VjE2LjVaIiBmaWxsPSJ3aGl0ZSIvPgo8L3N2Zz4K"
              alt="LINE"
            />
          </div>
          <h3>LINE 驗證</h3>
          <p>為了確保您的身份安全，請先透過 LINE 進行驗證</p>
          <button @click="initiateLineLogin" class="line-login-btn">
            <span class="line-icon">📱</span>
            使用 LINE 登入
          </button>
          <div class="verification-note">
            <small>這將會跳轉到 LINE 官方頁面進行安全驗證</small>
          </div>

          <!-- 開發測試按鈕 -->
          <div class="dev-controls">
            <small style="color: #666; display: block; margin: 1rem 0 0.5rem">開發測試功能：</small>
            <button @click="simulateLineVerification" class="test-btn" type="button">
              模擬驗證成功
            </button>
          </div>
        </div>
      </div>

      <!-- 驗證成功提示 -->
      <div v-if="isLineVerified" class="verification-success">
        <div class="success-badge">
          <span class="success-icon">✅</span>
          <span class="success-text">LINE 驗證成功</span>
          <span v-if="lineUserData?.displayName" class="user-name">
            歡迎，{{ lineUserData.displayName }}
          </span>
          <button @click="clearLineVerification" class="clear-verification-btn" type="button">
            重新驗證
          </button>
        </div>
      </div>

      <!-- 業務類型選擇 -->
      <div v-if="isLineVerified" class="business-type-section">
        <h2>請選擇服務類型</h2>
        <div class="business-types">
          <label
            v-for="type in businessTypes"
            :key="type.value"
            :class="['business-type-card', { selected: form.businessType === type.value }]"
          >
            <input
              v-model="form.businessType"
              :value="type.value"
              type="radio"
              name="businessType"
            />
            <div class="type-icon">{{ type.icon }}</div>
            <div class="type-label">{{ type.label }}</div>
          </label>
        </div>
      </div>

      <form v-if="isLineVerified" @submit.prevent="submitForm" class="register-form">
        <!-- 基本資料 -->
        <div class="form-section">
          <h3>基本資料</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="name">姓名 *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                :class="{ error: errors.name }"
                placeholder="請輸入您的姓名"
                required
              />
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="phone">電話 *</label>
              <input
                id="phone"
                v-model="form.phone"
                type="tel"
                :class="{ error: errors.phone }"
                placeholder="0912-345-678"
                required
              />
              <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
            </div>

            <div class="form-group full-width">
              <label for="email">Email *</label>
              <input
                id="email"
                v-model="form.email"
                type="email"
                :class="{ error: errors.email }"
                placeholder="example@email.com"
                required
              />
              <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
            </div>

            <div class="form-group full-width">
              <label for="address">地址</label>
              <input id="address" v-model="form.address" type="text" placeholder="請輸入完整地址" />
            </div>
          </div>
        </div>

        <!-- 個人資訊 -->
        <div class="form-section">
          <h3>個人資訊</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="age">年齡 *</label>
              <input
                id="age"
                v-model.number="form.age"
                type="number"
                min="1"
                max="120"
                :class="{ error: errors.age }"
                placeholder="25"
                required
              />
              <span v-if="errors.age" class="error-message">{{ errors.age }}</span>
            </div>

            <div class="form-group">
              <label for="height">身高 (cm) *</label>
              <input
                id="height"
                v-model.number="form.height"
                type="number"
                min="1"
                max="300"
                :class="{ error: errors.height }"
                placeholder="165"
                required
              />
              <span v-if="errors.height" class="error-message">{{ errors.height }}</span>
            </div>

            <div class="form-group">
              <label for="weight">體重 (kg) *</label>
              <input
                id="weight"
                v-model.number="form.weight"
                type="number"
                min="1"
                max="500"
                :class="{ error: errors.weight }"
                placeholder="60"
                required
              />
              <span v-if="errors.weight" class="error-message">{{ errors.weight }}</span>
            </div>

            <div class="form-group">
              <label for="occupation">職業</label>
              <input
                id="occupation"
                v-model="form.occupation"
                type="text"
                placeholder="請輸入職業"
              />
            </div>
          </div>
        </div>

        <!-- 詳細資訊 -->
        <div class="form-section">
          <h3>詳細資訊</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="hairType">髮質</label>
              <select id="hairType" v-model="form.hairType">
                <option value="">請選擇髮質</option>
                <option v-for="type in hairTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="hairColor">髮色</label>
              <select id="hairColor" v-model="form.hairColor">
                <option value="">請選擇髮色</option>
                <option v-for="color in hairColors" :key="color" :value="color">
                  {{ color }}
                </option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="skinCondition">膚質狀況</label>
              <select id="skinCondition" v-model="form.skinCondition">
                <option value="">請選擇膚質</option>
                <option v-for="condition in skinConditions" :key="condition" :value="condition">
                  {{ condition }}
                </option>
              </select>
            </div>

            <div class="form-group full-width">
              <label for="notes">備註</label>
              <textarea
                id="notes"
                v-model="form.notes"
                rows="3"
                placeholder="特殊需求、過敏史、偏好等..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="resetForm" class="reset-btn">清除重填</button>
          <button type="submit" :disabled="isSubmitting" class="submit-btn">
            {{ isSubmitting ? '提交中...' : '完成註冊' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.customer-register {
  min-height: 100vh;
  background: var(--color-background);
  position: relative;
}

.success-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.success-modal {
  background: var(--color-background-soft);
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  border: 1px solid var(--color-border);
  max-width: 400px;
  margin: 1rem;
}

.success-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.success-modal h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.success-modal p {
  color: var(--color-text);
  margin-bottom: 1rem;
}

.redirect-info {
  font-size: 0.9rem;
  opacity: 0.7;
}

.go-back-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.8rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  margin-top: 1rem;
}

.register-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem;
}

.line-verification-section {
  margin-bottom: 2rem;
}

.verification-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 16px;
  padding: 3rem 2rem;
  text-align: center;
}

.line-logo {
  margin-bottom: 1rem;
}

.line-logo img {
  width: 60px;
  height: 60px;
}

.verification-card h3 {
  color: var(--color-heading);
  margin-bottom: 0.5rem;
  font-size: 1.5rem;
  font-weight: 600;
}

.verification-card p {
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 2rem;
  font-size: 1rem;
}

.line-login-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #00c300;
  color: white;
  border: none;
  padding: 1rem 2rem;
  border-radius: 10px;
  font-size: 1.1rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  margin-bottom: 1rem;
}

.line-login-btn:hover {
  background: #00a000;
  transform: translateY(-2px);
}

.line-icon {
  font-size: 1.2rem;
}

.verification-note {
  color: var(--color-text);
  opacity: 0.6;
  font-size: 0.85rem;
}

.verification-success {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid #10b981;
  border-radius: 12px;
  padding: 1rem 1.5rem;
  margin-bottom: 2rem;
}

.success-badge {
  display: flex;
  align-items: center;
  gap: 0.8rem;
  justify-content: center;
}

.success-icon {
  font-size: 1.2rem;
}

.success-text {
  color: #10b981;
  font-weight: 600;
}

.user-name {
  color: var(--color-text);
  opacity: 0.8;
  font-size: 0.9rem;
}

.dev-controls {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.test-btn {
  background: #f59e0b;
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.test-btn:hover {
  background: #d97706;
}

.clear-verification-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  margin-left: 1rem;
  transition: all 0.2s ease;
}

.clear-verification-btn:hover {
  background: #dc2626;
}

.register-header {
  margin-bottom: 2rem;
}

.back-btn {
  background: transparent;
  border: 1px solid var(--color-border);
  color: var(--color-text);
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  margin-bottom: 1rem;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: var(--color-background-soft);
}

.header-content {
  text-align: center;
}

.header-content h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.header-content p {
  color: var(--color-text);
  opacity: 0.8;
  font-size: 1.1rem;
}

.business-type-section {
  margin-bottom: 2rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
}

.business-type-section h2 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  text-align: center;
}

.business-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
}

.business-type-card {
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.business-type-card input {
  position: absolute;
  opacity: 0;
}

.business-type-card:hover {
  border-color: #8b5cf6;
  transform: translateY(-2px);
}

.business-type-card.selected {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.1);
}

.type-icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.type-label {
  font-weight: 600;
  color: var(--color-heading);
}

.register-form {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
}

.form-section h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-weight: 600;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-group.full-width {
  grid-column: 1 / -1;
}

.form-group label {
  font-weight: 500;
  color: var(--color-text);
  font-size: 0.9rem;
}

.form-group input,
.form-group select,
.form-group textarea {
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #8b5cf6;
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 1rem;
}

.reset-btn,
.submit-btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.reset-btn {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.reset-btn:hover {
  background: var(--color-background-mute);
}

.submit-btn {
  background: #10b981;
  color: white;
}

.submit-btn:hover:not(:disabled) {
  background: #059669;
  transform: translateY(-2px);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

@media (max-width: 768px) {
  .register-container {
    padding: 1rem;
  }

  .header-content h1 {
    font-size: 1.8rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .business-types {
    grid-template-columns: 1fr;
  }

  .form-actions {
    flex-direction: column;
  }

  .success-modal {
    padding: 2rem;
  }
}
</style>
