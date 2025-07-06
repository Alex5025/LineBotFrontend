<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'

const router = useRouter()
const authStore = useAuthStore()

const selectedRole = ref<'owner' | 'customer'>('owner')
const isLoading = ref(false)

const mockUsers = {
  owner: {
    id: 'owner_1',
    name: '店主 張老闆',
    email: 'owner@example.com',
    phone: '0912-345-678',
  },
  customer: {
    id: 'customer_1',
    name: '顧客 王小美',
    email: 'customer@example.com',
    phone: '0987-654-321',
  },
}

const loginAsOwner = async () => {
  if (isLoading.value) return

  selectedRole.value = 'owner'
  isLoading.value = true
  console.log('開始業主登入流程')

  try {
    // 模擬登入延遲
    await new Promise((resolve) => setTimeout(resolve, 800))

    const userData = mockUsers.owner
    console.log('業主資料:', userData)

    authStore.loginAsOwner(userData)
    console.log('業主登入完成，準備跳轉到 /owner')
    await router.push('/owner')
    console.log('跳轉完成')
  } catch (error) {
    console.error('業主登入失敗:', error)
  } finally {
    isLoading.value = false
  }
}

const loginAsCustomer = async () => {
  if (isLoading.value) return

  selectedRole.value = 'customer'
  isLoading.value = true
  console.log('開始顧客登入流程')

  try {
    // 模擬登入延遲
    await new Promise((resolve) => setTimeout(resolve, 800))

    const userData = mockUsers.customer
    console.log('顧客資料:', userData)

    authStore.loginAsCustomer(userData)
    console.log('顧客登入完成，準備跳轉到 /customer')
    await router.push('/customer')
    console.log('跳轉完成')
  } catch (error) {
    console.error('顧客登入失敗:', error)
  } finally {
    isLoading.value = false
  }
}

const goToCustomerRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="login-page">
    <div class="login-container">
      <div class="login-header">
        <div class="logo">💼</div>
        <h1>自理業者管理系統</h1>
        <p>請選擇您的身份進行登入</p>
      </div>

      <div class="role-selection">
        <h2>選擇登入身份</h2>
        <div class="role-cards">
          <div @click="loginAsOwner" :class="['role-card', { selected: selectedRole === 'owner' }]">
            <div class="role-icon">👨‍💼</div>
            <div class="role-info">
              <h3>業主登入</h3>
              <p>管理客戶、服務與財務</p>
            </div>
            <div v-if="isLoading && selectedRole === 'owner'" class="loading-indicator">
              登入中...
            </div>
          </div>

          <div
            @click="loginAsCustomer"
            :class="['role-card', { selected: selectedRole === 'customer' }]"
          >
            <div class="role-icon">👤</div>
            <div class="role-info">
              <h3>顧客登入</h3>
              <p>查看個人活動紀錄</p>
            </div>
            <div v-if="isLoading && selectedRole === 'customer'" class="loading-indicator">
              登入中...
            </div>
          </div>
        </div>
      </div>

      <div class="register-section">
        <div class="divider">
          <span>還沒有帳戶？</span>
        </div>

        <button @click="goToCustomerRegister" class="register-btn">新顧客註冊</button>
      </div>

      <div class="demo-info">
        <h4>測試帳號說明</h4>
        <div class="demo-accounts">
          <div class="demo-account"><strong>業主帳號：</strong>張老闆 (管理端功能)</div>
          <div class="demo-account"><strong>顧客帳號：</strong>王小美 (顧客端功能)</div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-background);
  padding: 2rem;
}

.login-container {
  background: var(--color-background-soft);
  border-radius: 16px;
  padding: 3rem;
  border: 1px solid var(--color-border);
  max-width: 500px;
  width: 100%;
}

.login-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  font-size: 4rem;
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.login-header h1 {
  color: var(--color-heading);
  font-size: 1.8rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.login-header p {
  color: var(--color-text);
  opacity: 0.8;
}

.role-selection {
  margin-bottom: 2rem;
}

.role-selection h2 {
  color: var(--color-heading);
  font-size: 1.2rem;
  font-weight: 600;
  margin-bottom: 1rem;
  text-align: center;
}

.role-cards {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.role-card {
  background: var(--color-background);
  border: 2px solid var(--color-border);
  border-radius: 12px;
  padding: 1.5rem;
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
  user-select: none;
}

.role-card:hover {
  border-color: #8b5cf6;
  transform: translateY(-4px) scale(1.02);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.2);
}

.role-card:active {
  transform: translateY(-2px) scale(1.01);
}

.role-card.selected {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.15);
  transform: translateY(-2px);
}

.loading-indicator {
  position: absolute;
  top: 50%;
  right: 1rem;
  transform: translateY(-50%);
  background: #8b5cf6;
  color: white;
  padding: 0.3rem 0.8rem;
  border-radius: 12px;
  font-size: 0.8rem;
  font-weight: 500;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.7;
  }
}

.role-icon {
  font-size: 2.5rem;
  flex-shrink: 0;
}

.role-info h3 {
  color: var(--color-heading);
  font-weight: 600;
  margin-bottom: 0.3rem;
}

.role-info p {
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.9rem;
}

.register-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.divider {
  text-align: center;
  position: relative;
  margin: 1rem 0;
}

.divider::before {
  content: '';
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background: var(--color-border);
}

.divider span {
  background: var(--color-background-soft);
  padding: 0 1rem;
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.9rem;
}

.register-btn {
  background: transparent;
  color: #10b981;
  border: 2px solid #10b981;
  padding: 1rem 2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.register-btn:hover {
  background: #10b981;
  color: white;
  transform: translateY(-2px);
}

.demo-info {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.demo-info h4 {
  color: var(--color-heading);
  font-weight: 600;
  margin-bottom: 1rem;
}

.demo-accounts {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.demo-account {
  color: var(--color-text);
  opacity: 0.8;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .login-container {
    padding: 2rem;
  }

  .role-card {
    padding: 1rem;
  }

  .role-icon {
    font-size: 2rem;
  }
}
</style>
