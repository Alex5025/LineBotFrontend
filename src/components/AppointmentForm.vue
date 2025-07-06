<script setup lang="ts">
import { ref, reactive, computed } from 'vue'
import { useCustomerStore } from '../stores/customer'
import { useServiceStore } from '../stores/service'
import { useCustomerActivityStore } from '../stores/customerActivity'

const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const customerStore = useCustomerStore()
const serviceStore = useServiceStore()
const activityStore = useCustomerActivityStore()

const form = reactive({
  customerId: '',
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
    customerId: '',
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

  if (!form.customerId) {
    errors.value.customerId = '請選擇客戶'
  }

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

  // 添加預約活動
  activityStore.addActivity({
    customerId: form.customerId,
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
</script>

<template>
  <div class="appointment-form">
    <div class="form-header">
      <h2>新增客戶預約</h2>
      <p>為客戶安排服務預約</p>
    </div>

    <form @submit.prevent="submitForm" class="form-content">
      <div class="form-grid">
        <!-- 客戶選擇 -->
        <div class="form-group">
          <label for="customer">客戶 *</label>
          <select
            id="customer"
            v-model="form.customerId"
            :class="{ error: errors.customerId }"
            @change="errors.customerId = ''"
          >
            <option value="">請選擇客戶</option>
            <option
              v-for="customer in customerStore.customers"
              :key="customer.id"
              :value="customer.id"
            >
              {{ customer.name }} - {{ customer.phone }}
            </option>
          </select>
          <span v-if="errors.customerId" class="error-message">{{ errors.customerId }}</span>
        </div>

        <!-- 服務選擇 -->
        <div class="form-group">
          <label for="service">服務項目 *</label>
          <select
            id="service"
            v-model="form.serviceId"
            :class="{ error: errors.serviceId }"
            @change="onServiceChange"
          >
            <option value="">請選擇服務</option>
            <option
              v-for="service in serviceStore.activeServices"
              :key="service.id"
              :value="service.id"
            >
              {{ service.name }} - NT${{ service.price.toLocaleString() }} ({{
                service.duration
              }}分鐘)
            </option>
          </select>
          <span v-if="errors.serviceId" class="error-message">{{ errors.serviceId }}</span>
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

        <!-- 服務費用 -->
        <div class="form-group">
          <label for="amount">服務費用 (NT$)</label>
          <input
            id="amount"
            v-model.number="form.amount"
            type="number"
            min="0"
            placeholder="自動填入"
            :readonly="!!selectedService"
          />
        </div>

        <!-- 備註 -->
        <div class="form-group full-width">
          <label for="notes">備註</label>
          <textarea
            id="notes"
            v-model="form.notes"
            rows="3"
            placeholder="特殊需求、注意事項等..."
          ></textarea>
        </div>

        <!-- 錯誤訊息 -->
        <div v-if="errors.datetime" class="form-group full-width">
          <span class="error-message">{{ errors.datetime }}</span>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="cancelForm" class="cancel-btn">取消</button>
        <button type="submit" class="submit-btn">新增預約</button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.appointment-form {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--color-border);
}

.form-header {
  margin-bottom: 2rem;
  text-align: center;
}

.form-header h2 {
  color: var(--color-heading);
  font-size: 1.5rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
}

.form-header p {
  color: var(--color-text);
  opacity: 0.8;
}

.form-content {
  display: flex;
  flex-direction: column;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
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
  border-radius: 6px;
  background: var(--color-background-soft);
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

.form-group input[readonly] {
  background: var(--color-background-mute);
  opacity: 0.7;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  margin-top: 0.2rem;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
}

.cancel-btn,
.submit-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
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

.submit-btn {
  background: #8b5cf6;
  color: white;
}

.submit-btn:hover {
  background: #7c3aed;
}

@media (max-width: 768px) {
  .appointment-form {
    padding: 1rem;
  }

  .form-grid {
    grid-template-columns: 1fr;
    gap: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
