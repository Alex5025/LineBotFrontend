<script setup lang="ts">
import { ref } from 'vue'

const activities = ref([
  { type: 'join', user: '新用戶加入', time: '剛剛', icon: '👋' },
  { type: 'message', user: '用戶002 發送訊息', time: '2分鐘前', icon: '💬' },
  { type: 'order', user: '用戶001 下訂單', time: '5分鐘前', icon: '🛒' },
  { type: 'join', user: '新用戶加入', time: '8分鐘前', icon: '👋' },
  { type: 'feedback', user: '用戶003 留下評價', time: '10分鐘前', icon: '⭐' },
  { type: 'message', user: '用戶004 發送訊息', time: '15分鐘前', icon: '💬' },
])

const onlineUsers = ref(127)
</script>

<template>
  <div class="user-activity">
    <div class="activity-header">
      <h2>用戶活動</h2>
      <div class="online-indicator">
        <span class="online-dot"></span>
        {{ onlineUsers }} 人在線
      </div>
    </div>

    <div class="activity-list">
      <div v-for="(activity, index) in activities" :key="index" class="activity-item">
        <div class="activity-icon">{{ activity.icon }}</div>
        <div class="activity-details">
          <div class="activity-text">{{ activity.user }}</div>
          <div class="activity-time">{{ activity.time }}</div>
        </div>
      </div>
    </div>

    <div class="activity-chart">
      <h3>本週活動趨勢</h3>
      <div class="chart-bars">
        <div class="bar" style="--height: 60%"><span>週一</span></div>
        <div class="bar" style="--height: 80%"><span>週二</span></div>
        <div class="bar" style="--height: 45%"><span>週三</span></div>
        <div class="bar" style="--height: 90%"><span>週四</span></div>
        <div class="bar" style="--height: 75%"><span>週五</span></div>
        <div class="bar" style="--height: 30%"><span>週六</span></div>
        <div class="bar" style="--height: 25%"><span>週日</span></div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.user-activity {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  height: fit-content;
}

.activity-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.activity-header h2 {
  color: var(--color-heading);
  font-size: 1.3rem;
  font-weight: 600;
}

.online-indicator {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.9rem;
  color: var(--color-text);
  opacity: 0.8;
}

.online-dot {
  width: 8px;
  height: 8px;
  background: #10b981;
  border-radius: 50%;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

.activity-list {
  max-height: 250px;
  overflow-y: auto;
  margin-bottom: 1.5rem;
}

.activity-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem;
  margin-bottom: 0.5rem;
  background: var(--color-background);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.activity-item:hover {
  border-color: var(--color-border-hover);
  transform: translateX(2px);
}

.activity-icon {
  font-size: 1.2rem;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.activity-details {
  flex: 1;
}

.activity-text {
  font-size: 0.9rem;
  color: var(--color-text);
  margin-bottom: 0.2rem;
}

.activity-time {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.6;
}

.activity-chart {
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.activity-chart h3 {
  font-size: 1rem;
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-weight: 600;
}

.chart-bars {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  height: 80px;
  gap: 0.5rem;
}

.bar {
  flex: 1;
  background: linear-gradient(to top, #3b82f6, #60a5fa);
  border-radius: 4px 4px 0 0;
  height: var(--height);
  position: relative;
  transition: all 0.3s ease;
  cursor: pointer;
}

.bar:hover {
  opacity: 0.8;
  transform: scaleY(1.1);
}

.bar span {
  position: absolute;
  bottom: -20px;
  left: 50%;
  transform: translateX(-50%);
  font-size: 0.7rem;
  color: var(--color-text);
  opacity: 0.7;
}
</style>
