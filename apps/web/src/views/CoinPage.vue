<template>
  <div class="coin-container max-w-4xl mx-auto px-4 pt-4">
    <h1 class="text-2xl font-bold mb-6">
      <i class="bx bx-coin text-yellow-500"></i> DTC Token
    </h1>

    <!-- Token Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-[#1a1a2e] rounded-xl p-6">
        <h2 class="text-lg font-semibold mb-4">Token Info</h2>
        <div class="space-y-3 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-400">Name</span>
            <span>DTube Coin</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Symbol</span>
            <span class="font-semibold">DTC</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Price</span>
            <span>${{ dtcPrice }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Market Cap</span>
            <span>${{ formatNumber(marketCap) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Total Supply</span>
            <span>{{ formatNumber(totalSupply) }} DTC</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Chain</span>
            <span>BNB Chain</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-400">Contract</span>
            <span class="text-xs font-mono text-gray-500">{{ contractAddress }}</span>
          </div>
        </div>
      </div>

      <div class="bg-[#1a1a2e] rounded-xl p-6">
        <h2 class="text-lg font-semibold mb-4">Your Balance</h2>
        <div v-if="authStore.isAuthenticated" class="space-y-3">
          <div class="text-3xl font-bold text-yellow-500">{{ formatNumber(userBalance) }} DTC</div>
          <div class="text-sm text-gray-400">≈ ${{ formatNumber(userBalance * dtcPrice) }}</div>
          <div class="flex gap-2 mt-4">
            <button @click="buyDTC" class="bg-yellow-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-yellow-400">
              <i class="bx bx-cart"></i> Buy DTC
            </button>
            <router-link to="/farm" class="bg-green-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400">
              <i class="bx bx-farm"></i> Farm
            </router-link>
          </div>
        </div>
        <div v-else class="text-center py-8">
          <p class="text-gray-400 mb-4">Connect wallet to see your balance</p>
          <button @click="connectWallet" class="bg-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-600">
            Connect Wallet
          </button>
        </div>
      </div>
    </div>

    <!-- DADAPOINT Section -->
    <div class="bg-[#1a1a2e] rounded-xl p-6 mb-6">
      <h2 class="text-lg font-semibold mb-4">
        <i class="bx bx-gift text-yellow-500"></i> DADAPOINT
      </h2>
      <p class="text-sm text-gray-400 mb-4">
        Earn DADAPOINT by watching videos and receiving likes. DADAPOINT can be converted to DTC.
      </p>
      <div class="grid grid-cols-3 gap-4 text-center">
        <div>
          <span class="block text-2xl font-bold text-yellow-500">{{ formatNumber(dadaBalance) }}</span>
          <span class="text-xs text-gray-400">DADAPOINT Balance</span>
        </div>
        <div>
          <span class="block text-2xl font-bold text-green-500">{{ formatNumber(totalEarned) }}</span>
          <span class="text-xs text-gray-400">Total Earned</span>
        </div>
        <div>
          <span class="block text-2xl font-bold">{{ formatNumber(videosWatched) }}</span>
          <span class="text-xs text-gray-400">Videos Watched</span>
        </div>
      </div>
    </div>

    <!-- Transaction History -->
    <div class="bg-[#1a1a2e] rounded-xl p-6">
      <h2 class="text-lg font-semibold mb-4">Transaction History</h2>
      <div v-if="transactions.length === 0" class="text-center py-8 text-gray-500">
        <i class="bx bx-transfer text-4xl"></i>
        <p class="mt-2">No transactions yet</p>
      </div>
      <div v-else class="space-y-2">
        <div v-for="tx in transactions" :key="tx.id" class="flex justify-between items-center py-2 border-b border-gray-800 text-sm">
          <div>
            <span :class="tx.type === 'reward' ? 'text-green-400' : 'text-red-400'">
              {{ tx.type === 'reward' ? '+' : '-' }}{{ tx.amount }} DADAPOINT
            </span>
            <span class="text-gray-500 ml-2">{{ tx.reason }}</span>
          </div>
          <span class="text-gray-500 text-xs">{{ timeAgo(tx.ts) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const dtcPrice = ref(0.42)
const marketCap = ref(42000000)
const totalSupply = ref(100000000)
const contractAddress = ref('0x...') // DTC contract
const userBalance = ref(0)
const dadaBalance = ref(0)
const totalEarned = ref(0)
const videosWatched = ref(0)
const transactions = ref([])

function connectWallet() {
  authStore.loginWithMetamask()
}

function buyDTC() {
  window.open('https://pancakeswap.finance/swap?outputCurrency=' + contractAddress.value, '_blank')
}

function formatNumber(n) {
  if (!n) return '0'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toLocaleString()
}

function timeAgo(ts) {
  if (!ts) return ''
  const diff = Date.now() - (typeof ts === 'string' ? new Date(ts).getTime() : ts)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}
</script>
