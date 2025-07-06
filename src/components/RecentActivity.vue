<script setup lang="ts">
import { ref } from 'vue'

const activities = ref([
  {
    id: 1,
    type: 'customer',
    message: '新客戶「王小美」已註冊',
    time: '10分鐘前',
    icon: '👤',
  },
  {
    id: 2,
    type: 'service',
    message: '完成服務「深層清潔護膚」',
    time: '1小時前',
    icon: '✨',
  },
  {
    id: 3,
    type: 'payment',
    message: '收到付款 NT$1,500',
    time: '2小時前',
    icon: '💰',
  },
  {
    id: 4,
    type: 'booking',
    message: '李健身預約了健身指導',
    time: '3小時前',
    icon: '📅',
  },
  {
    id: 5,
    type: 'customer',
    message: '客戶資料已更新',
    time: '5小時前',
    icon: '📝',
  },
])
</script>

<template>
  <div class="recent-activity">
    <h2>最近活動</h2>

    <div class="activity-list">
      <div v-for="activity in activities" :key="activity.id" class="activity-item">
        <div class="activity-icon">{{ activity.icon }}</div>
        <div class="activity-content">
          <div class="activity-message">{{ activity.message }}</div>
          <div class="activity-time">{{ activity.time }}</div>
        </div>
      </div>
    </div>

    <div class="view-all">
      <button class="view-all-btn">查看所有活動</button>
    </div>
  </div>
</template>

<style scoped>
.recent-activity {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  height: fit-content;
}

.recent-activity h2 {
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  font-size: 1.4rem;
  font-weight: 600;
}

.activity-list {
  max-height: 400px;
  overflow-y: auto;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem;
  margin-bottom: 0.5rem;
  background: var(--color-background);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.activity-item:hover {
  border-color: var(--color-border-hover);
  transform: translateX(4px);
}

.activity-item:last-child {
  margin-bottom: 0;
}

.activity-icon {
  font-size: 1.2rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139, 92, 246, 0.1);
  border-radius: 50%;
  flex-shrink: 0;
}

.activity-content {
  flex: 1;
  min-width: 0;
}

.activity-message {
  font-size: 0.9rem;
  color: var(--color-text);
  margin-bottom: 0.3rem;
  line-height: 1.4;
}

.activity-time {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.6;
}

.view-all {
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.view-all-btn {
  padding: 0.6rem 1.5rem;
  background: transparent;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  color: var(--color-text);
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.view-all-btn:hover {
  background: #8b5cf6;
  border-color: #8b5cf6;
  color: white;
}

@media (max-width: 768px) {
  .activity-item {
    padding: 0.8rem;
    gap: 0.8rem;
  }

  .activity-icon {
    width: 32px;
    height: 32px;
    font-size: 1rem;
  }

  .activity-message {
    font-size: 0.85rem;
  }
}
</style>
