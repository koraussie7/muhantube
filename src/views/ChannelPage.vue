<template>
  <div class="channel-page max-w-7xl mx-auto px-4 pt-4">
    <div v-if="loading" class="text-center py-20">
      <i class="bx bx-loader-alt bx-spin text-3xl"></i>
    </div>

    <template v-else>
      <!-- Channel Header -->
      <div class="channel-header bg-[#1a1a2e] rounded-xl p-6 mb-6">
        <div class="flex items-center gap-4">
          <div class="w-20 h-20 rounded-full bg-gray-700 flex items-center justify-center text-3xl font-bold">
            {{ author[0].toUpperCase() }}
          </div>
          <div>
            <h1 class="text-2xl font-bold">/c/{{ author }}</h1>
            <p class="text-gray-400 text-sm mt-1">{{ formatNumber(channelStats.subscribers) }} subscribers</p>
            <p class="text-gray-500 text-sm mt-1">{{ channelStats.description || '' }}</p>
          </div>
        </div>
      </div>

      <!-- Channel Videos -->
      <h2 class="text-xl font-semibold mb-4">Videos</h2>
      <div class="video-grid">
        <div v-for="video in videos" :key="video.hash || video.id" class="video-card" @click="goToVideo(video)">
          <div class="thumbnail">
            <img :src="video.thumbnail || '/images/default-thumb.png'" :alt="video.title" />
            <span class="duration">{{ formatDuration(video.duration) }}</span>
          </div>
          <div class="card-info">
            <h3 class="font-semibold text-sm">{{ video.title || 'Untitled' }}</h3>
            <p class="text-xs text-gray-500 mt-1">{{ formatNumber(video.views) }} views · {{ timeAgo(video.ts) }}</p>
          </div>
        </div>
      </div>
    </template>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { avalonFetch } from '@/lib/avalon'

const route = useRoute()
const router = useRouter()
const author = computed(() => route.params.author)
const videos = ref([])
const loading = ref(false)
const channelStats = ref({ subscribers: 0, description: '' })

async function loadChannel() {
  loading.value = true
  try {
    const data = await avalonFetch('/channel', { author: author.value })
    videos.value = data?.videos || []
    channelStats.value = data?.stats || { subscribers: 0 }
  } catch (e) {
    console.error(e)
  } finally {
    loading.value = false
  }
}

function goToVideo(video) {
  router.push({ name: 'video', params: { id: video.hash || video.id } })
}

function formatNumber(n) {
  if (!n) return '0'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toString()
}

function formatDuration(s) {
  if (!s) return '0:00'
  const m = Math.floor(s / 60)
  const sec = Math.floor(s % 60)
  return `${m}:${sec.toString().padStart(2, '0')}`
}

function timeAgo(ts) {
  if (!ts) return ''
  const diff = Date.now() - (typeof ts === 'string' ? new Date(ts).getTime() : ts)
  const mins = Math.floor(diff / 60000)
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

onMounted(loadChannel)
watch(author, loadChannel)
</script>

<style scoped>
.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 1rem;
}

.video-card {
  background: #1a1a2e;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
}

.thumbnail {
  position: relative;
  aspect-ratio: 16/9;
  background: #16213e;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.duration {
  position: absolute;
  bottom: 0.3rem;
  right: 0.3rem;
  background: rgba(0,0,0,0.8);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-size: 0.75rem;
}

.card-info {
  padding: 0.6rem;
}
</style>
