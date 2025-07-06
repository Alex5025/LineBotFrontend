<script setup lang="ts">
import { computed } from 'vue'
import { useCustomerStore, type Customer } from '../stores/customer'
import { useCustomerActivityStore } from '../stores/customerActivity'

const emit = defineEmits<{
  edit: [customer: Customer]
}>()

const customerStore = useCustomerStore()
const activityStore = useCustomerActivityStore()

const businessTypeLabels = {
  beauty: '美容美體',
  hair: '美髮造型',
  fitness: '健身指導',
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(amount)
}

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

const getCustomerAppointments = (customerId: string) => {
  return activityStore.getRecentAppointments(customerId, 2).value
}

const getUpcomingAppointments = (customerId: string) => {
  return activityStore.getUpcomingAppointments(customerId, 1).value
}

const editCustomer = (customer: Customer) => {
  emit('edit', customer)
}

const deleteCustomer = (id: string) => {
  if (confirm('確定要刪除此客戶嗎？此操作無法復原。')) {
    customerStore.deleteCustomer(id)
  }
}

const goToPage = (page: number) => {
  customerStore.currentPage = page
}

const nextPage = () => {
  if (customerStore.currentPage < customerStore.totalPages) {
    customerStore.currentPage++
  }
}

const prevPage = () => {
  if (customerStore.currentPage > 1) {
    customerStore.currentPage--
  }
}

const pageNumbers = computed(() => {
  const pages = []
  const total = customerStore.totalPages
  const current = customerStore.currentPage

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages
})
</script>

