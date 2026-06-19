<template>
  <div class="video-page max-w-7xl mx-auto px-4 pt-4">
    <div v-if="loading" class="flex justify-center items-center py-20">
      <i class="bx bx-loader-alt bx-spin text-4xl text-gray-400"></i>
    </div>

    <template v-else-if="video">
      <!-- Video Player Section -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <!-- Main: Player + Info -->
        <div class="lg:col-span-2">
          <!-- Player -->
          <div class="player-container bg-black rounded-xl overflow-hidden" style="max-height: 70vh;">
            <VideoPlayer
              :video-url="videoUrl"
              :video-id="videoId"
              :poster="video.thumbnail"
              :auto-play="true"
              @interaction="handleInteraction"
              @timeupdate="handleTimeUpdate"
            />
          </div>

          <!-- Video Info (DTube style) -->
          <div class="video-info bg-[#1a1a2e] rounded-xl p-4 mt-4">
            <h1 class="text-xl font-bold mb-2">{{ video.title || 'Untitled' }}</h1>

            <!-- Tags -->
            <div class="flex flex-wrap gap-2 mb-3">
              <router-link
                v-for="tag in tags"
                :key="tag"
                :to="{ name: 'tag', params: { tag } }"
                class="tag-link"
              >
                #{{ tag }}
              </router-link>
            </div>

            <!-- Author & Actions -->
            <div class="flex items-center justify-between flex-wrap gap-3">
              <div class="flex items-center gap-3">
                <router-link :to="{ name: 'channel', params: { author: video.author } }" class="flex items-center gap-2">
                  <div class="w-10 h-10 rounded-full bg-gray-700 flex items-center justify-center text-lg font-bold">
                    {{ (video.author || 'A')[0].toUpperCase() }}
                  </div>
                  <div>
                    <div class="font-semibold hover:text-red-500">{{ video.author || 'Anonymous' }}</div>
                    <div class="text-sm text-gray-400">{{ formatNumber(video.views) }} views</div>
                  </div>
                </router-link>
              </div>

              <!-- Vote / Reward Actions (DTube style) -->
              <div class="flex items-center gap-2">
                <button @click="handleUpvote" class="action-btn" :class="{ active: hasUpvoted }">
                  <i class="bx bx-upvote text-xl"></i>
                  <span>{{ formatNumber(voteCount) }}</span>
                </button>
                <button @click="handleDownvote" class="action-btn" :class="{ active: hasDownvoted }">
                  <i class="bx bx-downvote text-xl"></i>
                </button>
                <button @click="toggleShare" class="action-btn">
                  <i class="bx bx-share text-xl"></i>
                </button>
                <button @click="toggleWatchLater" class="action-btn" :class="{ active: isWatchLater }">
                  <i class="bx bx-bookmark text-xl"></i>
                </button>
              </div>
            </div>

            <!-- Video Description -->
            <div class="mt-4 p-3 bg-[#0f0f23] rounded-lg">
              <p class="text-sm text-gray-300 whitespace-pre-wrap">{{ video.description || 'No description' }}</p>
            </div>
          </div>

          <!-- Comments Section (DTube style) -->
          <div class="comments-section bg-[#1a1a2e] rounded-xl p-4 mt-4">
            <h3 class="text-lg font-semibold mb-4">
              <i class="bx bx-message-square-dots"></i> Comments ({{ comments.length }})
            </h3>

            <!-- Comment Input -->
            <div v-if="authStore.isAuthenticated" class="comment-input flex gap-3 mb-4">
              <input
                v-model="newComment"
                @keyup.enter="postComment"
                placeholder="Write a comment..."
                class="flex-1 bg-[#0f0f23] border border-gray-700 rounded-lg px-4 py-2 text-sm outline-none focus:border-red-500"
              />
              <button @click="postComment" class="bg-red-500 px-4 py-2 rounded-lg text-sm font-medium hover:bg-red-600">Post</button>
            </div>
            <p v-else class="text-sm text-gray-500 mb-4">Connect wallet to comment</p>

            <!-- Comments List -->
            <div v-for="comment in comments" :key="comment.id" class="comment-item flex gap-3 py-3 border-b border-gray-800">
              <div class="w-8 h-8 rounded-full bg-gray-700 flex-shrink-0 flex items-center justify-center text-sm">
                {{ (comment.author || 'A')[0] }}
              </div>
              <div>
                <div class="flex items-center gap-2 text-sm">
                  <span class="font-semibold">{{ comment.author }}</span>
                  <span class="text-gray-500">{{ timeAgo(comment.ts) }}</span>
                </div>
                <p class="text-sm mt-1">{{ comment.content }}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar: Related Videos (DTube style) -->
        <div class="lg:col-span-1">
          <!-- Rewards Card -->
          <div class="bg-[#1a1a2e] rounded-xl p-4 mb-4">
            <h3 class="font-semibold mb-3">
              <i class="bx bx-gift text-red-500"></i> DADAPOINT Rewards
            </h3>
            <div class="space-y-2 text-sm">
              <div class="flex justify-between">
                <span class="text-gray-400">Views</span>
                <span>{{ formatNumber(rewardInfo.views) }}</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Reward (Views)</span>
                <span class="text-yellow-400">{{ rewardInfo.viewReward }} DADAPOINT</span>
              </div>
              <div class="flex justify-between">
                <span class="text-gray-400">Reward (Likes)</span>
                <span class="text-yellow-400">{{ rewardInfo.likeReward }} DADAPOINT</span>
              </div>
              <div class="border-t border-gray-700 pt-2 flex justify-between font-bold">
                <span>Total</span>
                <span class="text-yellow-400">{{ rewardInfo.total }} DADAPOINT</span>
              </div>
            </div>
            <button
              v-if="rewardInfo.total > 0 && authStore.isAuthenticated"
              @click="claimRewards"
              class="w-full mt-3 bg-yellow-500 text-black py-2 rounded-lg text-sm font-bold hover:bg-yellow-400"
            >
              <i class="bx bx-coin-stack"></i> Claim Rewards
            </button>
          </div>

          <!-- Related Videos -->
          <div class="bg-[#1a1a2e] rounded-xl p-4">
            <h3 class="font-semibold mb-3">Related Videos</h3>
            <div v-for="rel in relatedVideos" :key="rel.hash || rel.id" class="related-item flex gap-2 mb-3 cursor-pointer hover:opacity-80" @click="goToVideo(rel)">
              <div class="w-40 h-24 bg-gray-800 rounded-lg overflow-hidden flex-shrink-0">
                <img :src="rel.thumbnail || '/images/default-thumb.png'" alt="" class="w-full h-full object-cover" />
              </div>
              <div class="flex-1 min-w-0">
                <h4 class="text-sm font-semibold line-clamp-2">{{ rel.title || 'Untitled' }}</h4>
                <p class="text-xs text-gray-500 mt-1">{{ rel.author }}</p>
                <p class="text-xs text-gray-500">{{ formatNumber(rel.views) }} views</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </template>

    <div v-else-if="!loading" class="text-center py-20 text-gray-500">
      <i class="bx bx-video-off text-6xl"></i>
      <p class="mt-4">Video not found</p>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/auth'
