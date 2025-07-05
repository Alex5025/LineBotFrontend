<script setup lang="ts">
import DashboardStats from '../components/DashboardStats.vue'
import MessageCenter from '../components/MessageCenter.vue'
import UserActivity from '../components/UserActivity.vue'
import BotSettings from '../components/BotSettings.vue'
</script>

<template>
  <main class="dashboard">
    <div class="dashboard-header">
      <h1>Line Bot 管理中心</h1>
      <p>管理您的 Line Bot 設定與用戶互動</p>
    </div>

    <div class="dashboard-grid">
      <DashboardStats />
      <MessageCenter />
      <UserActivity />
      <BotSettings />
    </div>
  </main>
</template>

<style scoped>
.dashboard {
  padding: 2rem;
  max-width: 1400px;
  margin: 0 auto;
}

.dashboard-header {
  text-align: center;
  margin-bottom: 3rem;
}

.dashboard-header h1 {
  font-size: 2.5rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.dashboard-header p {
  font-size: 1.1rem;
  color: var(--color-text);
  opacity: 0.8;
}

.dashboard-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 2rem;
}

@media (min-width: 768px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr;
  }
}

@media (min-width: 1024px) {
  .dashboard-grid {
    grid-template-columns: 1fr 1fr 1fr;
  }
}

@media (min-width: 1200px) {
  .dashboard-grid {
    grid-template-columns: 2fr 1fr 1fr;
    grid-template-areas:
      'stats stats activity'
      'messages settings activity';
  }

  .dashboard-grid > :nth-child(1) {
    grid-area: stats;
  }
  .dashboard-grid > :nth-child(2) {
    grid-area: messages;
  }
  .dashboard-grid > :nth-child(3) {
    grid-area: activity;
  }
  .dashboard-grid > :nth-child(4) {
    grid-area: settings;
  }
}
</style>
