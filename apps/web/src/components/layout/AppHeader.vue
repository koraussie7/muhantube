<template>
  <header class="dtube-header">
    <div class="header-container">
      <!-- Logo -->
      <router-link to="/" class="logo">
        <img src="/images/DTube_White.svg" alt="MuHanTube" class="h-8" />
        <span class="logo-text">MuHanTube</span>
      </router-link>

      <!-- Search Bar -->
      <div class="search-container">
        <div class="search-box">
          <i class="search-icon bx bx-search"></i>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Search videos..."
            @keyup.enter="handleSearch"
            class="search-input"
          />
        </div>
      </div>

      <!-- Navigation -->
      <nav class="nav-links">
        <router-link to="/" class="nav-item">
          <i class="bx bx-home"></i>
          <span class="nav-label">Home</span>
        </router-link>
        <router-link to="/farm" class="nav-item">
          <i class="bx bx-farm"></i>
          <span class="nav-label">Farm</span>
        </router-link>
        <router-link to="/coin" class="nav-item">
          <i class="bx bx-coin"></i>
          <span class="nav-label">DTC</span>
        </router-link>
      </nav>

      <!-- Auth / User Menu -->
      <div class="auth-section">
        <template v-if="authStore.isAuthenticated">
          <div class="user-menu">
            <span class="user-address">{{ authStore.user?.address?.slice(0, 8) }}...</span>
            <button @click="authStore.logout()" class="logout-btn">
              <i class="bx bx-log-out"></i>
            </button>
          </div>
        </template>
        <template v-else>
          <button @click="showLoginModal = true" class="login-btn">
            <i class="bx bx-wallet"></i> Connect
          </button>
        </template>
      </div>
    </div>

    <!-- Login Modal -->
    <Teleport to="body">
      <div v-if="showLoginModal" class="modal-overlay" @click.self="showLoginModal = false">
        <div class="modal-content">
          <h2>Connect Wallet</h2>
          <button @click="handleMinimaLogin" class="wallet-btn minima-btn">
            <i class="bx bx-link"></i> Minima MDS
          </button>
          <button @click="handleMetamaskLogin" class="wallet-btn metamask-btn">
            <i class="bx bxl-ethereum"></i> MetaMask
          </button>
          <button @click="showLoginModal = false" class="cancel-btn">Cancel</button>
        </div>
      </div>
    </Teleport>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()
const searchQuery = ref('')
const showLoginModal = ref(false)

function handleSearch() {
  if (searchQuery.value.trim()) {
    router.push({ name: 'tag', params: { tag: searchQuery.value } })
  }
}

async function handleMinimaLogin() {
  await authStore.loginWithMinima()
  showLoginModal.value = false
}

async function handleMetamaskLogin() {
  await authStore.loginWithMetamask()
  showLoginModal.value = false
}
</script>

<style scoped>
.dtube-header {
  background: #1a1a2e;
  border-bottom: 1px solid #16213e;
  padding: 0 1rem;
  height: 60px;
  display: flex;
  align-items: center;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  gap: 1rem;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  text-decoration: none;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: #e94560;
}

.search-container {
  flex: 1;
  max-width: 500px;
  margin: 0 auto;
}

.search-box {
  display: flex;
  align-items: center;
  background: #0f0f23;
  border-radius: 20px;
  padding: 0.4rem 1rem;
  border: 1px solid #333;
}

.search-input {
  background: none;
  border: none;
  color: white;
  margin-left: 0.5rem;
  flex: 1;
  outline: none;
}

.nav-links {
  display: flex;
  gap: 0.5rem;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  color: #aaa;
  text-decoration: none;
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  transition: all 0.2s;
}

.nav-item:hover, .nav-item.router-link-active {
  color: white;
  background: #0f0f23;
}

.nav-label {
  font-size: 0.875rem;
}

.auth-section {
  display: flex;
  align-items: center;
}

.login-btn {
  background: #e94560;
  color: white;
  border: none;
  padding: 0.5rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.875rem;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.user-address {
  color: #aaa;
  font-size: 0.875rem;
  font-family: monospace;
}

.logout-btn {
  background: none;
  border: none;
  color: #aaa;
  cursor: pointer;
  padding: 0.3rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 200;
}

.modal-content {
  background: #1a1a2e;
  padding: 2rem;
  border-radius: 12px;
  width: 320px;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.modal-content h2 {
  color: white;
  text-align: center;
  margin-bottom: 0.5rem;
}

.wallet-btn {
  padding: 0.75rem;
  border: 1px solid #333;
  border-radius: 8px;
  cursor: pointer;
  font-size: 1rem;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.5rem;
  transition: all 0.2s;
}

.minima-btn {
  background: #0f0f23;
  color: white;
}

.metamask-btn {
  background: #f6851b;
  color: white;
  border-color: #f6851b;
}

.cancel-btn {
  background: none;
  border: 1px solid #333;
  color: #aaa;
  padding: 0.75rem;
  border-radius: 8px;
  cursor: pointer;
}
</style>
