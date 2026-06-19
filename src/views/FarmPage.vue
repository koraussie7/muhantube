<template>
  <div class="farm-container max-w-4xl mx-auto px-4 pt-4">
    <h1 class="text-2xl font-bold mb-6">
      <i class="bx bx-farm text-green-500"></i> DTC Farm
    </h1>

    <!-- Farm Stats -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="stat-card">
        <span class="stat-label">DTC Price</span>
        <span class="stat-value">${{ dtcPrice }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">TVL</span>
        <span class="stat-value">${{ formatNumber(totalValueLocked) }}</span>
      </div>
      <div class="stat-card">
        <span class="stat-label">APY</span>
        <span class="stat-value text-green-400">{{ apy }}%</span>
      </div>
    </div>

    <!-- Wallet Connection -->
    <div v-if="!isConnected" class="bg-[#1a1a2e] rounded-xl p-6 text-center">
      <i class="bx bx-wallet text-4xl text-gray-500 mb-3"></i>
      <p class="text-gray-400 mb-4">Connect your wallet to start farming DTC</p>
      <button @click="connectWallet" class="bg-red-500 px-6 py-2 rounded-lg font-semibold hover:bg-red-600">
        Connect Wallet
      </button>
    </div>

    <template v-else>
      <!-- User Stake Info -->
      <div class="bg-[#1a1a2e] rounded-xl p-6 mb-6">
        <h2 class="text-lg font-semibold mb-4">Your Stake</h2>
        <div class="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
          <div>
            <span class="text-gray-400 text-sm">Staked DTC</span>
            <p class="text-xl font-bold">{{ formatNumber(userStake) }}</p>
          </div>
          <div>
            <span class="text-gray-400 text-sm">Earned DTC</span>
            <p class="text-xl font-bold text-green-400">{{ formatNumber(userEarned) }}</p>
          </div>
          <div>
            <span class="text-gray-400 text-sm">DTC Balance</span>
            <p class="text-xl font-bold">{{ formatNumber(userBalance) }}</p>
          </div>
          <div>
            <span class="text-gray-400 text-sm">BNB Balance</span>
            <p class="text-xl font-bold">{{ formatNumber(userBnbBalance) }}</p>
          </div>
        </div>
      </div>

      <!-- Actions -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        <div class="bg-[#1a1a2e] rounded-xl p-6">
          <h3 class="font-semibold mb-3">Stake DTC</h3>
          <div class="flex gap-2">
            <input v-model="stakeAmount" type="number" placeholder="0.0" class="flex-1 bg-[#0f0f23] border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-green-500" />
            <button @click="handleStake" class="bg-green-500 text-black px-4 py-2 rounded-lg font-semibold hover:bg-green-400">
              Stake
            </button>
          </div>
        </div>
        <div class="bg-[#1a1a2e] rounded-xl p-6">
          <h3 class="font-semibold mb-3">Unstake DTC</h3>
          <div class="flex gap-2">
            <input v-model="unstakeAmount" type="number" placeholder="0.0" class="flex-1 bg-[#0f0f23] border border-gray-700 rounded-lg px-4 py-2 outline-none focus:border-red-500" />
            <button @click="handleUnstake" class="bg-red-500 px-4 py-2 rounded-lg font-semibold hover:bg-red-600">
              Unstake
            </button>
          </div>
        </div>
      </div>

      <!-- Liquidity -->
      <div class="bg-[#1a1a2e] rounded-xl p-6 mb-6">
        <h3 class="font-semibold mb-3">Liquidity Pool</h3>
        <div class="text-sm text-gray-400 mb-3">
          DTC: {{ formatNumber(dtcLiq) }} / BNB: {{ formatNumber(wethLiq) }}
        </div>
        <div class="flex gap-2">
          <button @click="buyDTC" class="bg-red-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-red-600">
            <i class="bx bx-cart"></i> Buy DTC
          </button>
          <button @click="addLiquidity" class="bg-blue-500 px-4 py-2 rounded-lg text-sm font-semibold hover:bg-blue-600">
            <i class="bx bx-water"></i> Add Liquidity
          </button>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuthStore } from '@/stores/auth'

const authStore = useAuthStore()

const isConnected = ref(false)
const dtcPrice = ref(0.42)
const totalValueLocked = ref(125000)
const apy = ref(45.2)
const aprd = ref(3.8)
const userStake = ref(0)
const userEarned = ref(0)
const userBalance = ref(0)
const userBnbBalance = ref(0)
const dtcLiq = ref(150000)
const wethLiq = ref(85)
const stakeAmount = ref('')
const unstakeAmount = ref('')

function connectWallet() {
  authStore.loginWithMinima()
  isConnected.value = true
}

function handleStake() {
  if (!stakeAmount.value) return
  userStake.value += parseFloat(stakeAmount.value)
  userBalance.value -= parseFloat(stakeAmount.value)
  stakeAmount.value = ''
}

function handleUnstake() {
  if (!unstakeAmount.value || parseFloat(unstakeAmount.value) > userStake.value) return
  userStake.value -= parseFloat(unstakeAmount.value)
  userBalance.value += parseFloat(unstakeAmount.value)
  unstakeAmount.value = ''
}

function buyDTC() {
  // PancakeSwap or similar integration
  window.open('https://pancakeswap.finance/swap', '_blank')
}

function addLiquidity() {
  window.open('https://pancakeswap.finance/liquidity', '_blank')
}

function formatNumber(n) {
  if (!n) return '0'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toLocaleString()
}
</script>

<style scoped>
.stat-card {
  background: #1a1a2e;
  border-radius: 12px;
  padding: 1.5rem;
  text-align: center;
}

.stat-label {
  display: block;
  font-size: 0.875rem;
  color: #666;
  margin-bottom: 0.5rem;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 700;
}
</style>
