<script setup lang="ts">
import { computed } from 'vue'
import { useCustomerStore } from '../stores/customer'
import { useServiceStore } from '../stores/service'
import DashboardOverview from '../components/DashboardOverview.vue'
import RecentActivity from '../components/RecentActivity.vue'

const customerStore = useCustomerStore()
const serviceStore = useServiceStore()

const stats = computed(() => ({
  totalCustomers: customerStore.totalCustomers,
  totalRevenue: customerStore.totalRevenue,
  dailyRevenue: serviceStore.dailyRevenue,
  monthlyRevenue: serviceStore.monthlyRevenue,
  activeServices: serviceStore.activeServices.length,
}))
</script>

<template>
  <div class="home-container">
    <div class="welcome-section">
      <div class="welcome-banner">
        <div class="banner-icon">🏪</div>
        <h1 class="banner-title">歡迎使用自理業者管理系統</h1>
        <p class="banner-description">
          專為美容美體、美髮、健身教練等自理業者設計的全方位客戶管理系統。
          輕鬆管理客戶資料、服務項目，並追蹤您的業務表現。
        </p>
        <div class="business-types">
          <div class="business-type">
            <span class="type-icon">💆‍♀️</span>
            <span class="type-name">美容美體</span>
          </div>
          <div class="business-type">
            <span class="type-icon">💇‍♀️</span>
            <span class="type-name">美髮造型</span>
          </div>
          <div class="business-type">
            <span class="type-icon">💪</span>
            <span class="type-name">健身指導</span>
          </div>
        </div>
      </div>
    </div>

    <div class="dashboard-section">
      <DashboardOverview :stats="stats" />
      <RecentActivity />
    </div>
  </div>
</template>

<style scoped>
.home-container {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.welcome-section {
  margin-bottom: 3rem;
}

.welcome-banner {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(6, 182, 212, 0.1));
  border-radius: 16px;
  border: 1px solid var(--color-border);
}

.banner-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
  display: inline-block;
  animation: bounce 2s infinite;
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

.banner-title {
  font-weight: 700;
  font-size: 2.5rem;
  color: var(--color-heading);
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.banner-description {
  font-size: 1.1rem;
  color: var(--color-text);
  opacity: 0.8;
  line-height: 1.6;
  max-width: 700px;
  margin: 0 auto 2rem;
}

.business-types {
  display: flex;
  justify-content: center;
  gap: 2rem;
  flex-wrap: wrap;
}

.business-type {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
  padding: 1rem;
  background: var(--color-background-soft);
  border-radius: 12px;
  border: 1px solid var(--color-border);
  transition: transform 0.2s ease;
}

.business-type:hover {
  transform: translateY(-5px);
}

.type-icon {
  font-size: 2rem;
}

.type-name {
  font-weight: 600;
  color: var(--color-heading);
  font-size: 0.9rem;
}

.dashboard-section {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 2rem;
}

@media (max-width: 1024px) {
  .dashboard-section {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 768px) {
  .home-container {
    padding: 1rem;
  }

  .welcome-banner {
    padding: 2rem 1rem;
  }

  .banner-title {
    font-size: 2rem;
  }

  .business-types {
    gap: 1rem;
  }

  .business-type {
    padding: 0.8rem;
  }
}
</style>
