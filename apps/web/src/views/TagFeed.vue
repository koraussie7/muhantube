<template>
  <div class="tag-feed max-w-7xl mx-auto px-4 pt-4">
    <h1 class="text-2xl font-bold mb-6">
      <i class="bx bx-hash"></i> #{{ tag }}
    </h1>

    <div v-if="loading" class="text-center py-10">
      <i class="bx bx-loader-alt bx-spin text-3xl"></i>
    </div>

    <div v-else class="video-grid">
      <div v-for="video in videos" :key="video.hash || video.id" class="video-card" @click="goToVideo(video)">
        <div class="thumbnail">
          <img :src="video.thumbnail || '/images/default-thumb.png'" :alt="video.title" />
          <span class="duration">{{ formatDuration(video.duration) }}</span>
        </div>
        <div class="card-info">
          <h3 class="font-semibold text-sm">{{ video.title || 'Untitled' }}</h3>
          <p class="text-xs text-gray-500 mt-1">{{ video.author }} · {{ formatNumber(video.views) }} views</p>
        </div>
      </div>
    </div>

    <div v-if="!loading && videos.length === 0" class="text-center py-10 text-gray-500">
      No videos found for #{{ tag }}
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/video'

const route = useRoute()
const router = useRouter()
const videoStore = useVideoStore()

const tag = computed(() => route.params.tag)
const videos = ref([])
const loading = ref(false)

async function loadTag() {
  loading.value = true
  try {
    await videoStore.fetchTrending(tag.value)
    videos.value = videoStore.trending
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

onMounted(loadTag)
watch(tag, loadTag)
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
