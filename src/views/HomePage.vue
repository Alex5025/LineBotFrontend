<script setup lang="ts">
import { useRouter } from 'vue-router'

const router = useRouter()

const goToLogin = () => {
  router.push('/login')
}

const goToRegister = () => {
  router.push('/register')
}
</script>

<template>
  <div class="home-page">
    <div class="hero-section">
      <div class="hero-content">
        <div class="logo-large">💼</div>
        <h1>自理業者管理系統</h1>
        <p class="hero-subtitle">專為美容美體、美髮、健身教練設計的全方位管理解決方案</p>

        <div class="hero-actions">
          <button @click="goToLogin" class="cta-btn primary">立即登入</button>
          <button @click="goToRegister" class="cta-btn secondary">免費註冊</button>
        </div>
      </div>
    </div>

    <div class="features-section">
      <div class="container">
        <h2>為什麼選擇我們？</h2>

        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">👥</div>
            <h3>客戶管理</h3>
            <p>完整的客戶資料管理，包含個人資訊、服務記錄、預約歷史等詳細資料</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">✨</div>
            <h3>服務管理</h3>
            <p>靈活的服務項目設定，支援不同類型的服務和價格管理</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📊</div>
            <h3>財務報表</h3>
            <p>詳細的營收統計和財務分析，幫助您了解業務表現</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">📅</div>
            <h3>預約系統</h3>
            <p>方便的預約管理功能，讓顧客輕鬆預約服務</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">💆‍♀️</div>
            <h3>美容美體</h3>
            <p>專為美容美體業者設計的功能，包含膚質管理、療程紀錄等</p>
          </div>

          <div class="feature-card">
            <div class="feature-icon">💇‍♀️</div>
            <h3>美髮造型</h3>
            <p>髮質分析、髮色記錄、造型歷史等專業美髮管理功能</p>
          </div>
        </div>
      </div>
    </div>

    <div class="user-types-section">
      <div class="container">
        <h2>適合不同類型的專業人士</h2>

        <div class="user-types">
          <div class="user-type-card owner">
            <div class="user-icon">👨‍💼</div>
            <h3>業主管理端</h3>
            <ul>
              <li>完整的客戶資料管理</li>
              <li>服務項目與價格設定</li>
              <li>營收統計與財務分析</li>
              <li>預約管理與排程</li>
              <li>客戶活動追蹤</li>
            </ul>
            <button @click="goToLogin" class="user-type-btn">業主登入</button>
          </div>

          <div class="user-type-card customer">
            <div class="user-icon">👤</div>
            <h3>顧客專屬頁面</h3>
            <ul>
              <li>個人服務歷史查看</li>
              <li>月度活動統計</li>
              <li>預約記錄管理</li>
              <li>服務評價與回饋</li>
              <li>個人資料維護</li>
            </ul>
            <button @click="goToRegister" class="user-type-btn">顧客註冊</button>
          </div>
        </div>
      </div>
    </div>

    <div class="cta-section">
      <div class="container">
        <h2>開始使用自理業者管理系統</h2>
        <p>立即體驗專業的客戶管理解決方案</p>
        <div class="cta-actions">
          <button @click="goToLogin" class="cta-btn primary large">立即登入</button>
          <button @click="goToRegister" class="cta-btn secondary large">免費註冊</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.home-page {
  min-height: 100vh;
}

.hero-section {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(16, 185, 129, 0.1));
  padding: 4rem 2rem;
  text-align: center;
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
}

.hero-content {
  max-width: 800px;
}

