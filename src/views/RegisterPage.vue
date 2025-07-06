<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCustomerStore } from '../stores/customer'
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const customerStore = useCustomerStore()
const authStore = useAuthStore()
const router = useRouter()

const showSuccessMessage = ref(false)
const isSubmitting = ref(false)
const isLineVerified = ref(false)
const lineUserData = ref(null)

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
  '自��捲',
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

// 模擬 LINE 驗證成功
const simulateLineVerification = () => {
  const userData = {
    lineUserId: 'new_customer_' + Date.now(),
    displayName: '新註冊顧客',
    pictureUrl: '',
    verified: true,
    verifiedAt: new Date().toISOString(),
  }

  localStorage.setItem('lineAuth', JSON.stringify(userData))
  isLineVerified.value = true
  lineUserData.value = userData

  if (!form.name) {
    form.name = userData.displayName
  }
}

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

const submitForm = async () => {
  if (!validateForm()) {
    return
  }

  isSubmitting.value = true

  try {
    // 新增客戶到系統
    customerStore.addCustomer(form)

    // 同時註冊為系統用戶
    const newCustomerId = Date.now().toString()
    authStore.loginAsCustomer({
      id: newCustomerId,
      name: form.name,
      email: form.email,
      phone: form.phone,
      lineUserId: lineUserData.value?.lineUserId,
    })

    showSuccessMessage.value = true

    // 3秒後跳轉到顧客專用頁面
    setTimeout(() => {
      router.push('/customer')
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
  router.push('/login')
}

const clearLineVerification = () => {
  localStorage.removeItem('lineAuth')
  isLineVerified.value = false
  lineUserData.value = null
}
</script>

<template>
  <div class="register-page">
    <!-- 成功訊息 -->
    <div v-if="showSuccessMessage" class="success-overlay">
      <div class="success-modal">
        <div class="success-icon">🎉</div>
        <h2>註冊成功！</h2>
        <p>歡迎加入我們！您的帳戶已經建立完成。</p>
        <p class="redirect-info">即將為您跳轉到專屬頁面...</p>
        <button @click="router.push('/customer')" class="go-dashboard-btn">立即進入</button>
      </div>
    </div>

    <div class="register-container">
      <div class="register-header">
        <button @click="goBack" class="back-btn">← 返回登入</button>
        <div class="header-content">
          <div class="logo">🌟</div>
          <h1>顧客註冊</h1>
          <p>歡迎加入我們的服務！請完成註冊流程</p>
        </div>
      </div>

      <!-- LINE 驗證區塊 -->
      <div v-if="!isLineVerified" class="line-verification-section">
        <div class="verification-card">
          <div class="line-logo">📱</div>
          <h3>身份驗證</h3>
          <p>為了保障您的權益，請先完成身份驗證</p>
          <button @click="simulateLineVerification" class="verify-btn">
            <span class="verify-icon">✓</span>
            開始驗證
          </button>
          <div class="verification-note">
            <small>這是為了確保您的帳戶安全</small>
          </div>
        </div>
      </div>

      <!-- 驗證成功提示 -->
      <div v-if="isLineVerified" class="verification-success">
        <div class="success-badge">
          <span class="success-icon">✅</span>
          <span class="success-text">身份驗證成功</span>
          <button @click="clearLineVerification" class="clear-verification-btn" type="button">
            重新驗證
          </button>
        </div>
      </div>

      <!-- 註冊步驟指示 -->
      <div v-if="isLineVerified" class="progress-indicator">
        <div class="step completed">
          <div class="step-number">1</div>
          <div class="step-label">身份驗證</div>
        </div>
        <div class="step-line"></div>
        <div class="step active">
          <div class="step-number">2</div>
          <div class="step-label">個人資料</div>
        </div>
        <div class="step-line"></div>
        <div class="step">
          <div class="step-number">3</div>
          <div class="step-label">完成註冊</div>
        </div>
      </div>

      <!-- 業務類型選擇 -->
      <div v-if="isLineVerified" class="business-type-section">
        <h2>選擇您需要的服務類型</h2>
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
          <h3>📋 基本資料</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="name">姓名 *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                :class="{ error: errors.name }"
                placeholder="請輸入您的真實姓名"
                required
              />
              <span v-if="errors.name" class="error-message">{{ errors.name }}</span>
            </div>

            <div class="form-group">
              <label for="phone">聯絡電話 *</label>
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
              <label for="email">電子信箱 *</label>
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
          <h3>👤 個人資訊</h3>
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
          <h3>💄 專業資訊</h3>
          <div class="form-grid">
            <div class="form-group">
              <label for="hairType">髮質類型</label>
              <select id="hairType" v-model="form.hairType">
                <option value="">請選擇髮質</option>
                <option v-for="type in hairTypes" :key="type" :value="type">
                  {{ type }}
                </option>
              </select>
            </div>

            <div class="form-group">
              <label for="hairColor">目前髮色</label>
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
              <label for="notes">特殊需求或備註</label>
              <textarea
                id="notes"
                v-model="form.notes"
                rows="3"
                placeholder="請告訴我們您的特殊需求、過敏史、��好等資訊..."
              ></textarea>
            </div>
          </div>
        </div>

        <div class="form-actions">
          <button type="button" @click="resetForm" class="reset-btn">清除重填</button>
          <button type="submit" :disabled="isSubmitting" class="submit-btn">
            {{ isSubmitting ? '註冊中...' : '完成註冊 🎉' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.register-page {
  min-height: 100vh;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.05), rgba(16, 185, 129, 0.05));
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

.go-dashboard-btn {
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
  margin-bottom: 2rem;
  transition: all 0.2s ease;
}

.back-btn:hover {
  background: var(--color-background-soft);
}

.header-content {
  text-align: center;
}

.logo {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.header-content h1 {
  font-size: 2.2rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
  background: linear-gradient(45deg, #8b5cf6, #10b981);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.header-content p {
  color: var(--color-text);
  opacity: 0.8;
  font-size: 1.1rem;
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
  font-size: 3rem;
  margin-bottom: 1rem;
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
}

.verify-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  background: #8b5cf6;
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

.verify-btn:hover {
  background: #7c3aed;
  transform: translateY(-2px);
}

.verify-icon {
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

.success-text {
  color: #10b981;
  font-weight: 600;
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
}

.progress-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 2rem;
  padding: 1.5rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.step-number {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  color: var(--color-text);
  border: 2px solid var(--color-border);
  background: var(--color-background);
}

.step.completed .step-number {
  background: #10b981;
  color: white;
  border-color: #10b981;
}

.step.active .step-number {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

.step-label {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.7;
}

.step.completed .step-label,
.step.active .step-label {
  opacity: 1;
  font-weight: 500;
}

.step-line {
  width: 60px;
  height: 2px;
  background: var(--color-border);
  margin: 0 1rem;
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
  padding: 1rem 2rem;
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
  background: linear-gradient(45deg, #8b5cf6, #10b981);
  color: white;
}

.submit-btn:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(139, 92, 246, 0.3);
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

  .progress-indicator {
    padding: 1rem;
  }

  .step-line {
    width: 40px;
    margin: 0 0.5rem;
  }
}
</style>
