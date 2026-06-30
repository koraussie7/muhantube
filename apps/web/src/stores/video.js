import { defineStore } from 'pinia'
import { ref } from 'vue'
import { avalonFetch } from '@muhantube/core/avalon'

export const useVideoStore = defineStore('video', () => {
  const currentVideo = ref(null)
  const feed = ref([])
  const trending = ref([])
  const loading = ref(false)

  async function fetchTrending(tag = '', limit = 20) {
    loading.value = true
    try {
      const data = await avalonFetch('/trending', { tag, limit })
      trending.value = data?.results || data || []
    } catch (e) {
      console.error('Failed to fetch trending:', e)
    } finally {
      loading.value = false
    }
  }

  async function fetchVideo(hash) {
    loading.value = true
    try {
      const data = await avalonFetch('/video', { hash })
      currentVideo.value = data
      return data
    } catch (e) {
      console.error('Failed to fetch video:', e)
      return null
    } finally {
      loading.value = false
    }
  }

  async function fetchFeed(tag = '', limit = 20) {
    loading.value = true
    try {
      const data = await avalonFetch('/feed', { tag, limit })
      feed.value = data?.results || data || []
    } catch (e) {
      console.error('Failed to fetch feed:', e)
    } finally {
      loading.value = false
    }
  }

  async function likeVideo(videoId) {
    return await avalonFetch('/like', { videoId })
  }

  async function unlikeVideo(videoId) {
    return await avalonFetch('/unlike', { videoId })
  }

  return {
    currentVideo,
    feed,
    trending,
    loading,
    fetchTrending,
    fetchVideo,
    fetchFeed,
    likeVideo,
    unlikeVideo,
  }
})
