<template>
  <div class="app-container" :class="{ 'night-mode': isNightMode }">
    <AppHeader />

    <main class="main-content">
      <router-view />
    </main>

    <!-- Footer -->
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

const isNightMode = ref(true)
provide('isNightMode', isNightMode)
provide('toggleNightMode', () => { isNightMode.value = !isNightMode.value })
</script>

<style>
/* Global DTube Styles */
:root {
  --dtube-bg: #0f0f23;
  --dtube-card: #1a1a2e;
  --dtube-accent: #e94560;
  --dtube-text: #eaeaea;
  --dtube-muted: #aaa;
  --dtube-border: #16213e;
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--dtube-bg);
  color: var(--dtube-text);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  min-height: 100vh;
}

#app {
  min-height: 100vh;
}

a {
  color: #e94560;
  text-decoration: none;
}

a:hover {
  opacity: 0.8;
}

/* Scrollbar */
::-webkit-scrollbar {
  width: 8px;
}

::-webkit-scrollbar-track {
  background: #0f0f23;
}

::-webkit-scrollbar-thumb {
  background: #333;
  border-radius: 4px;
}

/* Semantic UI overrides for dark theme */
.ui.segment {
  background: var(--dtube-card) !important;
  border-color: var(--dtube-border) !important;
}

.ui.label {
  background: #16213e !important;
  color: var(--dtube-text) !important;
}
</style>

<style scoped>
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  margin-top: 60px;
  padding-bottom: 2rem;
}

.app-footer {
  background: #1a1a2e;
  border-top: 1px solid #16213e;
  padding: 1rem;
  text-align: center;
}

.footer-content {
  max-width: 1400px;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: #666;
  font-size: 0.8rem;
}

.footer-links {
  display: flex;
  gap: 1rem;
}

.footer-links a {
  color: #666;
}

.footer-links a:hover {
  color: #e94560;
}
</style>
