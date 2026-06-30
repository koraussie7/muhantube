<template>
  <div class="settings-page max-w-2xl mx-auto p-6">
    <h1 class="text-2xl font-bold mb-8 text-white">Settings</h1>

    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-4 text-orange-400">Avalon API</h2>
      <div class="bg-gray-800 rounded-lg p-4">
        <label class="block text-sm text-gray-300 mb-2">Active API Endpoint</label>
        <div class="flex gap-2">
          <input
            v-model="apiUrl"
            class="flex-1 bg-gray-700 text-white px-3 py-2 rounded border border-gray-600 focus:border-orange-500 outline-none"
            placeholder="https://api.avalonblocks.com"
          />
          <button
            @click="updateApiUrl"
            class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-medium"
          >
            Apply
          </button>
        </div>
        <p class="text-xs text-gray-400 mt-2">
          Choose from: avalon.d.tube, api.avalonblocks.com, avalon.luminade.fun, dtube.fso.ovh
        </p>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-4 text-orange-400">Wallet</h2>
      <div class="bg-gray-800 rounded-lg p-4">
        <p class="text-gray-300 text-sm mb-2" v-if="!authStore.isAuthenticated">
          Connect your wallet to earn DADAPOINT rewards.
        </p>
        <p class="text-gray-300 text-sm mb-2" v-else>
          Connected: <span class="text-orange-400 font-mono">{{ authStore.user?.address }}</span>
        </p>
        <button
          v-if="!authStore.isAuthenticated"
          @click="authStore.loginWithMinima"
          class="px-4 py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-medium"
        >
          Connect Minima
        </button>
        <button
          v-else
          @click="authStore.logout"
          class="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded font-medium"
        >
          Disconnect
        </button>
      </div>
    </section>

    <section class="mb-8">
      <h2 class="text-lg font-semibold mb-4 text-orange-400">About</h2>
      <div class="bg-gray-800 rounded-lg p-4 text-gray-300 text-sm">
        <p><strong class="text-white">MuhanTube</strong> — Decentralized video platform</p>
        <p class="mt-1">Powered by Vidstack, Avalon, Minima</p>
        <p class="mt-1">Version 1.0.0</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { setAvalonApi, getActiveApi } from '@muhantube/core/avalon'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()
const apiUrl = ref(getActiveApi())

function updateApiUrl() {
  if (apiUrl.value) {
    setAvalonApi(apiUrl.value)
  }
}
</script>
