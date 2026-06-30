/**
 * useSwarmCloud.js — SwarmCloud P2P CDN composable (from Loops)
 * Proxies video URLs through SwarmCloud P2P network for bandwidth sharing
 */
import { ref } from 'vue'

export function useSwarmCloud() {
  const isP2PReady = ref(false)
  const p2pError = ref(null)
  let engine = null

  async function init(token = '') {
    try {
      const P2PEngineMedia = (await import('@swarmcloud/media')).default
      engine = new P2PEngineMedia({ token })
      isP2PReady.value = true
      return true
    } catch (e) {
      p2pError.value = e.message
      console.warn('SwarmCloud P2P init failed:', e)
      return false
    }
  }

  async function getProxiedUrl(videoUrl) {
    if (!engine) {
      const ok = await init()
      if (!ok) return videoUrl
    }
    try {
      const proxied = await engine.getProxiedUrl(videoUrl)
      return proxied || videoUrl
    } catch (e) {
      console.warn('SwarmCloud proxy failed, using direct URL:', e)
      return videoUrl
    }
  }

  function destroy() {
    if (engine) {
      engine.destroy()
      engine = null
    }
    isP2PReady.value = false
  }

  return {
    isP2PReady,
    p2pError,
    init,
    getProxiedUrl,
    destroy,
  }
}