import { useVideoStore } from '@/stores/video'
import { useRewardsStore } from '@/stores/rewards'
import VideoPlayer from '@/components/player/VideoPlayer.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const videoStore = useVideoStore()
const rewardsStore = useRewardsStore()

const videoId = computed(() => route.params.id)
const video = ref(null)
const loading = ref(true)
const videoUrl = ref('')
const tags = ref([])
const comments = ref([])
const relatedVideos = ref([])
const hasUpvoted = ref(false)
const hasDownvoted = ref(false)
const voteCount = ref(0)
const isWatchLater = ref(false)
const newComment = ref('')
const rewardInfo = ref({ views: 0, likes: 0, viewReward: 0, likeReward: 0, total: 0 })

async function loadVideo() {
  loading.value = true
  try {
    const data = await videoStore.fetchVideo(videoId.value)
    if (data) {
      video.value = data
      videoUrl.value = data.videoUrl || data.url || data.source || ''
      tags.value = data.tags || []
      comments.value = data.comments || []
      relatedVideos.value = data.related || []
      voteCount.value = data.votes || data.upvotes || 0

      // Check rewards
      if (authStore.isAuthenticated) {
        rewardInfo.value = await rewardsStore.checkRewards(videoId.value)
      }
    }
  } catch (e) {
    console.error('Failed to load video:', e)
  } finally {
    loading.value = false
  }
}

