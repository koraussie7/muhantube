<template>
  <div class="channel-page max-w-4xl mx-auto p-6">
    <div class="channel-header flex items-center gap-4 mb-8">
      <div class="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold text-orange-400">
        {{ channelName.charAt(0).toUpperCase() }}
      </div>
      <div>
        <h1 class="text-2xl font-bold text-white">{{ channelName }}</h1>
        <p class="text-gray-400 text-sm">{{ channelAddress }}</p>
      </div>
    </div>

    <div v-if="loading" class="text-center py-12">
      <p class="text-gray-400">Loading videos...</p>
    </div>

    <div v-else-if="videos.length === 0" class="text-center py-12">
      <p class="text-gray-400">No videos yet.</p>
    </div>

    <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <div v-for="video in videos" :key="video.hash" class="bg-gray-800 rounded-lg overflow-hidden hover:ring-2 hover:ring-orange-500 transition-all cursor-pointer" @click="goToVideo(video.hash)">
        <img :src="video.thumbnail || '/placeholder-thumb.svg'" :alt="video.title" class="w-full aspect-video object-cover" />
        <div class="p-3">
          <h3 class="text-white font-medium text-sm line-clamp-2">{{ video.title }}</h3>
          <p class="text-gray-400 text-xs mt-1">{{ video.views || 0 }} views</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { avalonFetch } from '@muhantube/core/avalon'

const route = useRoute()
const router = useRouter()
const channelName = ref(route.query.name || 'Channel')
const channelAddress = ref(route.query.address || '')
const videos = ref([])
const loading = ref(false)

onMounted(async () => {
  if (channelAddress.value) {
    loading.value = true
    try {
      const data = await avalonFetch('/user', { address: channelAddress.value })
      videos.value = data?.videos || []
    } catch (e) {
      console.error('Failed to load channel:', e)
    } finally {
      loading.value = false
    }
  }
})

function goToVideo(hash) {
  router.push({ name: 'watch', params: { hash } })
}
</script>
