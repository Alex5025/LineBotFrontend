<script setup lang="ts">
import { ref } from 'vue'

const messages = ref([
  { id: 1, user: '用戶001', content: '請問營業時間？', time: '2分鐘前', status: 'unread' },
  { id: 2, user: '用戶002', content: '想了解產品資訊', time: '5分鐘前', status: 'read' },
  { id: 3, user: '用戶003', content: '有關訂單查詢', time: '10分鐘前', status: 'replied' },
  { id: 4, user: '用戶004', content: '退換貨流程', time: '15分鐘前', status: 'read' },
])

const newMessage = ref('')

const sendMessage = () => {
  if (newMessage.value.trim()) {
    console.log('發送訊息:', newMessage.value)
    newMessage.value = ''
  }
}
</script>

<template>
  <div class="message-center">
    <h2>訊息中心</h2>

    <div class="message-list">
      <div
        v-for="message in messages"
        :key="message.id"
        :class="['message-item', `status-${message.status}`]"
      >
        <div class="message-header">
          <span class="user-name">{{ message.user }}</span>
          <span class="message-time">{{ message.time }}</span>
        </div>
        <div class="message-content">{{ message.content }}</div>
        <div class="message-status">
          <span :class="['status-badge', `status-${message.status}`]">
            {{
              message.status === 'unread' ? '未讀' : message.status === 'read' ? '已讀' : '已回覆'
            }}
          </span>
        </div>
      </div>
    </div>

    <div class="quick-reply">
      <input
        v-model="newMessage"
        type="text"
        placeholder="輸入快速回覆..."
        @keyup.enter="sendMessage"
        class="reply-input"
      />
      <button @click="sendMessage" class="send-button">發送</button>
    </div>
  </div>
</template>

<style scoped>
.message-center {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
  height: fit-content;
}

.message-center h2 {
  margin-bottom: 1.5rem;
  color: var(--color-heading);
  font-size: 1.3rem;
  font-weight: 600;
}

.message-list {
  max-height: 300px;
  overflow-y: auto;
  margin-bottom: 1rem;
}

.message-item {
  background: var(--color-background);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 0.5rem;
  border: 1px solid var(--color-border);
  transition: all 0.2s ease;
}

.message-item:hover {
  border-color: var(--color-border-hover);
}

.status-unread {
  border-left: 4px solid #3b82f6;
}

.message-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
}

.user-name {
  font-weight: 600;
  color: var(--color-heading);
  font-size: 0.9rem;
}

.message-time {
  font-size: 0.8rem;
  color: var(--color-text);
  opacity: 0.7;
}

.message-content {
  color: var(--color-text);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.message-status {
  display: flex;
  justify-content: flex-end;
}

.status-badge {
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 12px;
  font-weight: 500;
}

.status-badge.status-unread {
  background: rgba(59, 130, 246, 0.1);
  color: #3b82f6;
}

.status-badge.status-read {
  background: rgba(107, 114, 128, 0.1);
  color: #6b7280;
}

.status-badge.status-replied {
  background: rgba(16, 185, 129, 0.1);
  color: #10b981;
}

.quick-reply {
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.reply-input {
  flex: 1;
  padding: 0.75rem;
  border: 1px solid var(--color-border);
  border-radius: 6px;
  background: var(--color-background);
  color: var(--color-text);
  font-size: 0.9rem;
}

.reply-input:focus {
  outline: none;
  border-color: #3b82f6;
}

.send-button {
  padding: 0.75rem 1.5rem;
  background: #3b82f6;
  color: white;
  border: none;
  border-radius: 6px;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.send-button:hover {
  background: #2563eb;
}
</style>
