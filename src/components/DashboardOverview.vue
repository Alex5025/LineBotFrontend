<script setup lang="ts">
interface Stats {
  totalCustomers: number
  totalRevenue: number
  dailyRevenue: number
  monthlyRevenue: number
  activeServices: number
}

defineProps<{
  stats: Stats
}>()

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(amount)
}
</script>

<template>
  <div class="dashboard-overview">
    <h2>業務概覽</h2>

    <div class="stats-grid">
      <div class="stat-card customers">
        <div class="stat-icon">👥</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.totalCustomers }}</div>
          <div class="stat-label">總客戶數</div>
        </div>
      </div>

      <div class="stat-card revenue">
        <div class="stat-icon">💰</div>
        <div class="stat-info">
          <div class="stat-value">{{ formatCurrency(stats.totalRevenue) }}</div>
          <div class="stat-label">總營收</div>
        </div>
      </div>

      <div class="stat-card daily">
        <div class="stat-icon">📅</div>
        <div class="stat-info">
          <div class="stat-value">{{ formatCurrency(stats.dailyRevenue) }}</div>
          <div class="stat-label">今日營收</div>
        </div>
      </div>

      <div class="stat-card monthly">
        <div class="stat-icon">📊</div>
        <div class="stat-info">
          <div class="stat-value">{{ formatCurrency(stats.monthlyRevenue) }}</div>
          <div class="stat-label">本月營收</div>
        </div>
      </div>

      <div class="stat-card services">
        <div class="stat-icon">⚙️</div>
        <div class="stat-info">
          <div class="stat-value">{{ stats.activeServices }}</div>
          <div class="stat-label">活躍服務</div>
        </div>
      </div>

      <div class="stat-card growth">
        <div class="stat-icon">📈</div>
        <div class="stat-info">
          <div class="stat-value">+12%</div>
          <div class="stat-label">月增長率</div>
        </div>
      </div>
    </div>

    <div class="quick-actions">
      <h3>快速操作</h3>
      <div class="action-buttons">
        <router-link to="/customers" class="action-btn">
          <span class="btn-icon">👤</span>
          新增客戶
        </router-link>
        <router-link to="/services" class="action-btn">
          <span class="btn-icon">✨</span>
          管理服務
        </router-link>
        <router-link to="/reports" class="action-btn">
          <span class="btn-icon">📋</span>
          查看報表
        </router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
.dashboard-overview {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
}

.dashboard-overview h2 {
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  font-size: 1.4rem;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  background: var(--color-background);
  border-radius: 10px;
  padding: 1.2rem;
  border: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  gap: 1rem;
  transition: all 0.3s ease;
  position: relative;
  overflow: hidden;
}

.stat-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 4px;
  height: 100%;
  background: #8b5cf6;
}

.stat-card.customers::before {
  background: #3b82f6;
}

.stat-card.revenue::before {
  background: #10b981;
}

.stat-card.daily::before {
  background: #f59e0b;
}

.stat-card.monthly::before {
  background: #8b5cf6;
}

.stat-card.services::before {
  background: #06b6d4;
}

.stat-card.growth::before {
  background: #ef4444;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
}

.stat-icon {
  font-size: 2rem;
  opacity: 0.8;
}

.stat-info {
  flex: 1;
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.2rem;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.7;
}

.quick-actions h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-size: 1.1rem;
  font-weight: 600;
}

.action-buttons {
  display: flex;
  gap: 1rem;
  flex-wrap: wrap;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.8rem 1.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  transition: all 0.2s ease;
}

.action-btn:hover {
  background: #8b5cf6;
  color: white;
  border-color: #8b5cf6;
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 1.1rem;
}

@media (max-width: 768px) {
  .stats-grid {
    grid-template-columns: 1fr 1fr;
    gap: 0.8rem;
  }

  .stat-card {
    padding: 1rem;
    flex-direction: column;
    text-align: center;
    gap: 0.5rem;
  }

  .stat-value {
    font-size: 1.4rem;
  }

  .action-buttons {
    flex-direction: column;
  }

  .action-btn {
    justify-content: center;
  }
}
</style>
