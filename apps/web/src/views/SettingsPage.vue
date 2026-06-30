<template>
  <div class="settings-container max-w-4xl mx-auto px-4 pt-4">
    <h1 class="text-2xl font-bold mb-6">
      <i class="bx bx-cog"></i> Settings
    </h1>

    <div class="grid grid-cols-1 gap-4">
      <!-- Night Mode -->
      <div class="bg-[#1a1a2e] rounded-xl p-6">
        <h3 class="font-semibold mb-3">Appearance</h3>
        <label class="flex items-center justify-between">
          <span>Night Mode</span>
          <input type="checkbox" v-model="nightMode" @change="toggleNightMode" class="toggle" />
        </label>
      </div>

      <!-- Avalon API -->
      <div class="bg-[#1a1a2e] rounded-xl p-6">
        <h3 class="font-semibold mb-3">Avalon API</h3>
        <select v-model="selectedApi" @change="changeApi" class="w-full bg-[#0f0f23] border border-gray-700 rounded-lg px-4 py-2 text-sm outline-none">
          <option v-for="api in apis" :key="api" :value="api">{{ api }}</option>
        </select>
      </div>

      <!-- Wallet -->
      <div class="bg-[#1a1a2e] rounded-xl p-6">
        <h3 class="font-semibold mb-3">Wallet</h3>
        <div v-if="authStore.isAuthenticated">
          <p class="text-sm text-gray-400 mb-2">
            Connected: <span class="font-mono text-white">{{ authStore.user?.address }}</span>
          </p>
          <button @click="authStore.logout()" class="bg-red-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600">
            Disconnect
          </button>
        </div>
        <button v-else @click="connectWallet" class="bg-red-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600">
          Connect Wallet
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, inject } from 'vue'
import { useAuthStore } from '@/stores/auth'
import { setAvalonApi, getActiveApi } from '@/lib/avalon'

const authStore = useAuthStore()
const toggleNightMode = inject('toggleNightMode')
const nightMode = inject('isNightMode')

const apis = [
  'https://avalon.d.tube',
  'https://avalon.luminade.fun',
  'https://api.avalonblocks.com',
  'https://dtube.fso.ovh',
]
const selectedApi = ref(getActiveApi())

function changeApi() {
  setAvalonApi(selectedApi.value)
}

function connectWallet() {
  authStore.loginWithMinima()
}
</script>
