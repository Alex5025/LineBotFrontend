<script setup lang="ts">
import { useServiceStore, type Service } from '../stores/service'

const emit = defineEmits<{
  edit: [service: Service]
}>()

const serviceStore = useServiceStore()

const categoryLabels = {
  beauty: '美容美體',
  hair: '美髮造型',
  fitness: '健身指導',
}

const formatCurrency = (amount: number) => {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    minimumFractionDigits: 0,
  }).format(amount)
}

const editService = (service: Service) => {
  emit('edit', service)
}

const deleteService = (id: string) => {
  if (confirm('確定要刪除此服務嗎？')) {
    serviceStore.deleteService(id)
  }
}

const toggleServiceStatus = (service: Service) => {
  serviceStore.updateService(service.id, { isActive: !service.isActive })
}
</script>

<template>
  <div class="service-list">
    <h2>服務列表</h2>

    <div class="services-grid">
      <div
        v-for="service in serviceStore.services"
        :key="service.id"
        :class="['service-card', { inactive: !service.isActive }]"
      >
        <div class="service-header">
          <h3>{{ service.name }}</h3>
          <div class="service-actions">
            <button @click="editService(service)" class="edit-btn">編輯</button>
            <button @click="deleteService(service.id)" class="delete-btn">刪除</button>
          </div>
        </div>

        <p class="service-description">{{ service.description }}</p>

        <div class="service-details">
          <div class="detail-item">
            <span class="label">價格：</span>
            <span class="price">{{ formatCurrency(service.price) }}</span>
          </div>
          <div class="detail-item">
            <span class="label">時間：</span>
            <span>{{ service.duration }} 分鐘</span>
          </div>
          <div class="detail-item">
            <span class="label">類別：</span>
            <span class="category">{{ categoryLabels[service.category] }}</span>
          </div>
        </div>

        <div class="service-status">
          <label class="status-toggle">
            <input
              :checked="service.isActive"
              @change="toggleServiceStatus(service)"
              type="checkbox"
            />
            {{ service.isActive ? '啟用中' : '已停用' }}
          </label>
        </div>
      </div>
    </div>

    <div v-if="serviceStore.services.length === 0" class="empty-state">
      <h3>尚未新增任何服務</h3>
      <p>開始新增您的第一個服務項目吧！</p>
    </div>
  </div>
</template>

<style scoped>
.service-list {
  background: var(--color-background-soft);
  border-radius: 12px;
  padding: 1.5rem;
  border: 1px solid var(--color-border);
}

.service-list h2 {
  color: var(--color-heading);
  margin-bottom: 1.5rem;
  font-size: 1.4rem;
  font-weight: 600;
}

.services-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.service-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 8px;
  padding: 1.5rem;
  transition: all 0.2s ease;
}

.service-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
}

.service-card.inactive {
  opacity: 0.6;
}

.service-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1rem;
}

.service-header h3 {
  color: var(--color-heading);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
}

.service-actions {
  display: flex;
  gap: 0.5rem;
}

.edit-btn,
.delete-btn {
  padding: 0.3rem 0.8rem;
  border: none;
  border-radius: 4px;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.edit-btn {
  background: #8b5cf6;
  color: white;
}

.edit-btn:hover {
  background: #7c3aed;
}

.delete-btn {
  background: #ef4444;
  color: white;
}

.delete-btn:hover {
  background: #dc2626;
}

.service-description {
  color: var(--color-text);
  margin-bottom: 1rem;
  line-height: 1.4;
}

.service-details {
  margin-bottom: 1rem;
}

.detail-item {
  display: flex;
  justify-content: space-between;
  margin-bottom: 0.5rem;
}

.label {
  color: var(--color-text);
  opacity: 0.8;
}

.price {
  color: #10b981;
  font-weight: 600;
}

.category {
  color: var(--color-heading);
  font-weight: 500;
}

.service-status {
  padding-top: 1rem;
  border-top: 1px solid var(--color-border);
}

.status-toggle {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--color-text);
  cursor: pointer;
}

.empty-state {
  text-align: center;
  padding: 3rem 1rem;
}

.empty-state h3 {
  color: var(--color-heading);
  margin-bottom: 0.5rem;
}

.empty-state p {
  color: var(--color-text);
  opacity: 0.7;
}

@media (max-width: 768px) {
  .services-grid {
    grid-template-columns: 1fr;
  }

  .service-header {
    flex-direction: column;
    gap: 1rem;
  }

  .service-actions {
    align-self: flex-start;
  }
}
</style>
