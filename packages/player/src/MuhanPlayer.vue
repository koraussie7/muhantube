<template>
  <div class="relative w-full h-full overflow-hidden bg-black video-wrapper" ref="wrapperRef">
    <!-- Vidstack Player -->
    <media-player
      ref="playerRef"
      :src="resolvedUrl"
      :controls="controls"
      :autoplay="autoPlay"
      :muted="muted"
      :loop="loop"
      :poster="poster"
      cross-origin
      playsinline
      class="w-full h-full"
      @provider-setup="onProviderSetup"
      @play="onPlay"
      @pause="onPause"
      @time-update="onTimeUpdate"
      @ended="onEnded"
      @vds-error="onError"
    >
      <media-provider />
    </media-player>

    <!-- Mute Button Overlay -->
    <button
      v-if="showMuteBtn && isMuted"
      @click="toggleMute"
      class="absolute bottom-4 left-4 z-10 bg-black/50 rounded-full p-2 text-white hover:bg-black/70 transition-all"
    >
      <svg class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
      </svg>
    </button>

    <!-- DTube-style Gradient Overlay -->
    <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none z-0"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import 'vidstack/player'
import 'vidstack/player/ui'
import 'vidstack/player/styles/base.css'
import 'vidstack/player/styles/default/theme.css'

const props = defineProps({
  videoUrl: { type: String, required: true },
  videoId: { type: String, default: '' },
  controls: { type: Boolean, default: true },
  autoPlay: { type: Boolean, default: false },
  muted: { type: Boolean, default: true },
  loop: { type: Boolean, default: true },
  poster: { type: String, default: '' },
  showMuteBtn: { type: Boolean, default: false },
  p2pToken: { type: String, default: '' },
})

const emit = defineEmits(['play', 'pause', 'timeupdate', 'ended', 'error'])

const wrapperRef = ref(null)
const playerRef = ref(null)
const isMuted = ref(props.muted)
const resolvedUrl = ref(props.videoUrl)
let hlsInstance = null
let p2pEngine = null

function onProviderSetup(event) {
  const provider = event.detail
  if (provider && provider.type === 'hls' && provider.instance) {
    hlsInstance = provider.instance
    if (props.p2pToken) {
      injectP2P(hlsInstance)
    }
  }
}

async function injectP2P(hls) {
  try {
    const { default: P2PEngine } = await import('@swarmcloud/hls')
    p2pEngine = new P2PEngine({
      hlsjsInstance: hls,
      token: props.p2pToken,
    })
  } catch (e) {
    console.warn('SwarmCloud P2P injection failed:', e)
  }
}

function onPlay() {
  emit('play')
}

function onPause() {
  emit('pause')
}

function onTimeUpdate(event) {
  const player = event.target
  emit('timeupdate', player.currentTime, player.duration)
}

function onEnded() {
  emit('ended')
}

function onError(event) {
  console.error('Vidstack error:', event.detail)
  emit('error', event.detail)
}

function toggleMute() {
  const player = playerRef.value
  if (player) {
    isMuted.value = !isMuted.value
    player.muted = isMuted.value
  }
}

function play() {
  playerRef.value?.play()
}

function pause() {
  playerRef.value?.pause()
}

function destroy() {
  if (p2pEngine) {
    p2pEngine.destroy()
    p2pEngine = null
  }
  hlsInstance = null
}

defineExpose({ play, pause, destroy })

onMounted(async () => {
  await nextTick()
  resolvedUrl.value = props.videoUrl
})

onUnmounted(() => {
  destroy()
})

watch(() => props.videoUrl, (newUrl) => {
  resolvedUrl.value = newUrl
})
</script>

<style scoped>
.video-wrapper {
  height: 100%;
  background: #000;
}

.video-wrapper :deep(media-player) {
  width: 100% !important;
  height: 100% !important;
  --media-brand: #e94560;
  --media-focus-ring-color: #e94560;
  --media-tooltip-y-offset: 6px;
  --media-menu-y-offset: 6px;
}

.video-wrapper :deep(media-player[data-view-type="video"]) {
  aspect-ratio: 16 / 9;
}
</style>
