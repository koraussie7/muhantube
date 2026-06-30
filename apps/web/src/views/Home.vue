<template>
  <div class="home-container">
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="hero-content">
        <h1>Welcome to <span class="accent">MuHanTube</span></h1>
        <p>Decentralized video platform powered by Minima blockchain</p>
        <div class="hero-stats">
          <div class="stat">
            <span class="stat-value">{{ formatNumber(totalVideos) }}</span>
            <span class="stat-label">Videos</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ formatNumber(totalViews) }}</span>
            <span class="stat-label">Views</span>
          </div>
          <div class="stat">
            <span class="stat-value">{{ formatNumber(totalRewards) }}</span>
            <span class="stat-label">DADAPOINT Rewarded</span>
          </div>
        </div>
      </div>
    </section>

    <!-- Trending Videos -->
    <section class="section">
      <div class="section-header">
        <h2>🔥 Trending</h2>
        <div class="tag-filters">
          <button
            v-for="tag in trendingTags"
            :key="tag"
            @click="activeTag = tag; loadTrending(tag)"
            :class="['tag-btn', { active: activeTag === tag }]"
          >
            {{ tag }}
          </button>
        </div>
      </div>

      <div v-if="loading" class="loading-spinner">
        <i class="bx bx-loader-alt bx-spin text-3xl"></i>
      </div>

      <div v-else class="video-grid">
        <div
          v-for="video in videos"
          :key="video.hash || video.id"
          class="video-card"
          @click="goToVideo(video)"
        >
          <div class="thumbnail">
            <img
              :src="video.thumbnail || `/images/default-thumb.png`"
              :alt="video.title"
              @error="e => e.target.src = '/images/default-thumb.png'"
            />
            <span class="duration">{{ formatDuration(video.duration) }}</span>
          </div>
          <div class="card-info">
            <h3 class="video-title">{{ video.title || 'Untitled' }}</h3>
            <div class="video-meta">
              <span class="author">{{ video.author || video.uploader }}</span>
              <span class="views">{{ formatNumber(video.views) }} views</span>
            </div>
          </div>
        </div>
      </div>

      <div v-if="!loading && videos.length === 0" class="empty-state">
        <i class="bx bx-video-off text-4xl"></i>
        <p>No videos found</p>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/video'

const router = useRouter()
const videoStore = useVideoStore()

const videos = ref([])
const loading = ref(false)
const activeTag = ref('all')
const totalVideos = ref(0)
const totalViews = ref(0)
const totalRewards = ref(0)

const trendingTags = ['all', 'music', 'gaming', 'education', 'entertainment', 'news', 'sports']

async function loadTrending(tag = '') {
  loading.value = true
  try {
    const data = await videoStore.fetchTrending(tag)
    videos.value = videoStore.trending
  } catch (e) {
    console.error('Failed to load trending:', e)
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

onMounted(() => {
  loadTrending()
})
</script>

<style scoped>
.home-container {
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 1rem;
}

.hero-section {
  background: linear-gradient(135deg, #0f0f23 0%, #1a1a2e 50%, #16213e 100%);
  border-radius: 16px;
  padding: 3rem 2rem;
  margin: 1rem 0 2rem;
  text-align: center;
}

.hero-content h1 {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.accent {
  color: #e94560;
}

.hero-content p {
  color: #aaa;
  font-size: 1.1rem;
}

.hero-stats {
  display: flex;
  justify-content: center;
  gap: 3rem;
  margin-top: 2rem;
}

.stat {
  text-align: center;
}

.stat-value {
  display: block;
  font-size: 1.5rem;
  font-weight: 700;
  color: white;
}

.stat-label {
  font-size: 0.875rem;
  color: #666;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
}

.section-header h2 {
  font-size: 1.5rem;
}

.tag-filters {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.tag-btn {
  background: #1a1a2e;
  color: #aaa;
  border: 1px solid #333;
  padding: 0.4rem 1rem;
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.8rem;
  text-transform: capitalize;
  transition: all 0.2s;
}

.tag-btn.active {
  background: #e94560;
  color: white;
  border-color: #e94560;
}

.video-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 1rem;
}

.video-card {
  background: #1a1a2e;
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: transform 0.2s;
}

.video-card:hover {
  transform: translateY(-4px);
}

.thumbnail {
  position: relative;
  aspect-ratio: 16/9;
  overflow: hidden;
  background: #16213e;
}

.thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.duration {
  position: absolute;
  bottom: 0.5rem;
  right: 0.5rem;
  background: rgba(0,0,0,0.8);
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.8rem;
}

.card-info {
  padding: 0.75rem;
}

.video-title {
  font-size: 0.95rem;
  font-weight: 600;
  margin-bottom: 0.3rem;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.video-meta {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  color: #666;
}

.loading-spinner {
  text-align: center;
  padding: 3rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: #666;
}
</style>
