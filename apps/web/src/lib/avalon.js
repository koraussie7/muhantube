/**
 * avalon.js — Avalon Blockchain API Client (adapted for Vue 3)
 */

const AVALON_APIS = [
  'https://avalon.d.tube',
  'https://avalon.luminade.fun',
  'https://api.avalonblocks.com',
  'https://dtube.fso.ovh',
]

let activeApi = localStorage.getItem('avalonAPI') || AVALON_APIS[2]

export function setAvalonApi(url) {
  activeApi = url
  localStorage.setItem('avalonAPI', url)
}

export function getActiveApi() {
  return activeApi
}

export async function avalonFetch(endpoint, params = {}) {
  const url = `${activeApi}${endpoint}`
  const query = new URLSearchParams(params).toString()
  try {
    const res = await fetch(query ? `${url}?${query}` : url)
    return await res.json()
  } catch (e) {
    console.warn('Avalon API error:', e)
    // Fallback to next API
    const currentIdx = AVALON_APIS.indexOf(activeApi)
    if (currentIdx < AVALON_APIS.length - 1) {
      setAvalonApi(AVALON_APIS[currentIdx + 1])
      return avalonFetch(endpoint, params)
    }
    return { error: e.message }
  }
}

// Get video info from Avalon
export async function getVideo(hash) {
  return await avalonFetch('/video', { hash })
}

// Search videos
export async function searchVideos(query, limit = 20) {
  return await avalonFetch('/search', { q: query, limit })
}

// Get trending videos
export async function getTrending(tag = '', limit = 20) {
  return await avalonFetch('/trending', { tag, limit })
}

export default {
  setAvalonApi,
  getActiveApi,
  getVideo,
  searchVideos,
  getTrending,
}
