import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { initMinimaWasm } from '@muhantube/core/minima'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const isAuthenticated = computed(() => !!user.value)
  const minimaAddress = ref('')
  const metamaskAddress = ref('')

  async function loginWithMinima() {
    try {
      const minima = await initMinimaWasm()
      const address = minima.getAddress()
      minimaAddress.value = address
      user.value = { address, name: address.slice(0, 10), network: 'minima' }
      return user.value
    } catch (e) {
      console.error('Minima login failed:', e)
      return null
    }
  }

  async function loginWithMetamask() {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
        metamaskAddress.value = accounts[0]
        user.value = { address: accounts[0], name: accounts[0].slice(0, 10), network: 'evm' }
        return user.value
      } catch (e) {
        console.error('MetaMask login failed:', e)
      }
    }
    return null
  }

  function logout() {
    user.value = null
    minimaAddress.value = ''
    metamaskAddress.value = ''
  }

  return {
    user,
    isAuthenticated,
    minimaAddress,
    metamaskAddress,
    loginWithMinima,
    loginWithMetamask,
    logout,
  }
})
