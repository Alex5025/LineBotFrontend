<script setup lang="ts">
import { RouterLink, RouterView, useRouter } from 'vue-router'
import { useAuthStore } from './stores/auth'

const authStore = useAuthStore()
const router = useRouter()

const handleLogout = async () => {
  console.log('執行登出')
  authStore.logout()
  console.log('登出完成，跳轉到首頁')
  await router.push('/')
  console.log('跳轉完成')
}
</script>

<template>
  <div id="app">
    <header class="app-header">
      <div class="header-content">
        <div class="logo-section">
          <div class="logo">💼</div>
          <h1>自理業者管理系統</h1>
        </div>

        <nav v-if="authStore.isAuthenticated" class="nav-menu">
          <!-- 業主導航 -->
          <template v-if="authStore.isOwner">
            <RouterLink to="/owner" class="nav-link">首頁</RouterLink>
            <RouterLink to="/customers" class="nav-link">客戶管理</RouterLink>
            <RouterLink to="/services" class="nav-link">服務管理</RouterLink>
            <RouterLink to="/reports" class="nav-link">財務報表</RouterLink>
          </template>

          <!-- 顧客導航 -->
          <template v-if="authStore.isCustomer">
            <RouterLink to="/customer" class="nav-link">我的首頁</RouterLink>
          </template>

          <!-- 用戶資訊和登出 -->
          <div class="user-menu">
            <span class="user-name">{{ authStore.currentUser?.name }}</span>
            <button @click="handleLogout" class="logout-btn">登出</button>
          </div>
        </nav>

        <nav v-else class="nav-menu">
          <RouterLink to="/" class="nav-link">首頁</RouterLink>
          <RouterLink to="/login" class="nav-link">登入</RouterLink>
          <RouterLink to="/register" class="nav-link">註冊</RouterLink>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>

    <footer class="app-footer">
      <p>&copy; 2024 自理業者管理系統. 專為美容美體、美髮、健身教練設計.</p>
    </footer>
  </div>
</template>

<style scoped>
#app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-header {
  background: var(--color-background-soft);
  border-bottom: 1px solid var(--color-border);
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-content {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 2rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo-section {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  font-size: 2rem;
  background: linear-gradient(45deg, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.logo-section h1 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin: 0;
}

.nav-menu {
  display: flex;
  gap: 2rem;
}

.nav-link {
  text-decoration: none;
  color: var(--color-text);
  font-weight: 500;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: all 0.2s ease;
}

.nav-link:hover {
  background: var(--color-background-mute);
  color: var(--color-heading);
}

.nav-link.router-link-exact-active {
  background: #8b5cf6;
  color: white;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-left: 1rem;
  padding-left: 1rem;
  border-left: 1px solid var(--color-border);
}

.user-name {
  color: var(--color-heading);
  font-weight: 500;
  font-size: 0.9rem;
}

.logout-btn {
  background: #ef4444;
  color: white;
  border: none;
  padding: 0.4rem 0.8rem;
  border-radius: 4px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.logout-btn:hover {
  background: #dc2626;
}

.app-main {
  flex: 1;
  padding: 0;
}

.app-footer {
  background: var(--color-background-soft);
  border-top: 1px solid var(--color-border);
  padding: 1rem 0;
  text-align: center;
}

.app-footer p {
  margin: 0;
  color: var(--color-text);
  opacity: 0.7;
  font-size: 0.9rem;
}

@media (max-width: 768px) {
  .header-content {
    flex-direction: column;
    gap: 1rem;
    padding: 0 1rem;
  }

  .logo-section h1 {
    font-size: 1.2rem;
  }

  .nav-menu {
    gap: 1rem;
    flex-wrap: wrap;
    justify-content: center;
  }

  .nav-link {
    font-size: 0.9rem;
    padding: 0.4rem 0.8rem;
  }
}
</style>