<template>
  <div class="customer-list">
    <div class="list-header">
      <h2>客戶列表</h2>

      <!-- 搜尋和篩選 -->
      <div class="filters">
        <div class="search-box">
          <input
            v-model="customerStore.searchQuery"
            type="text"
            placeholder="搜尋客戶姓名、電話或Email..."
            class="search-input"
          />
          <span class="search-icon">🔍</span>
        </div>

        <select v-model="customerStore.filterBusinessType" class="filter-select">
          <option value="">所有業務類型</option>
          <option value="beauty">美容美體</option>
          <option value="hair">美髮造型</option>
          <option value="fitness">健身指導</option>
        </select>
      </div>
    </div>

    <div class="list-stats">
      <span class="stats-text">
        共 {{ customerStore.filteredCustomers.length }} 位客戶
        <template v-if="customerStore.searchQuery || customerStore.filterBusinessType">
          (從 {{ customerStore.totalCustomers }} 位中篩選)
        </template>
      </span>
    </div>

    <!-- 桌面版表格 -->
    <div class="table-container desktop-only">
      <table class="customer-table">
        <thead>
          <tr>
            <th>姓名</th>
            <th>聯絡方式</th>
            <th>年齡/身高/體重</th>
            <th>業務類型</th>
            <th>預約服務</th>
            <th>總消費</th>
            <th>最後拜訪</th>
            <th>操作</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="customer in customerStore.paginatedCustomers" :key="customer.id">
            <td>
              <div class="customer-name">
                <strong>{{ customer.name }}</strong>
                <span class="customer-occupation">{{ customer.occupation }}</span>
              </div>
            </td>
            <td>
              <div class="contact-info">
                <div>{{ customer.phone }}</div>
                <div class="email">{{ customer.email }}</div>
              </div>
            </td>
            <td>
              <div class="physical-info">
                {{ customer.age }}歲 / {{ customer.height }}cm / {{ customer.weight }}kg
              </div>
            </td>
            <td>
              <span class="business-badge" :class="customer.businessType">
                {{ businessTypeLabels[customer.businessType] }}
              </span>
            </td>
            <td>
              <div class="appointments-info">
                <div
                  v-if="getUpcomingAppointments(customer.id).length > 0"
                  class="upcoming-appointment"
                >
                  <span class="appointment-status upcoming">即將到來</span>
                  <div class="appointment-details">
                    <div class="appointment-title">
                      {{ getUpcomingAppointments(customer.id)[0].title }}
                    </div>
                    <div class="appointment-date">
                      {{ formatDateTime(getUpcomingAppointments(customer.id)[0].date) }}
                    </div>
                  </div>
                </div>
                <div
                  v-else-if="getCustomerAppointments(customer.id).length > 0"
                  class="recent-appointment"
                >
                  <span class="appointment-status recent">最近服務</span>
                  <div class="appointment-details">
                    <div class="appointment-title">
                      {{ getCustomerAppointments(customer.id)[0].title }}
                    </div>
                    <div class="appointment-date">
                      {{ formatDateTime(getCustomerAppointments(customer.id)[0].date) }}
                    </div>
                  </div>
                </div>
                <div v-else class="no-appointments">
                  <span class="appointment-status none">暫無預約</span>
                </div>
              </div>
            </td>
            <td>
              <strong class="amount">{{ formatCurrency(customer.totalSpent) }}</strong>
            </td>
            <td>
              <span v-if="customer.lastVisit" class="last-visit">
                {{ formatDate(customer.lastVisit) }}
              </span>
              <span v-else class="no-visit">尚未拜訪</span>
            </td>
            <td>
              <div class="actions">
                <button @click="editCustomer(customer)" class="edit-btn">編輯</button>
                <button @click="deleteCustomer(customer.id)" class="delete-btn">刪除</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <!-- 手機版卡片 -->
    <div class="cards-container mobile-only">
      <div
        v-for="customer in customerStore.paginatedCustomers"
        :key="customer.id"
        class="customer-card"
      >
        <div class="card-header">
          <div class="customer-name">
            <strong>{{ customer.name }}</strong>
            <span class="business-badge" :class="customer.businessType">
              {{ businessTypeLabels[customer.businessType] }}
            </span>
          </div>
          <div class="actions">
            <button @click="editCustomer(customer)" class="edit-btn">編輯</button>
            <button @click="deleteCustomer(customer.id)" class="delete-btn">刪除</button>
          </div>
        </div>

        <div class="card-body">
          <div class="info-row">
            <span class="label">聯絡方式：</span>
            <div>
              <div>{{ customer.phone }}</div>
              <div class="email">{{ customer.email }}</div>
            </div>
          </div>

          <div class="info-row">
            <span class="label">基本資料：</span>
            <span>{{ customer.age }}歲 / {{ customer.height }}cm / {{ customer.weight }}kg</span>
          </div>

          <div class="info-row">
            <span class="label">職業：</span>
            <span>{{ customer.occupation }}</span>
          </div>

          <div class="info-row">
            <span class="label">預約服務：</span>
            <div class="appointments-mobile">
              <div
                v-if="getUpcomingAppointments(customer.id).length > 0"
                class="appointment-mobile upcoming"
              >
                <span class="status-badge upcoming">即將到來</span>
                <div class="appointment-info">
                  <div class="appointment-title">
                    {{ getUpcomingAppointments(customer.id)[0].title }}
                  </div>
                  <div class="appointment-date">
                    {{ formatDateTime(getUpcomingAppointments(customer.id)[0].date) }}
                  </div>
                </div>
              </div>
              <div
                v-else-if="getCustomerAppointments(customer.id).length > 0"
                class="appointment-mobile recent"
              >
                <span class="status-badge recent">最近服務</span>
                <div class="appointment-info">
                  <div class="appointment-title">
                    {{ getCustomerAppointments(customer.id)[0].title }}
                  </div>
                  <div class="appointment-date">
                    {{ formatDateTime(getCustomerAppointments(customer.id)[0].date) }}
                  </div>
                </div>
              </div>
              <div v-else class="appointment-mobile none">
                <span class="status-badge none">暫無預約</span>
              </div>
            </div>
          </div>

          <div class="info-row">
            <span class="label">總消費：</span>
            <strong class="amount">{{ formatCurrency(customer.totalSpent) }}</strong>
          </div>

          <div class="info-row">
            <span class="label">最後拜訪：</span>
            <span v-if="customer.lastVisit">{{ formatDate(customer.lastVisit) }}</span>
            <span v-else class="no-visit">尚未拜訪</span>
          </div>
        </div>
      </div>
    </div>

    <!-- 分頁 -->
    <div v-if="customerStore.totalPages > 1" class="pagination">
      <button @click="prevPage" :disabled="customerStore.currentPage === 1" class="page-btn">
        ‹ 上一頁
      </button>

      <div class="page-numbers">
        <template v-for="page in pageNumbers" :key="page">
          <button
            v-if="typeof page === 'number'"
            @click="goToPage(page)"
            :class="['page-number', { active: page === customerStore.currentPage }]"
          >
            {{ page }}
          </button>
          <span v-else class="page-ellipsis">{{ page }}</span>
        </template>
      </div>

      <button
        @click="nextPage"
        :disabled="customerStore.currentPage === customerStore.totalPages"
        class="page-btn"
      >
        下一頁 ›
      </button>
    </div>

    <!-- 空狀態 -->
    <div v-if="customerStore.filteredCustomers.length === 0" class="empty-state">
      <div class="empty-icon">👥</div>
      <h3>沒有找到客戶</h3>
      <p v-if="customerStore.searchQuery || customerStore.filterBusinessType">
        嘗試調整搜尋條件或篩選器
      </p>
      <p v-else>開始新增您的第一位客戶吧！</p>
    </div>
  </div>
</template>

<style scoped>
.customer-list {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
}

.list-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.5rem;
  gap: 1rem;
}

.list-header h2 {
  color: var(--color-heading);
  font-size: 1.4rem;
  font-weight: 600;
  margin: 0;
}

.filters {
  display: flex;
  gap: 1rem;
  align-items: center;
}

.search-box {
  position: relative;
}

