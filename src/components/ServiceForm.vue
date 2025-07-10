<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import { useServiceStore, type Service } from '../stores/service'

interface Props {
  service?: Service | null
}

const props = defineProps<Props>()
const emit = defineEmits<{
  submit: []
  cancel: []
}>()

const serviceStore = useServiceStore()

// 從 pinia 取得所有服務分類（唯一值）
const categories = computed(() => {
  const all = serviceStore.services?.map(s => s.category) || []
  // 若資料庫為空，給預設三個分類
  const base = ['beauty', 'hair', 'fitness']
  return Array.from(new Set([...base, ...all])).map((cat) => {
    if (cat === 'beauty') return { value: 'beauty', label: '美容美體' }
    if (cat === 'hair') return { value: 'hair', label: '美髮造型' }
    if (cat === 'fitness') return { value: 'fitness', label: '健身指導' }
    return { value: cat, label: cat }
  })
})

const form = reactive({
  name: '',
  description: '',
  price: 0,
  duration: 60,
  category: 'beauty' as 'beauty' | 'hair' | 'fitness',
  isActive: true,
})

// 先宣告 resetForm，避免 watch 取用時尚未初始化
const resetForm = () => {
  Object.assign(form, {
    name: '',
    description: '',
    price: 0,
    duration: 60,
    category: 'beauty' as const,
    isActive: true,
  })
}

watch(
  () => props.service,
  (service) => {
    if (service) {
      Object.assign(form, {
        name: service.name,
        description: service.description,
        price: service.price,
        duration: service.duration,
        category: service.category,
        isActive: service.isActive,
      })
    } else {
      resetForm()
    }
  },
  { immediate: true },
)

const submitForm = () => {
  if (props.service) {
    serviceStore.updateService(props.service.id, form)
  } else {
    serviceStore.addService(form)
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
  <div class="service-form">
    <div class="form-header">
      <h2>{{ service ? '編輯服務' : '新增服務' }}</h2>
    </div>

    <form @submit.prevent="submitForm" class="form-content">
      <div class="form-group">
        <label for="name">服務名稱</label>
        <input id="name" v-model="form.name" type="text" required />
      </div>

      <div class="form-group">
        <label for="description">服務描述</label>
        <textarea id="description" v-model="form.description" rows="3"></textarea>
      </div>

      <div class="form-row">
        <div class="form-group">
          <label for="price">價格 (TWD)</label>
          <input id="price" v-model.number="form.price" type="number" min="0" required />
        </div>

        <div class="form-group">
          <label for="duration">時間 (分鐘)</label>
          <input id="duration" v-model.number="form.duration" type="number" min="1" required />
        </div>
      </div>

      <div class="form-group">
        <label for="category">類別</label>
        <select id="category" v-model="form.category">
          <option v-for="cat in categories" :key="cat.value" :value="cat.value">
            {{ cat.label }}
          </option>
        </select>
      </div>

      <div class="form-group">
        <label class="checkbox-label">
          <input v-model="form.isActive" type="checkbox" />
          啟用此服務
        </label>
      </div>

      <div class="form-actions">
        <button type="button" @click="cancelForm" class="cancel-btn">取消</button>
        <button type="submit" class="submit-btn">
          {{ service ? '更新' : '新增' }}
        </button>
      </div>
    </form>
  </div>
</template>

<style scoped>
.service-form {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 2rem;
  border: 1px solid var(--color-border);
}

.form-header h2 {
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: var(--color-text);
  font-weight: 500;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.checkbox-label input {
  width: auto;
}

.form-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}

.cancel-btn,
.submit-btn {
  padding: 0.75rem 1.5rem;
  border: none;
  border-radius: 6px;
  font-weight: 600;
  cursor: pointer;
}

.cancel-btn {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.submit-btn {
  background: #8b5cf6;
  color: white;
}

.submit-btn:hover {
  background: #7c3aed;
}
</style>