.logo-large {
  font-size: 6rem;
  margin-bottom: 2rem;
  background: linear-gradient(45deg, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-section h1 {
  font-size: 3.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1rem;
  background: linear-gradient(45deg, #8b5cf6, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
}

.hero-subtitle {
  font-size: 1.3rem;
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 3rem;
  line-height: 1.6;
}

.hero-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

.cta-btn {
  padding: 1rem 2.5rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  font-size: 1.1rem;
  cursor: pointer;
  transition: all 0.3s ease;
  text-decoration: none;
  display: inline-block;
}

.cta-btn.primary {
  background: linear-gradient(45deg, #8b5cf6, #06b6d4);
  color: white;
}

.cta-btn.primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 8px 25px rgba(139, 92, 246, 0.3);
}

.cta-btn.secondary {
  background: transparent;
  color: var(--color-text);
  border: 2px solid var(--color-border);
}

.cta-btn.secondary:hover {
  border-color: #8b5cf6;
  color: #8b5cf6;
  transform: translateY(-3px);
}

.cta-btn.large {
  padding: 1.2rem 3rem;
  font-size: 1.2rem;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem;
}

.features-section {
  padding: 5rem 0;
  background: var(--color-background-soft);
}

.features-section h2 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 3rem;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
}

.feature-card {
  background: var(--color-background);
  border: 1px solid var(--color-border);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  transition: all 0.3s ease;
}

.feature-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.1);
  border-color: #8b5cf6;
}

.feature-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
}

.feature-card h3 {
  font-size: 1.3rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.feature-card p {
  color: var(--color-text);
  opacity: 0.8;
  line-height: 1.6;
}

.user-types-section {
  padding: 5rem 0;
}

.user-types-section h2 {
  text-align: center;
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 3rem;
}

.user-types {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
  gap: 3rem;
  max-width: 1000px;
  margin: 0 auto;
}

.user-type-card {
  background: var(--color-background-soft);
  border: 2px solid var(--color-border);
  border-radius: 16px;
  padding: 2.5rem;
  text-align: center;
  transition: all 0.3s ease;
}

.user-type-card:hover {
  transform: translateY(-5px);
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.1);
}

.user-type-card.owner {
  border-color: #8b5cf6;
  background: rgba(139, 92, 246, 0.05);
}

.user-type-card.customer {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.user-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
}

.user-type-card h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-heading);
  margin-bottom: 1.5rem;
}

.user-type-card ul {
  list-style: none;
  padding: 0;
  margin: 0 0 2rem 0;
  text-align: left;
}

.user-type-card li {
  padding: 0.5rem 0;
  color: var(--color-text);
  position: relative;
  padding-left: 1.5rem;
}

.user-type-card li::before {
  content: '✓';
  position: absolute;
  left: 0;
  color: #10b981;
  font-weight: bold;
}

.user-type-btn {
  padding: 1rem 2rem;
  border: none;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  font-size: 1rem;
}

.user-type-card.owner .user-type-btn {
  background: #8b5cf6;
  color: white;
}

.user-type-card.owner .user-type-btn:hover {
  background: #7c3aed;
}

.user-type-card.customer .user-type-btn {
  background: #10b981;
  color: white;
}

.user-type-card.customer .user-type-btn:hover {
  background: #059669;
}

.cta-section {
  background: linear-gradient(135deg, rgba(139, 92, 246, 0.1), rgba(16, 185, 129, 0.1));
  padding: 5rem 0;
  text-align: center;
}

.cta-section h2 {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-heading);
  margin-bottom: 1rem;
}

.cta-section p {
  font-size: 1.2rem;
  color: var(--color-text);
  opacity: 0.8;
  margin-bottom: 2.5rem;
}

.cta-actions {
  display: flex;
  gap: 1.5rem;
  justify-content: center;
  flex-wrap: wrap;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 3rem 1rem;
    min-height: 70vh;
  }

  .logo-large {
    font-size: 4rem;
  }

  .hero-section h1 {
    font-size: 2.5rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .hero-actions {
    flex-direction: column;
    align-items: center;
  }

  .cta-btn {
    width: 100%;
    max-width: 300px;
  }

  .features-grid {
    grid-template-columns: 1fr;
  }

  .user-types {
    grid-template-columns: 1fr;
  }

  .cta-actions {
    flex-direction: column;
    align-items: center;
  }
}
</style>
