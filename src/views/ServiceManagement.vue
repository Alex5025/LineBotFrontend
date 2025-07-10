<script setup lang="ts">
import { ref } from 'vue'
import { useServiceStore, type Service } from '../stores/service'
import ServiceForm from '../components/ServiceForm.vue'
import ServiceList from '../components/ServiceList.vue'

const serviceStore = useServiceStore()
const showAddForm = ref(false)
const selectedService = ref<Service | null>(null)

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value
  selectedService.value = null
}

const editService = (service: Service) => {
  selectedService.value = service
  showAddForm.value = true
}

const onFormSubmit = () => {
  showAddForm.value = false
  selectedService.value = null
}
</script>

<template>
  <div class="service-management">
    <div class="page-header">
      <div class="header-content">
        <h1>服務管理</h1>
        <p>管理您的服務項目、設定價格與服務時間</p>
      </div>
      <button @click="toggleAddForm" class="add-service-btn">
        <span class="btn-icon">{{ showAddForm ? '✕' : '+' }}</span>
        {{ showAddForm ? '取消' : '新增服務' }}
      </button>
    </div>

    <div class="management-content">
      <div v-if="showAddForm" class="form-section">
        <ServiceForm :service="selectedService" @submit="onFormSubmit" @cancel="toggleAddForm" />
      </div>

      <div class="list-section">
        <ServiceList @edit="editService" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.service-management {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.header-content h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.header-content p {
  color: var(--color-text);
  opacity: 0.8;
  font-size: 1rem;
}

.add-service-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: #8b5cf6;
  color: white;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.add-service-btn:hover {
  background: #7c3aed;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.management-content {
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-section {
  order: 1;
}

.list-section {
  order: 2;
}

@media (max-width: 768px) {
  .service-management {
    padding: 1rem;
  }

  .page-header {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .header-content h1 {
    font-size: 1.6rem;
  }

  .add-service-btn {
    align-self: flex-start;
  }
}
</style>
