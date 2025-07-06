<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useServiceStore } from '../stores/service'
import { useCustomerActivityStore } from '../stores/customerActivity'

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const authStore = useAuthStore()
const serviceStore = useServiceStore()
const activityStore = useCustomerActivityStore()

const form = reactive({
  serviceId: '',
  date: '',
  time: '',
  notes: '',
  amount: 0,
})

const errors = ref<Record<string, string>>({})

const selectedService = computed(() => {
  return serviceStore.services.find((service) => service.id === form.serviceId)
})

const resetForm = () => {
  Object.assign(form, {
    serviceId: '',
    date: '',
    time: '',
    notes: '',
    amount: 0,
  })
  errors.value = {}
}

const validateForm = () => {
  errors.value = {}

  if (!form.serviceId) {
    errors.value.serviceId = '請選擇服務項目'
  }

  if (!form.date) {
    errors.value.date = '請選擇預約日期'
  }

  if (!form.time) {
    errors.value.time = '請選擇預約時間'
  }

  // 檢查日期是否為過去時間
  if (form.date && form.time) {
    const appointmentDateTime = new Date(`${form.date}T${form.time}`)
    const now = new Date()
    if (appointmentDateTime <= now) {
      errors.value.datetime = '預約時間不能是過去時間'
    }
  }

  return Object.keys(errors.value).length === 0
}

// 當選擇服務時自動填入價格
const onServiceChange = () => {
  if (selectedService.value) {
    form.amount = selectedService.value.price
  }
}

const submitForm = () => {
  if (!validateForm()) {
    return
  }

  const appointmentDateTime = new Date(`${form.date}T${form.time}`)
  const customerId = authStore.currentUser?.id || '1'

  // 添加預約活動
  activityStore.addActivity({
    customerId: customerId,
    type: 'appointment',
    title: selectedService.value?.name || '',
    description: selectedService.value?.description || '',
    date: appointmentDateTime,
    status: 'scheduled',
    serviceId: form.serviceId,
    amount: form.amount,
    notes: form.notes,
  })

  emit('submit')
  resetForm()
}

const cancelForm = () => {
  resetForm()
  emit('cancel')
}