function handleInteraction() {
  if (authStore.isAuthenticated) {
    rewardsStore.trackView(videoId.value, authStore.user?.address)
  }
}

function handleTimeUpdate(currentTime, duration) {
  // Track view milestones (e.g., 30s watched)
}

function handleUpvote() {
  if (!authStore.isAuthenticated) return
  hasUpvoted.value = !hasUpvoted.value
  if (hasUpvoted.value) {
    voteCount.value++
    hasDownvoted.value = false
    rewardsStore.trackLike(videoId.value, authStore.user?.address)
  } else {
    voteCount.value--
  }
}

function handleDownvote() {
  if (!authStore.isAuthenticated) return
  hasDownvoted.value = !hasDownvoted.value
  if (hasDownvoted.value && hasUpvoted.value) {
    hasUpvoted.value = false
    voteCount.value--
  }
}

function toggleShare() {
  if (navigator.share) {
    navigator.share({ title: video.value?.title, url: window.location.href })
  } else {
    navigator.clipboard.writeText(window.location.href)
  }
}

function toggleWatchLater() {
  isWatchLater.value = !isWatchLater.value
}

function postComment() {
  if (!newComment.value.trim() || !authStore.isAuthenticated) return
  comments.value.unshift({
    id: Date.now(),
    author: authStore.user?.address?.slice(0, 10),
    content: newComment.value,
    ts: Date.now(),
  })
  newComment.value = ''
}

async function claimRewards() {
  if (rewardInfo.value.total > 0) {
    const result = await rewardsStore.claim(
      videoId.value,
      video.value?.author,
      rewardInfo.value.total
    )
    if (!result.error) {
      rewardInfo.value.total = 0
    }
  }
}

function goToVideo(rel) {
  router.push({ name: 'video', params: { id: rel.hash || rel.id } })
}

function formatNumber(n) {
  if (!n) return '0'
  if (n >= 1e6) return (n / 1e6).toFixed(1) + 'M'
  if (n >= 1e3) return (n / 1e3).toFixed(1) + 'K'
  return n.toString()
}

function timeAgo(ts) {
  if (!ts) return ''
  const diff = Date.now() - (typeof ts === 'string' ? new Date(ts).getTime() : ts)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  const days = Math.floor(hrs / 24)
  return `${days}d ago`
}

onMounted(loadVideo)
watch(videoId, loadVideo)
</script>

<style scoped>
.tag-link {
  color: #e94560;
  font-size: 0.8rem;
  background: rgba(233, 69, 96, 0.1);
  padding: 0.2rem 0.6rem;
  border-radius: 12px;
}

.action-btn {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  background: #0f0f23;
  border: 1px solid #333;
  color: #aaa;
  padding: 0.4rem 0.8rem;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.875rem;
  transition: all 0.2s;
}

.action-btn:hover {
  color: white;
  border-color: #e94560;
}

.action-btn.active {
  color: #e94560;
  border-color: #e94560;
}

.comment-item:last-child {
  border-bottom: none;
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>
