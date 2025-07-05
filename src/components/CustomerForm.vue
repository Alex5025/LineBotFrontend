<script setup lang="ts">
import { ref, reactive, watch } from 'vue'
import { useCustomerStore, type Customer } from '../stores/customer'

interface Props {
  customer?: Customer | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const customerStore = useCustomerStore()

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
  { value: 'beauty', label: '美容美體' },
  { value: 'hair', label: '美髮造型' },
  { value: 'fitness', label: '健身指導' },
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
  '痘痘���',
  '老化肌膚',
  '色素沉澱',
]

// 監聽 props 變化，用於編輯模式
watch(
  () => props.customer,
  (customer) => {
    if (customer) {
      Object.assign(form, {
        name: customer.name,
        phone: customer.phone,
        email: customer.email,
        address: customer.address,
        age: customer.age,
        height: customer.height,
        weight: customer.weight,
        occupation: customer.occupation,
        hairType: customer.hairType,
        hairColor: customer.hairColor,
        skinCondition: customer.skinCondition,
        businessType: customer.businessType,
        notes: customer.notes,
      })
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

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

const submitForm = () => {
  if (!validateForm()) {
    return
  }

  if (props.customer) {
    customerStore.updateCustomer(props.customer.id, form)
  } else {
    customerStore.addCustomer(form)
  }

  emit('submit')
  resetForm()
}

const cancelForm = () => {
  resetForm()
  emit('cancel')
}
</script>

<template>
  <div class="customer-form">
    <div class="form-header">
      <h2>{{ customer ? '編輯客戶' : '新增客戶' }}</h2>
      <p>請填寫客戶的詳細資料</p>
    </div>

    <form @submit.prevent="submitForm" class="form-content">
      <div class="form-grid">
        <!-- 基本資料 -->
        <div class="form-section">
          <h3>基本資料</h3>
          <div class="form-row">
            <div class="form-group">
              <label for="name">姓名 *</label>
              <input
                id="name"
                v-model="form.name"
                type="text"
                :class="{ error: errors.name }"
                placeholder="請輸入姓名"
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
              />
              <span v-if="errors.phone" class="error-message">{{ errors.phone }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              id="email"
              v-model="form.email"
              type="email"
              :class="{ error: errors.email }"
              placeholder="example@email.com"
            />
            <span v-if="errors.email" class="error-message">{{ errors.email }}</span>
          </div>

          <div class="form-group">
            <label for="address">地址</label>
            <input id="address" v-model="form.address" type="text" placeholder="請輸入完整地址" />
          </div>
        </div>

        <!-- 個人資訊 -->
        <div class="form-section">
          <h3>個人資訊</h3>
          <div class="form-row">
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
              />
              <span v-if="errors.weight" class="error-message">{{ errors.weight }}</span>
            </div>
          </div>

          <div class="form-group">
            <label for="occupation">職業</label>
            <input id="occupation" v-model="form.occupation" type="text" placeholder="請輸入職業" />
          </div>
        </div>

        <!-- 專業資訊 -->
        <div class="form-section">
          <h3>專業資訊</h3>
          <div class="form-group">
            <label for="businessType">業務類型</label>
            <select id="businessType" v-model="form.businessType">
              <option v-for="type in businessTypes" :key="type.value" :value="type.value">
                {{ type.label }}
              </option>
            </select>
          </div>

          <div class="form-row">
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
          </div>

          <div class="form-group">
            <label for="skinCondition">膚質狀況</label>
            <select id="skinCondition" v-model="form.skinCondition">
              <option value="">請選擇膚質</option>
              <option v-for="condition in skinConditions" :key="condition" :value="condition">
                {{ condition }}
              </option>
            </select>
          </div>

          <div class="form-group">
            <label for="notes">備註</label>
            <textarea
              id="notes"
              v-model="form.notes"
              rows="3"
              placeholder="特殊需��、過敏史、偏好等..."
            ></textarea>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="button" @click="cancelForm" class="cancel-btn">取消</button>
        <button type="submit" class="submit-btn">
          {{ customer ? '更新客戶' : '新增客戶' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.customer-form {
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
  grid-template-columns: 1fr;
  gap: 2rem;
  margin-bottom: 2rem;
}

.form-section {
  background: var(--color-background);
  border-radius: 8px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
}

.form-section h3 {
  color: var(--color-heading);
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 1rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-border);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
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

@media (min-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr 1fr;
  }

  .form-section:last-child {
    grid-column: 1 / -1;
  }

  .form-row {
    grid-template-columns: 1fr 1fr;
  }

  .form-row.triple {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media (max-width: 767px) {
  .customer-form {
    padding: 1rem;
  }

  .form-actions {
    flex-direction: column;
  }
}
</style>
