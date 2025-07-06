<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useAuthStore } from '../stores/auth'
import { useCustomerActivityStore } from '../stores/customerActivity'

const authStore = useAuthStore()
const activityStore = useCustomerActivityStore()

const currentDate = ref(new Date())
const selectedYear = ref(currentDate.value.getFullYear())
const selectedMonth = ref(currentDate.value.getMonth() + 1)

const customerId = computed(() => authStore.currentUser?.id || 'customer_1')

// 獲取當月活動和統計
const monthlyActivities = computed(() =>
  activityStore.getActivitiesByMonth(customerId.value, selectedYear.value, selectedMonth.value),
)

const monthlyStats = computed(() =>
  activityStore.getMonthlyStats(customerId.value, selectedYear.value, selectedMonth.value),
)

const recentActivities = computed(() => activityStore.getRecentActivities(customerId.value, 3))

const upcomingAppointments = computed(() =>
  activityStore.getUpcomingAppointments(customerId.value, 3),
)

const recentAppointments = computed(() => activityStore.getRecentAppointments(customerId.value, 5))

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

// 獲取活��類型標籤
const getActivityTypeLabel = (type: string) => {
  const labels = {
    service: '服務',
    appointment: '預約',
    payment: '付款',
    consultation: '諮詢',
  }
  return labels[type as keyof typeof labels] || type
}

// 獲取活動類型圖標
const getActivityTypeIcon = (type: string) => {
  const icons = {
    service: '✨',
    appointment: '📅',
    payment: '💰',
    consultation: '💬',
  }
  return icons[type as keyof typeof icons] || '📋'
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
</script>

<template>
  <div class="customer-dashboard">
    <div class="welcome-section">
      <div class="welcome-header">
        <h1>歡迎回來，{{ authStore.currentUser?.name || '顧客' }}！</h1>
        <p>查看您的服務記錄和活動歷史</p>
      </div>
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

    <!-- 活動列表 -->
    <div class="activities-section">
      <div class="section-header">
        <h3>{{ selectedYear }}年{{ selectedMonth }}月活動記錄</h3>
        <span class="activity-count">共 {{ monthlyActivities.length }} 筆記錄</span>
      </div>

      <div v-if="monthlyActivities.length === 0" class="empty-state">
        <div class="empty-icon">📝</div>
        <h4>本月尚無活動記錄</h4>
        <p>選擇其他月份查看歷史記錄</p>
      </div>

      <div v-else class="activities-list">
        <div v-for="activity in monthlyActivities" :key="activity.id" class="activity-item">
          <div class="activity-icon">{{ getActivityTypeIcon(activity.type) }}</div>
          <div class="activity-content">
            <div class="activity-header">
              <h4>{{ activity.title }}</h4>
              <div class="activity-meta">
                <span class="activity-type">{{ getActivityTypeLabel(activity.type) }}</span>
                <span class="activity-date">{{ formatDate(activity.date) }}</span>
              </div>
            </div>
            <p class="activity-description">{{ activity.description }}</p>
            <div class="activity-footer">
              <div class="activity-status" :class="activity.status">
                {{ getStatusLabel(activity.status) }}
              </div>
              <div v-if="activity.amount" class="activity-amount">
                {{ formatCurrency(activity.amount) }}
              </div>
            </div>
            <div v-if="activity.notes" class="activity-notes">💭 {{ activity.notes }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- 即將到來的預約 -->
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
            <div class="date-number">{{ formatDate(appointment.date).split('/')[2] }}</div>
            <div class="date-month">{{ formatDate(appointment.date).split('/')[1] }}月</div>
            <div class="date-relative">{{ getDaysFromNow(appointment.date) }}</div>
          </div>

          <div class="appointment-details">
            <h4 class="appointment-title">{{ appointment.title }}</h4>
            <p class="appointment-description">{{ appointment.description }}</p>
            <div class="appointment-meta">
              <span class="appointment-time">⏰ {{ formatDateTime(appointment.date) }}</span>
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
              {{ formatDate(appointment.date) }} - {{ getStatusLabel(appointment.status) }}
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
          <div class="recent-icon">{{ getActivityTypeIcon(activity.type) }}</div>
          <div class="recent-content">
            <div class="recent-title">{{ activity.title }}</div>
            <div class="recent-date">{{ formatDate(activity.date) }}</div>
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

.activities-section {
  margin-bottom: 2rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h3 {
  color: var(--color-heading);
  font-weight: 600;
}

.activity-count {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.9rem;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  border: 1px solid var(--color-border);
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  opacity: 0.5;
}

.empty-state h4 {
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--color-text);
  opacity: 0.7;
}

.activities-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.activity-item {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  display: flex;
  gap: 1rem;
  transition: all 0.2s ease;
}

.activity-item:hover {
  border-color: var(--color-border-hover);
  transform: translateX(4px);
}

.activity-icon {
  font-size: 1.5rem;
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 50%;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
}

.activity-header h4 {
  color: var(--color-heading);
  font-weight: 600;
  margin: 0;
}

.activity-meta {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  gap: 0.2rem;
}

.activity-type {
  background: rgba(139, 92, 246, 0.1);
  color: #8b5cf6;
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.activity-date {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.8rem;
}

.activity-description {
  color: var(--color-text);
  margin-bottom: 1rem;
  line-height: 1.4;
}

.activity-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.activity-status {
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
}

.activity-status.completed {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.activity-status.scheduled {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.activity-status.cancelled {
  background: rgba(239, 68, 68, 0.1);
  color: #ef4444;
}

.activity-amount {
  color: #10b981;
  font-weight: 600;
  font-size: 1.1rem;
}

.activity-notes {
  margin-top: 1rem;
  padding: 0.8rem;
  background: rgba(139, 92, 246, 0.05);
  border-radius: 6px;
  color: var(--color-text);
  opacity: 0.8;
  font-size: 0.9rem;
  line-height: 1.4;
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

  .activity-item {
    flex-direction: column;
    gap: 1rem;
  }

  .activity-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: stretch;
  }

  .activity-meta {
    align-items: flex-start;
  }

  .section-header {
    flex-direction: column;
    gap: 0.5rem;
    align-items: flex-start;
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
