<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useServiceDataStore } from '../stores/serviceData'
import { useCustomerActivityStore } from '../stores/customerActivity'
import CustomerAppointmentForm from '../components/CustomerAppointmentForm.vue'

const authStore = useAuthStore()
const serviceDataStore = useServiceDataStore()
const activityStore = useCustomerActivityStore()

// 獲取當前用戶資料
const currentUser = computed(() => serviceDataStore.currentUserProfile)
const showAppointmentForm = ref(false)

const currentDate = ref(new Date())
const selectedYear = ref(currentDate.value.getFullYear())
const selectedMonth = ref(currentDate.value.getMonth() + 1)

// 從auth store獲取當前用戶ID並映射到activity store的用戶ID
const currentCustomerId = computed(() => {
  // 使用 UUID 來判斷用戶
  if (authStore.currentUser?.uuid === 'uuid-wang-damei-002') return '2'
  return '1' // 默認為王小美 (uuid-wang-xiaomei-001)
})

// 使用customerActivity store獲取資料
const monthlyStats = computed(() => {
  return activityStore.getMonthlyStats(
    currentCustomerId.value,
    selectedYear.value,
    selectedMonth.value,
  ).value
})

const recentActivities = computed(() => {
  return activityStore.getRecentActivities(currentCustomerId.value, 3).value
})

const upcomingAppointments = computed(() => {
  return activityStore.getUpcomingAppointments(currentCustomerId.value, 3).value
})

// 獲取最近預約記錄
const recentAppointments = computed(() => {
  return activityStore.getRecentAppointments(currentCustomerId.value, 5).value
})

// 格式化日期
const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat('zh-TW', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(date)
}

