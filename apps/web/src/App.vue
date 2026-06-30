<template>
  <div class="app-container" :class="{ 'night-mode': isNightMode, 'sidebar-expanded': !sidebarCollapsed }">
    <AppHeader />

    <div class="app-layout">
      <AppSidebar @toggle="sidebarCollapsed = !sidebarCollapsed" />

      <main class="main-content" :class="{ 'sidebar-collapsed': sidebarCollapsed }">
        <router-view />
      </main>
    </div>

    <footer class="app-footer">
      <div class="footer-content">
        <span>© 2026 MuHanTube — Powered by DADA AI Video Universe</span>
        <span class="footer-links">
          <a href="https://minima.global" target="_blank">Minima</a>
          <a href="https://d.tube" target="_blank">DTube</a>
        </span>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref, provide } from 'vue'
import AppHeader from '@/components/layout/AppHeader.vue'
import AppSidebar from '@/components/layout/AppSidebar.vue'

const isNightMode = ref(true)
const sidebarCollapsed = ref(false)
provide('isNightMode', isNightMode)
provide('toggleNightMode', () => { isNightMode.value = !isNightMode.value })
</script>

<style>
/* Global MuhanTube Styles */
:root {
  --bg-primary: #0f0f23;
  --bg-card: #1a1a2e;
  --bg-sidebar: #15152a;
  --accent: #f97316;
  --accent-hover: #ea580c;
  --text-primary: #eaeaea;
  --text-muted: #888;
  --text-dim: #555;
  --border: #16213e;
  --sidebar-width: 200px;
  --sidebar-collapsed-width: 60px;
  --header-height: 60px;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--bg-primary);
  color: var(--text-primary);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

a {
  color: var(--accent);
  text-decoration: none;
}

a:hover {
  opacity: 0.8;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: var(--bg-primary);
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #555;
}

/* Semantic UI overrides for dark theme */
.ui.segment {
  background: var(--bg-card) !important;
  border-color: var(--border) !important;
}

.ui.label {
  background: #16213e !important;
  color: var(--text-primary) !important;
}
</style>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.app-layout {
  display: flex;
  min-height: calc(100vh - var(--header-height));
  margin-top: var(--header-height);
}

.main-content {
  flex: 1;
  margin-left: 200px;
  padding-bottom: 2rem;
  transition: margin-left 0.25s ease;
}

.main-content.sidebar-collapsed {
  margin-left: 60px;
}

.app-footer {
  background: var(--bg-card);
  border-top: 1px solid var(--border);
  padding: 1rem;
  text-align: center;
  margin-left: 200px;
  transition: margin-left 0.25s ease;
}

.sidebar-expanded .app-footer {
  margin-left: 200px;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--text-dim);
  font-size: 0.8rem;
}

.footer-links {
  display: flex;
  gap: 1rem;
}

.footer-links a {
  color: var(--text-dim);
}

.footer-links a:hover {
  color: var(--accent);
}
</style>
