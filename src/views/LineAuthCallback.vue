<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()
const isLoading = ref(true)
const error = ref('')

onMounted(async () => {
  try {
    // 從 URL 參數中獲取授權碼
    const code = route.query.code as string
    const state = route.query.state as string

    if (!code) {
      throw new Error('授權碼不存在')
    }

    // 這裡您需要實作與後端的驗證邏輯
    // const result = await verifyLineAuth(code, state)

    // 模擬驗證過程
    await new Promise((resolve) => setTimeout(resolve, 2000))

    // 驗證成功，存儲用戶資訊到 localStorage
    const userData = {
      lineUserId: 'mock_line_user_id',
      displayName: 'LINE 用戶',
      pictureUrl: '',
      verified: true,
      verifiedAt: new Date().toISOString(),
    }

    localStorage.setItem('lineAuth', JSON.stringify(userData))

    // 跳轉到客戶註冊頁面
    router.push('/customer-register?verified=true')
  } catch (err) {
    error.value = err instanceof Error ? err.message : 'LINE 驗證失敗'
    isLoading.value = false
  }
})

const handleRetry = () => {
  // 重新導向到 LINE 登入
  router.push('/customer-register')
}
</script>

<template>
  <div class="auth-callback">
    <div class="callback-container">
      <div v-if="isLoading" class="loading-section">
        <div class="loading-spinner">
          <div class="spinner"></div>
        </div>
        <h2>LINE 驗證中...</h2>
        <p>請稍候，我們正在驗證您的 LINE 帳戶</p>
      </div>

      <div v-else-if="error" class="error-section">
        <div class="error-icon">❌</div>
        <h2>驗證失敗</h2>
        <p>{{ error }}</p>
        <div class="error-actions">
          <button @click="handleRetry" class="retry-btn">重新驗證</button>
          <button @click="router.push('/')" class="home-btn">返回首頁</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.auth-callback {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  padding: 2rem;
}

.callback-container {
  background: var(--color-background-soft);
  border-radius: 16px;
  padding: 3rem;
  text-align: center;
  border: 1px solid var(--color-border);
  max-width: 400px;
  width: 100%;
}

.loading-section,
.error-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.loading-spinner {
  margin-bottom: 1rem;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top: 4px solid #00c300;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

.loading-section h2,
.error-section h2 {
  color: var(--color-heading);
  margin: 0;
}

.loading-section p,
.error-section p {
  color: var(--color-text);
  opacity: 0.8;
  margin: 0;
}

.error-icon {
  font-size: 3rem;
}

.error-actions {
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
}

.retry-btn,
.home-btn {
  padding: 0.8rem 1.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
}

.retry-btn {
  background: #00c300;
  color: white;
}

.retry-btn:hover {
  background: #00a000;
}

.home-btn {
  background: transparent;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.home-btn:hover {
  background: var(--color-background-mute);
}

@media (max-width: 768px) {
  .callback-container {
    padding: 2rem;
  }

  .error-actions {
    flex-direction: column;
  }
}
</style>