// 格式化詳細日期時間
const formatDateTime = (date: Date) => {
  return new Intl.DateTimeFormat('zh-TW', {
    month: '2-digit',
    day: '2-digit',
    weekday: 'short',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

// 計算距離現在的天數
const getDaysFromNow = (date: Date) => {
  const now = new Date()
  const targetDate = new Date(date)
  const diffTime = targetDate.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return '今天'
  if (diffDays === 1) return '明天'
  if (diffDays === -1) return '昨天'
  if (diffDays > 0) return `${diffDays}天後`
  return `${Math.abs(diffDays)}天前`
}

// 格式化貨幣
const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(amount)
}

// 月份選擇
const previousMonth = () => {
  if (selectedMonth.value === 1) {
    selectedMonth.value = 12
    selectedYear.value--
  } else {
    selectedMonth.value--
  }
}

const nextMonth = () => {
  if (selectedMonth.value === 12) {
    selectedMonth.value = 1
    selectedYear.value++
  } else {
    selectedMonth.value++
  }
}

const goToCurrentMonth = () => {
  selectedYear.value = currentDate.value.getFullYear()
  selectedMonth.value = currentDate.value.getMonth() + 1
}

// 月份名稱
const monthNames = [
  '1月',
  '2月',
  '3月',
  '4月',
  '5月',
  '6月',
  '7月',
  '8月',
  '9月',
  '10月',
  '11月',
  '12月',
]

// 獲取服務類型標籤（基於服務名稱）
const getServiceTypeLabel = (serviceName: string) => {
  if (serviceName.includes('護膚') || serviceName.includes('美甲')) return '美容服務'
  if (serviceName.includes('按摩') || serviceName.includes('SPA')) return 'SPA服務'
  if (serviceName.includes('護髮') || serviceName.includes('染髮')) return '美髮服務'
  if (serviceName.includes('訓練') || serviceName.includes('瑜伽')) return '健身服務'
  return '其他服務'
}

// 獲取服務類型圖標
const getServiceTypeIcon = (serviceName: string) => {
  if (serviceName.includes('護膚') || serviceName.includes('美甲')) return '✨'
  if (serviceName.includes('按摩') || serviceName.includes('SPA')) return '💆'
  if (serviceName.includes('護髮') || serviceName.includes('染髮')) return '💇'
  if (serviceName.includes('訓練') || serviceName.includes('瑜伽')) return '💪'
  return '🔧'
}

// 獲取狀態標籤
const getStatusLabel = (status: string) => {
  const labels = {
    completed: '已完成',
    scheduled: '已預約',
    cancelled: '已取消',
  }
  return labels[status as keyof typeof labels] || status
}

// 獲取活動類型標籤
const getActivityTypeLabel = (type: string) => {
  const labels = {
    service: '服務完成',
    appointment: '預約服務',
    payment: '付款記錄',
    consultation: '諮詢',
  }
  return labels[type as keyof typeof labels] || type
}

// 預約相關方法
const toggleAppointmentForm = () => {
  showAppointmentForm.value = !showAppointmentForm.value
}

const onAppointmentSubmit = () => {
  showAppointmentForm.value = false
  // 重新載入當前月份資料
  // 這會觸發computed properties重新計算
}
</script>

<template>
  <div class="customer-dashboard">
    <div class="welcome-section">
      <div class="welcome-header">
        <h1>歡迎回來，{{ currentUser?.name || authStore.currentUser?.name || '顧客' }}！</h1>
        <p>查看您的服務記錄和活動歷史</p>
        <div class="welcome-actions">
          <button @click="toggleAppointmentForm" class="appointment-btn">
            <span class="btn-icon">📅</span>
            {{ showAppointmentForm ? '��消預約' : '立即預約' }}
          </button>
        </div>
      </div>
    </div>

    <!-- 預約表單 -->
    <div v-if="showAppointmentForm" class="appointment-form-section">
      <CustomerAppointmentForm @submit="onAppointmentSubmit" @cancel="toggleAppointmentForm" />
    </div>

    <!-- 月份選擇器 -->
    <div class="month-selector">
      <div class="month-controls">
        <button @click="previousMonth" class="month-btn">‹</button>
        <div class="current-month">
          <h2>{{ selectedYear }}年 {{ monthNames[selectedMonth - 1] }}</h2>
        </div>
        <button @click="nextMonth" class="month-btn">›</button>
      </div>
      <button @click="goToCurrentMonth" class="current-month-btn">回到本月</button>
    </div>

    <!-- 月度統計 -->
    <div class="monthly-stats">
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <div class="stat-value">{{ formatCurrency(monthlyStats.totalSpent) }}</div>
          <div class="stat-label">本月消費</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">✨</div>
        <div class="stat-info">
          <div class="stat-value">{{ monthlyStats.serviceCount }}</div>
          <div class="stat-label">完成服務</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📅</div>
        <div class="stat-info">
          <div class="stat-value">{{ monthlyStats.appointmentCount }}</div>
          <div class="stat-label">預約次數</div>
        </div>
      </div>

      <div class="stat-card">
        <div class="stat-icon">📋</div>
        <div class="stat-info">
          <div class="stat-value">{{ monthlyStats.totalActivities }}</div>
          <div class="stat-label">總活動數</div>
        </div>
      </div>
    </div>

    <!-- 即���到來的預約 -->
    <div class="upcoming-appointments">
      <div class="section-header">
        <h3>即將到來的預約服務</h3>
        <span v-if="upcomingAppointments.length > 0" class="appointment-count">
          {{ upcomingAppointments.length }} 個預約
        </span>
      </div>

      <div v-if="upcomingAppointments.length === 0" class="empty-appointments">
        <div class="empty-icon">📅</div>
        <h4>目前沒有預約</h4>
        <p>您目前沒有即將到來的服務預約</p>
      </div>

      <div v-else class="appointments-list">
        <div
          v-for="appointment in upcomingAppointments"
          :key="appointment.id"
          class="appointment-card"
        >
          <div class="appointment-date-badge">
            <div class="date-number">
              {{ formatDate(new Date(appointment.date)).split('/')[2] }}
            </div>
            <div class="date-month">
              {{ formatDate(new Date(appointment.date)).split('/')[1] }}月
            </div>
            <div class="date-relative">{{ getDaysFromNow(new Date(appointment.date)) }}</div>
          </div>

          <div class="appointment-details">
            <h4 class="appointment-title">{{ appointment.title }}</h4>
            <p class="appointment-description">{{ appointment.description }}</p>
            <div class="appointment-meta">
              <span class="appointment-type">
                🎯 {{ getActivityTypeLabel(appointment.type) }}
              </span>
              <span v-if="appointment.amount" class="appointment-price">
                💰 {{ formatCurrency(appointment.amount) }}
              </span>
            </div>
            <div v-if="appointment.notes" class="appointment-notes">📝 {{ appointment.notes }}</div>
          </div>

          <div class="appointment-actions">
            <button class="action-btn reschedule">重新安排</button>
            <button class="action-btn cancel">取消預約</button>
          </div>
        </div>
      </div>
    </div>

    <!-- 最近預約記錄 -->
    <div class="recent-appointments">
      <h3>最近預約記錄</h3>
      <div class="recent-list">
        <div
          v-for="appointment in recentAppointments"
          :key="appointment.id"
          class="recent-appointment-item"
        >
          <div class="appointment-status-icon" :class="appointment.status">
            {{
              appointment.status === 'completed'
                ? '✅'
                : appointment.status === 'scheduled'
                  ? '📅'
                  : '❌'
            }}
          </div>
          <div class="recent-content">
            <div class="recent-title">{{ appointment.title }}</div>
            <div class="recent-date">
              {{ formatDate(new Date(appointment.date)) }} -
              {{ getStatusLabel(appointment.status) }}
            </div>
          </div>
          <div v-if="appointment.amount" class="recent-amount">
            {{ formatCurrency(appointment.amount) }}
          </div>
        </div>
      </div>
    </div>

    <!-- 最近活動快覽 -->
    <div class="recent-activities">
      <h3>最近活動</h3>
      <div class="recent-list">
        <div v-for="activity in recentActivities" :key="activity.id" class="recent-item">
          <div class="recent-icon">{{ getServiceTypeIcon(activity.title) }}</div>
          <div class="recent-content">
            <div class="recent-title">{{ activity.title }}</div>
            <div class="recent-date">{{ formatDate(new Date(activity.date)) }}</div>
          </div>
          <div v-if="activity.amount" class="recent-amount">
            {{ formatCurrency(activity.amount) }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.customer-dashboard {
  padding: 2rem;
  max-width: 1200px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 2rem;
}

.welcome-header {
  text-align: center;
  padding: 2rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.1), rgba(6, 182, 212, 0.1));
  border-radius: 16px;
  border: 1px solid var(--color-border);
}

.welcome-header h1 {
  color: var(--color-heading);
  font-size: 2rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.welcome-header p {
  color: var(--color-text);
  opacity: 0.8;
  font-size: 1.1rem;
  margin-bottom: 1.5rem;
}

.welcome-actions {
  display: flex;
  justify-content: center;
}

.appointment-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem 2rem;
  background: linear-gradient(135deg, #10b981, #06b6d4);
  color: white;
  border: none;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.3);
}

.appointment-btn:hover {
  background: linear-gradient(135deg, #059669, #0891b2);
  transform: translateY(-3px);
  box-shadow: 0 6px 16px rgba(16, 185, 129, 0.4);
}

.btn-icon {
  font-size: 1.2rem;
}

.appointment-form-section {
  margin-bottom: 2rem;
}

.month-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 1rem 1.5rem;
  border: 1px solid var(--color-border);
}

.month-controls {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.month-btn {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 6px;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: var(--color-text);
  font-size: 1.2rem;
  transition: all 0.2s ease;
}

.month-btn:hover {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
}

.current-month h2 {
  color: var(--color-heading);
  font-weight: 600;
  margin: 0;
}

.current-month-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-weight: 500;
  transition: all 0.2s ease;
}

.current-month-btn:hover {
  background: #059669;
}

.monthly-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: transform 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.2rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.7;
}

