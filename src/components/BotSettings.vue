<script setup lang="ts">
import { ref } from 'vue'

const botStatus = ref(true)
const autoReply = ref(true)
const notifications = ref(false)
const maintenanceMode = ref(false)

const settings = ref([
  { label: 'Bot 狀態', key: 'botStatus', type: 'toggle' },
  { label: '自動回覆', key: 'autoReply', type: 'toggle' },
  { label: '推播通知', key: 'notifications', type: 'toggle' },
  { label: '維護模式', key: 'maintenanceMode', type: 'toggle' },
])

const quickActions = ref([
  { label: '發送廣播', icon: '📢', action: 'broadcast' },
  { label: '查看記錄', icon: '📊', action: 'logs' },
  { label: '備份資料', icon: '💾', action: 'backup' },
  { label: '系統設定', icon: '⚙️', action: 'config' },
])

const toggleSetting = (key: string) => {
  switch (key) {
    case 'botStatus':
      botStatus.value = !botStatus.value
      break
    case 'autoReply':
      autoReply.value = !autoReply.value
      break
    case 'notifications':
      notifications.value = !notifications.value
      break
    case 'maintenanceMode':
      maintenanceMode.value = !maintenanceMode.value
      break
  }
}

const executeAction = (action: string) => {
  console.log('執行動作:', action)
}
</script>

<template>
  <div class="bot-settings">
    <h2>Bot 設定</h2>

    <div class="settings-section">
      <h3>基本設定</h3>
      <div class="settings-list">
        <div v-for="setting in settings" :key="setting.key" class="setting-item">
          <span class="setting-label">{{ setting.label }}</span>
          <button
            @click="toggleSetting(setting.key)"
            :class="[
              'toggle-button',
              {
                active:
                  setting.key === 'botStatus'
                    ? botStatus
                    : setting.key === 'autoReply'
                      ? autoReply
                      : setting.key === 'notifications'
                        ? notifications
                        : maintenanceMode,
              },
            ]"
          >
            <span class="toggle-slider"></span>
          </button>
        </div>
      </div>
    </div>

    <div class="quick-actions-section">
      <h3>快速操作</h3>
      <div class="actions-grid">
        <button
          v-for="action in quickActions"
          :key="action.action"
          @click="executeAction(action.action)"
          class="action-button"
        >
          <span class="action-icon">{{ action.icon }}</span>
          <span class="action-label">{{ action.label }}</span>
        </button>
      </div>
    </div>

    <div class="status-section">
      <h3>系統狀態</h3>
      <div class="status-grid">
        <div class="status-item">
          <span class="status-label">運行時間</span>
          <span class="status-value">7天 12小時</span>
        </div>
        <div class="status-item">
          <span class="status-label">記憶體使用</span>
          <span class="status-value">68%</span>
        </div>
        <div class="status-item">
          <span class="status-label">API 狀態</span>
          <span class="status-value status-online">正常</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.bot-settings {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  height: fit-content;
}

.bot-settings h2 {
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  font-size: 1.3rem;
  font-weight: 600;
}

.settings-section,
.quick-actions-section,
.status-section {
  margin-bottom: 1.5rem;
}

.settings-section h3,
.quick-actions-section h3,
.status-section h3 {
  font-size: 1rem;
  color: var(--color-heading);
  margin-bottom: 1rem;
  font-weight: 600;
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.75rem;
  background: var(--color-background);
  border-radius: 8px;
  border: 1px solid var(--color-border);
  margin-bottom: 0.5rem;
}

.setting-label {
  font-size: 0.9rem;
  color: var(--color-text);
}

.toggle-button {
  width: 44px;
  height: 24px;
  background: #e5e7eb;
  border: none;
  border-radius: 12px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.toggle-button.active {
  background: #3b82f6;
}

.toggle-slider {
  position: absolute;
  top: 2px;
  left: 2px;
  width: 20px;
  height: 20px;
  background: white;
  border-radius: 50%;
  transition: transform 0.3s ease;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.toggle-button.active .toggle-slider {
  transform: translateX(20px);
}

.actions-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.5rem;
}

.action-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 1rem 0.5rem;
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-button:hover {
  border-color: var(--color-border-hover);
  transform: translateY(-2px);
}

.action-icon {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
}

.action-label {
  font-size: 0.8rem;
  color: var(--color-text);
  text-align: center;
}

.status-grid {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.status-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem;
  background: var(--color-background);
  border-radius: 6px;
  border: 1px solid var(--color-border);
}

.status-label {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.8;
}

.status-value {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--color-heading);
}

.status-online {
  color: #10b981;
}
</style>
