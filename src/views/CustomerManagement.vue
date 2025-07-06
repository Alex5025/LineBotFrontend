<script setup lang="ts">
import { ref } from 'vue'
import { useCustomerStore } from '../stores/customer'
import CustomerForm from '../components/CustomerForm.vue'
import CustomerList from '../components/CustomerList.vue'
import AppointmentForm from '../components/AppointmentForm.vue'

const customerStore = useCustomerStore()
const showAddForm = ref(false)
const showAppointmentForm = ref(false)
const selectedCustomer = ref(null)

const toggleAddForm = () => {
  showAddForm.value = !showAddForm.value
  showAppointmentForm.value = false
  selectedCustomer.value = null
}

const toggleAppointmentForm = () => {
  showAppointmentForm.value = !showAppointmentForm.value
  showAddForm.value = false
  selectedCustomer.value = null
}

const editCustomer = (customer: any) => {
  selectedCustomer.value = customer
  showAddForm.value = true
  showAppointmentForm.value = false
}

const onFormSubmit = () => {
  showAddForm.value = false
  selectedCustomer.value = null
}

const onAppointmentSubmit = () => {
  showAppointmentForm.value = false
}
</script>

<template>
  <div class="customer-management">
    <div class="page-header">
      <div class="header-content">
        <h1>客戶管理</h1>
        <p>管理您的客戶��料，追蹤客戶資訊與服務紀錄</p>
      </div>
      <div class="header-buttons">
        <button @click="toggleAppointmentForm" class="add-appointment-btn">
          <span class="btn-icon">{{ showAppointmentForm ? '✕' : '📅' }}</span>
          {{ showAppointmentForm ? '取消' : '新增預約' }}
        </button>
        <button @click="toggleAddForm" class="add-customer-btn">
          <span class="btn-icon">{{ showAddForm ? '✕' : '+' }}</span>
          {{ showAddForm ? '取消' : '新增客戶' }}
        </button>
      </div>
    </div>

    <div class="management-content">
      <div v-if="showAddForm" class="form-section">
        <CustomerForm :customer="selectedCustomer" @submit="onFormSubmit" @cancel="toggleAddForm" />
      </div>

      <div v-if="showAppointmentForm" class="form-section">
        <AppointmentForm @submit="onAppointmentSubmit" @cancel="toggleAppointmentForm" />
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

.header-buttons {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.add-appointment-btn,
.add-customer-btn {
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

.add-appointment-btn {
  background: #10b981;
  color: white;
}

.add-appointment-btn:hover {
  background: #059669;
  transform: translateY(-2px);
}

.add-customer-btn {
  background: #8b5cf6;
  color: white;
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

  .header-buttons {
    flex-direction: column;
    gap: 0.8rem;
    align-items: stretch;
  }

  .add-appointment-btn,
  .add-customer-btn {
    justify-content: center;
  }
}
</style>
