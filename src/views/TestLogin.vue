<script setup lang="ts">
import { useAuthStore } from '../stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

const testOwnerLogin = () => {
  console.log('測試業主登入')
  authStore.loginAsOwner({
    id: 'owner_test',
    name: '測試業主',
    email: 'owner@test.com',
  })
  console.log('登入狀態:', authStore.isAuthenticated, authStore.userRole)
  router.push('/owner')
}

const testCustomerLogin = () => {
  console.log('測試顧客登入')
  authStore.loginAsCustomer({
    id: '1',
    name: '王小美',
    email: 'wang@example.com',
  })
  console.log('登入狀態:', authStore.isAuthenticated, authStore.userRole)
  router.push('/customer')
}

const checkAuthState = () => {
  console.log('當前登入狀態:', {
    isAuthenticated: authStore.isAuthenticated,
    userRole: authStore.userRole,
    currentUser: authStore.currentUser,
  })
}
</script>

<template>
  <div style="padding: 2rem">
    <h1>登入功能測試</h1>

    <div style="margin: 2rem 0">
      <button @click="checkAuthState" style="margin-right: 1rem; padding: 0.5rem 1rem">
        檢查登入狀態
      </button>
    </div>

    <div style="margin: 2rem 0">
      <button
        @click="testOwnerLogin"
        style="
          margin-right: 1rem;
          padding: 0.5rem 1rem;
          background: #8b5cf6;
          color: white;
          border: none;
          border-radius: 4px;
        "
      >
        測試業主登入
      </button>

      <button
        @click="testCustomerLogin"
        style="
          padding: 0.5rem 1rem;
          background: #10b981;
          color: white;
          border: none;
          border-radius: 4px;
        "
      >
        測試顧客登入
      </button>
    </div>

    <div
      v-if="authStore.isAuthenticated"
      style="margin-top: 2rem; padding: 1rem; background: #f0f0f0; border-radius: 4px"
    >
      <h3>當前用戶信息：</h3>
      <p>姓名: {{ authStore.currentUser?.name }}</p>
      <p>角色: {{ authStore.userRole }}</p>
      <p>登入狀態: {{ authStore.isAuthenticated ? '已登入' : '未登入' }}</p>
    </div>
  </div>
</template>
