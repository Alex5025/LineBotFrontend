<script setup lang="ts">
import { computed } from 'vue'
import { useServiceStore } from '../stores/service'

const serviceStore = useServiceStore()

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(amount)
}
</script>

<template>
  <div class="financial-reports">
    <div class="page-header">
      <h1>財務報表</h1>
      <p>查看您的營收統計與財務分析</p>
    </div>

    <div class="reports-grid">
      <div class="report-card">
        <h3>今日營收</h3>
        <div class="amount">{{ formatCurrency(serviceStore.dailyRevenue) }}</div>
      </div>

      <div class="report-card">
        <h3>本月營收</h3>
        <div class="amount">{{ formatCurrency(serviceStore.monthlyRevenue) }}</div>
      </div>

      <div class="report-card">
        <h3>活躍服務</h3>
        <div class="count">{{ serviceStore.activeServices.length }}</div>
      </div>
    </div>

    <div class="coming-soon">
      <h3>更多報表功能即將推出</h3>
      <p>詳細的財務分析、圖表和趨勢分析正在開發中...</p>
    </div>
  </div>
</template>

<style scoped>
.financial-reports {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.page-header {
  margin-bottom: 2rem;
  text-align: center;
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.page-header p {
  color: var(--color-text);
  opacity: 0.8;
}

.reports-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 1.5rem;
  margin-bottom: 3rem;
}

.report-card {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
}

.report-card h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-weight: 600;
}

.amount {
  font-size: 2rem;
  font-weight: 700;
  color: #10b981;
}

.count {
  font-size: 2rem;
  font-weight: 700;
  color: #8b5cf6;
}

.coming-soon {
  background: var(--color-background-soft);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 3rem;
  text-align: center;
}

.coming-soon h3 {
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.coming-soon p {
  color: var(--color-text);
  opacity: 0.8;
}
</style>