.search-input {
  padding: 0.6rem 2.5rem 0.6rem 0.8rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
  width: 250px;
}

.search-input:focus {
  outline: none;
  border-color: #8b5cf6;
}

.search-icon {
  position: absolute;
  right: 0.8rem;
  top: 50%;
  transform: translateY(-50%);
  opacity: 0.5;
}

.filter-select {
  padding: 0.6rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
}

.list-stats {
  margin-bottom: 1rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.stats-text {
  color: var(--color-text);
  opacity: 0.8;
  font-size: 0.9rem;
}

.table-container {
  overflow-x: auto;
  margin-bottom: 1rem;
}

.customer-table {
  width: 100%;
  border-collapse: collapse;
}

.customer-table th,
.customer-table td {
  padding: 1rem 0.8rem;
  text-align: left;
  border-bottom: 1px solid var(--color-border);
}

.customer-table th {
  background: var(--color-background-mute);
  font-weight: 600;
  color: var(--color-heading);
  font-size: 0.9rem;
}

.customer-name strong {
  color: var(--color-heading);
  display: block;
  margin-bottom: 0.2rem;
}

.customer-occupation {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.7;
}

.contact-info {
  font-size: 0.9rem;
}

.email {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.7;
}

.physical-info {
  font-size: 0.9rem;
  color: var(--color-text);
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

.amount {
  color: #10b981;
  font-weight: 600;
}

.last-visit {
  font-size: 0.9rem;
  color: var(--color-text);
}

.no-visit {
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.5;
  font-style: italic;
}

.actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.4rem 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn {
  background: #8b5cf6;
  color: white;
}

.edit-btn:hover {
  background: #7c3aed;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
}

.cards-container {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1rem;
}

.customer-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
  gap: 1rem;
}

.card-body {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 1rem;
}

.label {
  font-weight: 500;
  color: var(--color-text);
  opacity: 0.8;
  font-size: 0.9rem;
  min-width: 80px;
}

.pagination {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.5rem;
  margin-top: 1.5rem;
}

.page-btn {
  padding: 0.5rem 1rem;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-btn:hover:not(:disabled) {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-numbers {
  display: flex;
  gap: 0.2rem;
}

.page-number {
  padding: 0.5rem 0.8rem;
  border: 1px solid var(--color-border);
  background: var(--color-background);
  color: var(--color-text);
  border-radius: 4px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.page-number:hover {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

.page-number.active {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

.page-ellipsis {
  padding: 0.5rem 0.3rem;
  color: var(--color-text);
  opacity: 0.5;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h3 {
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--color-text);
  opacity: 0.7;
}

/* 預約服務樣式 */
.appointments-info {
  font-size: 0.85rem;
  min-width: 150px;
}

.upcoming-appointment,
.recent-appointment,
.no-appointments {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.appointment-status {
  padding: 0.2rem 0.6rem;
  border-radius: 10px;
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
  width: fit-content;
}

.appointment-status.upcoming {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.appointment-status.recent {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.appointment-status.none {
  background: rgba(156, 163, 175, 0.1);
  color: #9ca3af;
}

.appointment-details {
  margin-top: 0.2rem;
}

.appointment-title {
  font-weight: 500;
  color: var(--color-heading);
  font-size: 0.8rem;
  margin-bottom: 0.1rem;
}

.appointment-date {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.75rem;
}

/* 手機版預約資訊樣式 */
.appointments-mobile {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.appointment-mobile {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
}

.status-badge {
  padding: 0.2rem 0.5rem;
  border-radius: 8px;
  font-size: 0.7rem;
  font-weight: 500;
  flex-shrink: 0;
}

.status-badge.upcoming {
  background: rgba(34, 197, 94, 0.1);
  color: #22c55e;
}

.status-badge.recent {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-badge.none {
  background: rgba(156, 163, 175, 0.1);
  color: #9ca3af;
}

.appointment-info {
  flex: 1;
}

.appointment-mobile .appointment-title {
  font-size: 0.85rem;
  margin-bottom: 0.1rem;
}

.appointment-mobile .appointment-date {
  font-size: 0.75rem;
}

.desktop-only {
  display: block;
}

.mobile-only {
  display: none;
}

@media (max-width: 1024px) {
  .desktop-only {
    display: none;
  }

  .mobile-only {
    display: block;
  }
}

@media (max-width: 768px) {
  .list-header {
    flex-direction: column;
    align-items: stretch;
  }

  .filters {
    flex-direction: column;
    gap: 0.8rem;
  }

  .search-input {
    width: 100%;
  }

  .card-header {
    flex-direction: column;
    gap: 0.8rem;
  }

  .info-row {
    flex-direction: column;
    gap: 0.3rem;
  }

  .label {
    min-width: auto;
  }

  .pagination {
    flex-wrap: wrap;
    gap: 0.3rem;
  }

  .page-numbers {
    order: -1;
    width: 100%;
    justify-content: center;
  }
}
</style>
