<script setup lang="ts">
defineProps<{
  msg: string
}>()
</script>

<template>
  <div class="welcome-banner">
    <div class="banner-icon">🚀</div>
    <h1 class="banner-title">{{ msg }}</h1>
    <p class="banner-description">
      您的 Line Bot 管理系統已經準備就緒！透過這個儀表板，您可以監控 Bot 活動、
      管理用戶訊息、調整設定，以及查看詳細的統計資料。
    </p>
    <div class="banner-actions">
      <button class="action-btn primary">開始使用</button>
      <button class="action-btn secondary">查看文檔</button>
    </div>
  </div>
</template>

<style scoped>
.welcome-banner {
  text-align: center;
  padding: 3rem 2rem;
  background: linear-gradient(135deg, rgba(59, 130, 246, 0.1), rgba(16, 185, 129, 0.1));
  border-radius: 16px;
  border: 1px solid var(--color-border);
  margin-bottom: 2rem;
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
  background: linear-gradient(45deg, #3b82f6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.banner-description {
  font-size: 1.1rem;
  color: var(--color-text);
  opacity: 0.8;
  line-height: 1.6;
  max-width: 600px;
  margin: 0 auto 2rem;
}

.banner-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.action-btn {
  padding: 0.75rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.action-btn.primary {
  background: #3b82f6;
  color: white;
}

.action-btn.primary:hover {
  background: #2563eb;
  transform: translateY(-2px);
}

.action-btn.secondary {
  background: transparent;
  color: var(--color-text);
  border: 2px solid var(--color-border);
}

.action-btn.secondary:hover {
  border-color: #3b82f6;
  color: #3b82f6;
  transform: translateY(-2px);
}

@media (max-width: 768px) {
  .welcome-banner {
    padding: 2rem 1rem;
  }

  .banner-title {
    font-size: 2rem;
  }

  .banner-description {
    font-size: 1rem;
  }

  .banner-actions {
    flex-direction: column;
    align-items: center;
  }

  .action-btn {
    width: 100%;
    max-width: 200px;
  }
}
</style>
