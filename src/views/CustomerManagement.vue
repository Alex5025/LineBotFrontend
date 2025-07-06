<script setup lang="ts">
import { ref, computed } from 'vue'
import { useCustomerStore } from '../stores/customer'
import CustomerForm from '../components/CustomerForm.vue'
import CustomerList from '../components/CustomerList.vue'

const customerStore = useCustomerStore()
const showAddForm = ref(false)
const selectedCustomer = ref(null)

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value
  selectedCustomer.value = null
}

const editCustomer = (customer: any) => {
  selectedCustomer.value = customer
  showAddForm.value = true
}

const onFormSubmit = () => {
  showAddForm.value = false
  selectedCustomer.value = null
}
</script>

<template>
  <div class="customer-management">
    <div class="page-header">
      <div class="header-content">
        <h1>客戶管理</h1>
        <p>管理您的客戶資料，追蹤客戶資訊與服務紀錄</p>
      </div>
      <button @click="toggleAddForm" class="add-customer-btn">
        <span class="btn-icon">{{ showAddForm ? '✕' : '+' }}</span>
        {{ showAddForm ? '取消' : '新增客戶' }}
      </button>
    </div>

    <div class="management-content">
      <div v-if="showAddForm" class="form-section">
        <CustomerForm :customer="selectedCustomer" @submit="onFormSubmit" @cancel="toggleAddForm" />
      </div>

      <div class="list-section">
        <CustomerList @edit="editCustomer" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.customer-management {
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

.add-customer-btn {
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

.add-customer-btn:hover {
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
  .customer-management {
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

  .add-customer-btn {
    align-self: flex-start;
  }
}
</style>
