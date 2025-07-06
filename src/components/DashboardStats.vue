<script setup lang="ts">
import { ref } from 'vue'

const stats = ref([
  { title: '今日訊息', value: '1,247', change: '+12%', trend: 'up' },
  { title: '活躍用戶', value: '3,456', change: '+8%', trend: 'up' },
  { title: '回應率', value: '94.2%', change: '+2.1%', trend: 'up' },
  { title: '平均回應時間', value: '1.2s', change: '-0.3s', trend: 'down' },
])
</script>

<template>
  <div class="stats-container">
    <h2>即時統計</h2>
    <div class="stats-grid">
      <div v-for="stat in stats" :key="stat.title" class="stat-card">
        <div class="stat-header">
          <h3>{{ stat.title }}</h3>
          <span :class="['trend', `trend-${stat.trend}`]">{{ stat.change }}</span>
        </div>
        <div class="stat-value">{{ stat.value }}</div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.stats-container {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
}

.stats-container h2 {
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  font-size: 1.3rem;
  font-weight: 600;
}

.stats-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.stat-card {
  background: var(--color-background);
  border-radius: 8px;
  padding: 1rem;
  border: 1px solid var(--color-border);
  transition:
    transform 0.2s ease,
    box-shadow 0.2s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.stat-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.stat-header h3 {
  font-size: 0.9rem;
  color: var(--color-text);
  font-weight: 500;
  opacity: 0.8;
}

.trend {
  font-size: 0.8rem;
  font-weight: 600;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.trend-up {
  color: #10b981;
  background: rgba(16, 185, 129, 0.1);
}

.trend-down {
  color: #ef4444;
  background: rgba(239, 68, 68, 0.1);
}

.stat-value {
  font-size: 1.8rem;
  font-weight: 700;
  color: var(--color-heading);
}

@media (max-width: 640px) {
  .stats-grid {
    grid-template-columns: 1fr;
  }
}
</style>