// 生成時間選項（從08:00到20:00，每30分鐘一個時段）
const timeOptions = computed(() => {
  const options = []
  for (let hour = 8; hour <= 20; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`
      options.push(timeString)
    }
  }
  return options
})

// 獲取最小日期（明天）
const minDate = computed(() => {
  const tomorrow = new Date()
  tomorrow.setDate(tomorrow.getDate() + 1)
  return tomorrow.toISOString().split('T')[0]
})

// 格式化貨幣
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(amount)
}

// 獲取服務類別標籤
const getServiceCategoryLabel = (category: string) => {
  const labels = {
    beauty: '美容美體',
    hair: '美髮造型',
    fitness: '健身指導',
  }
  return labels[category as keyof typeof labels] || category
}
</script>

<template>
  <div class="customer-appointment-form">
    <div class="form-header">
      <h2>預約服務</h2>
      <p>選擇您需要的服務並安排預約時間</p>
    </div>

    <form @submit.prevent="submitForm" class="form-content">
      <div class="form-grid">
        <!-- 服務選擇 -->
        <div class="form-group">
          <label for="service">選擇服務 *</label>
          <select
            id="service"
            v-model="form.serviceId"
            :class="{ error: errors.serviceId }"
            @change="onServiceChange"
          >
            <option value="">請選擇服務項目</option>
            <optgroup
              v-for="category in ['beauty', 'hair', 'fitness']"
              :key="category"
              :label="getServiceCategoryLabel(category)"
            >
              <option
                v-for="service in serviceStore.activeServices.filter(
                  (s) => s.category === category,
                )"
                :key="service.id"
                :value="service.id"
              >
                {{ service.name }} - {{ formatCurrency(service.price) }} ({{
                  service.duration
                }}分鐘)
              </option>
            </optgroup>
          </select>
          <span v-if="errors.serviceId" class="error-message">{{ errors.serviceId }}</span>
        </div>

        <!-- 服務詳情 -->
        <div v-if="selectedService" class="service-preview">
          <h3>服務詳情</h3>
          <div class="service-info">
            <div class="service-name">{{ selectedService.name }}</div>
            <div class="service-description">{{ selectedService.description }}</div>
            <div class="service-details">
              <span class="service-category">
                {{ getServiceCategoryLabel(selectedService.category) }}
              </span>
              <span class="service-duration">{{ selectedService.duration }} 分鐘</span>
              <span class="service-price">{{ formatCurrency(selectedService.price) }}</span>
            </div>
          </div>
        </div>

        <!-- 預約日期 -->
        <div class="form-group">
          <label for="date">預約日期 *</label>
          <input
            id="date"
            v-model="form.date"
            type="date"
            :min="minDate"
            :class="{ error: errors.date }"
            @change="errors.date = ''"
          />
          <span v-if="errors.date" class="error-message">{{ errors.date }}</span>
        </div>

        <!-- 預約時間 -->
        <div class="form-group">
          <label for="time">預約時間 *</label>
          <select
            id="time"
            v-model="form.time"
            :class="{ error: errors.time }"
            @change="errors.time = ''"
          >
            <option value="">請選擇時間</option>
            <option v-for="time in timeOptions" :key="time" :value="time">
              {{ time }}
            </option>
          </select>
          <span v-if="errors.time" class="error-message">{{ errors.time }}</span>
        </div>

        <!-- 特殊需求 -->
        <div class="form-group full-width">
          <label for="notes">特殊需求或備註</label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="3"
            placeholder="請告訴我們您的特殊需求、過敏史或其他注意事��..."
          ></textarea>
        </div>

        <!-- 預約確認 -->
        <div v-if="selectedService && form.date && form.time" class="appointment-summary">
          <h3>預約確認</h3>
          <div class="summary-details">
            <div class="summary-item">
              <span class="label">服務項目：</span>
              <span class="value">{{ selectedService.name }}</span>
            </div>
            <div class="summary-item">
              <span class="label">預約時間：</span>
              <span class="value">{{ form.date }} {{ form.time }}</span>
            </div>
            <div class="summary-item">
              <span class="label">服務時長：</span>
              <span class="value">{{ selectedService.duration }} 分鐘</span>
            </div>
            <div class="summary-item">
              <span class="label">服務費用：</span>
              <span class="value price">{{ formatCurrency(selectedService.price) }}</span>
            </div>
          </div>
        </div>

        <!-- 錯誤訊息 -->
        <div v-if="errors.datetime" class="form-group full-width">
          <span class="error-message">{{ errors.datetime }}</span>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="cancelForm" class="cancel-btn">取消</button>
        <button type="submit" class="submit-btn">確認預約</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.customer-appointment-form {
  background: var(--color-background-soft);
  border-radius: 16px;
  padding: 2rem;
  border: 1px solid var(--color-border);
  max-width: 800px;
  margin: 0 auto;
}

.form-header {
  text-align: center;
  margin-bottom: 2rem;
}

.form-header h2 {
  color: var(--color-heading);
  font-size: 1.8rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: var(--color-text);
  opacity: 0.8;
  font-size: 1.1rem;
}

.form-content {
  display: flex;
  flex-direction: column;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
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
  border-radius: 8px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
  transition: border-color 0.2s ease;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 0 3px rgba(16, 185, 129, 0.1);
}

.form-group input.error,
.form-group select.error,
.form-group textarea.error {
  border-color: #ef4444;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

.service-preview {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.service-preview h3 {
  color: var(--color-heading);
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.service-info {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.service-name {
  font-weight: 600;
  color: var(--color-heading);
  font-size: 1.1rem;
}

.service-description {
  color: var(--color-text);
  line-height: 1.4;
}

.service-details {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.service-category {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.service-duration {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.service-price {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 600;
}

.appointment-summary {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
  border: 1px solid rgba(16, 185, 129, 0.2);
  border-radius: 12px;
  padding: 1.5rem;
  margin: 1rem 0;
}

.appointment-summary h3 {
  color: var(--color-heading);
  font-weight: 600;
  margin-bottom: 1rem;
  font-size: 1.1rem;
}

.summary-details {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.summary-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.summary-item .label {
  color: var(--color-text);
  opacity: 0.8;
  font-weight: 500;
}

.summary-item .value {
  color: var(--color-heading);
  font-weight: 500;
}

.summary-item .value.price {
  color: #10b981;
  font-weight: 600;
  font-size: 1.1rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.cancel-btn,
.submit-btn {
  padding: 0.8rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.cancel-btn {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.cancel-btn:hover {
  background: var(--color-background-mute);
}

.submit-btn {
  background: linear-gradient(135deg, #10b981, #06b6d4);
  color: white;
}

.submit-btn:hover {
  background: linear-gradient(135deg, #059669, #0891b2);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }

  .form-actions {
    justify-content: flex-end;
  }
}

@media (max-width: 767px) {
  .customer-appointment-form {
    padding: 1rem;
  }

  .service-details {
    flex-direction: column;
    gap: 0.5rem;
  }

  .summary-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.3rem;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