.recent-activities {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
}

.recent-activities h3 {
  color: var(--color-heading);
  font-weight: 600;
  margin-bottom: 1rem;
}

.recent-list {
  display: flex;
  flex-direction: column;
  gap: 0.8rem;
}

.recent-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  background: var(--color-background);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.recent-item:hover {
  border-color: var(--color-border-hover);
}

.recent-icon {
  font-size: 1.2rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(16, 185, 129, 0.1);
  border-radius: 50%;
  flex-shrink: 0;
}

.recent-content {
  flex: 1;
}

.recent-title {
  color: var(--color-heading);
  font-weight: 500;
  margin-bottom: 0.2rem;
}

.recent-date {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.8rem;
}

.recent-amount {
  color: #10b981;
  font-weight: 600;
}

.upcoming-appointments {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.upcoming-appointments .section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.upcoming-appointments h3 {
  color: var(--color-heading);
  font-weight: 600;
  margin: 0;
}

.appointment-count {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.empty-appointments {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-appointments .empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-appointments h4 {
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.empty-appointments p {
  color: var(--color-text);
  opacity: 0.7;
}

.appointments-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.appointment-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1.5rem;
  transition: all 0.2s ease;
}

.appointment-card:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.appointment-date-badge {
  background: linear-gradient(135deg, #3b82f6, #06b6d4);
  color: white;
  border-radius: 12px;
  padding: 1rem;
  text-align: center;
  min-width: 80px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  flex-shrink: 0;
}

.date-number {
  font-size: 1.8rem;
  font-weight: 700;
  line-height: 1;
}

.date-month {
  font-size: 0.8rem;
  opacity: 0.9;
  margin-bottom: 0.2rem;
}

.date-relative {
  font-size: 0.7rem;
  opacity: 0.8;
  background: rgba(255, 255, 255, 0.2);
  padding: 0.2rem 0.4rem;
  border-radius: 8px;
  margin-top: 0.3rem;
}

.appointment-details {
  flex: 1;
}

.appointment-title {
  color: var(--color-heading);
  font-weight: 600;
  margin-bottom: 0.5rem;
  font-size: 1.1rem;
}

.appointment-description {
  color: var(--color-text);
  margin-bottom: 0.8rem;
  line-height: 1.4;
}

.appointment-meta {
  display: flex;
  gap: 1rem;
  margin-bottom: 0.5rem;
  flex-wrap: wrap;
}

.appointment-time,
.appointment-price {
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.8;
}

.appointment-price {
  color: #10b981;
  font-weight: 600;
  opacity: 1;
}

.appointment-notes {
  background: rgba(59, 130, 246, 0.05);
  padding: 0.6rem;
  border-radius: 6px;
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.8;
  line-height: 1.4;
}

.appointment-actions {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  align-self: flex-start;
}

.action-btn {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 6px;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.action-btn.reschedule {
  background: #f59e0b;
  color: white;
}

.action-btn.reschedule:hover {
  background: #d97706;
}

.action-btn.cancel {
  background: transparent;
  color: #ef4444;
  border: 1px solid #ef4444;
}

.action-btn.cancel:hover {
  background: #ef4444;
  color: white;
}

.recent-appointments {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.recent-appointments h3 {
  color: var(--color-heading);
  font-weight: 600;
  margin-bottom: 1rem;
}

.recent-appointment-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 0.8rem;
  background: var(--color-background);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
  margin-bottom: 0.5rem;
}

.recent-appointment-item:hover {
  border-color: var(--color-border-hover);
}

.appointment-status-icon {
  font-size: 1.2rem;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  flex-shrink: 0;
}

.appointment-status-icon.completed {
  background: rgba(16, 185, 129, 0.1);
}

.appointment-status-icon.scheduled {
  background: rgba(59, 130, 246, 0.1);
}

.appointment-status-icon.cancelled {
  background: rgba(239, 68, 68, 0.1);
}

@media (max-width: 768px) {
  .customer-dashboard {
    padding: 1rem;
  }

  .welcome-header p {
    margin-bottom: 1rem;
  }

  .appointment-btn {
    width: 100%;
    max-width: 300px;
    justify-content: center;
  }

  .month-selector {
    flex-direction: column;
    gap: 1rem;
    align-items: stretch;
  }

  .current-month-btn {
    align-self: center;
  }

  .monthly-stats {
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
  }

  .appointment-card {
    flex-direction: column;
    gap: 1rem;
  }

  .appointment-date-badge {
    align-self: flex-start;
    min-width: 60px;
    padding: 0.8rem;
  }

  .appointment-meta {
    flex-direction: column;
    gap: 0.5rem;
  }

  .appointment-actions {
    flex-direction: row;
    align-self: stretch;
  }

  .action-btn {
    flex: 1;
  }
}
</style>
