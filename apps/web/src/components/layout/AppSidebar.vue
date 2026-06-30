<template>
  <aside class="sidebar" :class="{ collapsed: isCollapsed }" @mouseenter="isCollapsed = false" @mouseleave="isCollapsed = true">
    <nav class="sidebar-nav">
      <router-link to="/" class="nav-item" exact-active-class="active">
        <i class="nav-icon bx bx-home"></i>
        <span class="nav-label">Home</span>
      </router-link>
      <router-link to="/trending" class="nav-item" active-class="active">
        <i class="nav-icon bx bx-trending-up"></i>
        <span class="nav-label">Trending</span>
      </router-link>
      <router-link to="/farm" class="nav-item" active-class="active">
        <i class="nav-icon bx bx-farm"></i>
        <span class="nav-label">Farm</span>
      </router-link>
      <router-link to="/coin" class="nav-item" active-class="active">
        <i class="nav-icon bx bx-coin"></i>
        <span class="nav-label">DTC</span>
      </router-link>

      <div class="nav-divider"></div>

      <router-link to="/settings" class="nav-item" active-class="active">
        <i class="nav-icon bx bx-cog"></i>
        <span class="nav-label">Settings</span>
      </router-link>
    </nav>

    <!-- Collapse toggle -->
    <button class="collapse-btn" @click="isCollapsed = !isCollapsed">
      <i class="bx" :class="isCollapsed ? 'bx-chevron-right' : 'bx-chevron-left'"></i>
    </button>
  </aside>
</template>

<script setup>
import { ref } from 'vue'

const isCollapsed = ref(true)
</script>

<style scoped>
.sidebar {
  position: fixed;
  top: 60px;
  left: 0;
  bottom: 0;
  width: 200px;
  background: #1a1a2e;
  border-right: 1px solid #16213e;
  z-index: 90;
  display: flex;
  flex-direction: column;
  transition: width 0.25s ease, transform 0.25s ease;
  overflow: hidden;
}

.sidebar.collapsed {
  width: 60px;
}

.sidebar-nav {
  flex: 1;
  padding: 0.75rem 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: #aaa;
  text-decoration: none;
  transition: all 0.15s ease;
  white-space: nowrap;
  border-radius: 0;
  margin: 2px 0;
}

.nav-item:hover {
  background: #0f0f23;
  color: #f97316;
}

.nav-item.active {
  background: #0f0f23;
  color: #f97316;
  border-left: 3px solid #f97316;
}

.nav-icon {
  font-size: 1.3rem;
  min-width: 24px;
  text-align: center;
  flex-shrink: 0;
}

.nav-label {
  font-size: 0.875rem;
  font-weight: 500;
  opacity: 1;
  transition: opacity 0.2s;
}

.sidebar.collapsed .nav-label {
  opacity: 0;
  width: 0;
  overflow: hidden;
}

.nav-divider {
  height: 1px;
  background: #16213e;
  margin: 0.5rem 1rem;
}

.collapse-btn {
  position: absolute;
  bottom: 1rem;
  right: 0.5rem;
  background: none;
  border: none;
  color: #555;
  cursor: pointer;
  padding: 0.25rem;
  font-size: 1.1rem;
}

.collapse-btn:hover {
  color: #f97316;
}
</style>
