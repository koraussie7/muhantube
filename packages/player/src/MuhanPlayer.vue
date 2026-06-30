<template>
  <div class="relative w-full h-full overflow-hidden bg-black video-wrapper" ref="wrapperRef">
    <!-- Vidstack Player with Default Layout -->
    <media-player
      ref="playerRef"
      :src="resolvedUrl"
      :controls="true"
      :autoplay="autoPlay"
      :muted="muted"
      :loop="loop"
      :poster="poster"
      cross-origin
      playsinline
      class="w-full h-full muhan-player"
      @provider-setup="onProviderSetup"
      @play="onPlay"
      @pause="onPause"
      @time-update="onTimeUpdate"
      @ended="onEnded"
      @vds-error="onError"
    >
      <media-provider />
      <media-video-layout
        v-if="!isHlsReady"
        :icons="icons"
        :thumbnails="thumbnails"
      />
    </media-player>

    <!-- Mute Button Overlay (for muted autoplay) -->
    <button
      v-if="showMuteBtn && isMuted && !userInteracted"
      @click="unmute"
      class="absolute bottom-16 left-4 z-10 bg-black/60 backdrop-blur rounded-full px-4 py-2 text-white text-sm hover:bg-black/80 transition-all flex items-center gap-2"
    >
      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
        <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
      </svg>
      Click to unmute
    </button>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick, computed } from 'vue'
import 'vidstack/player'
import 'vidstack/player/ui'
import 'vidstack/player/layouts/default'
import 'vidstack/player/styles/base.css'
import 'vidstack/player/styles/default/theme.css'

const props = defineProps({
  videoUrl: { type: String, required: true },
  videoId: { type: String, default: '' },
  autoPlay: { type: Boolean, default: false },
  muted: { type: Boolean, default: true },
  loop: { type: Boolean, default: true },
  poster: { type: String, default: '' },
  showMuteBtn: { type: Boolean, default: true },
  p2pToken: { type: String, default: '' },
  thumbnails: { type: String, default: '' },
})

const emit = defineEmits(['play', 'pause', 'timeupdate', 'ended', 'error', 'first-interaction'])

const wrapperRef = ref(null)
const playerRef = ref(null)
const isMuted = ref(props.muted)
const userInteracted = ref(false)
const isHlsReady = ref(true)
const resolvedUrl = ref(props.videoUrl)
let hlsInstance = null
let p2pEngine = null

// Vidstack icons (custom MuhanTube orange theme)
const icons = computed(() => ({
  play: `<svg viewBox="0 0 24 24" fill="none"><path d="M8 5v14l11-7z" fill="currentColor"/></svg>`,
  pause: `<svg viewBox="0 0 24 24" fill="none"><rect x="6" y="4" width="4" height="16" rx="1" fill="currentColor"/><rect x="14" y="4" width="4" height="16" rx="1" fill="currentColor"/></svg>`,
  volume: `<svg viewBox="0 0 24 24" fill="none"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02z" fill="currentColor"/></svg>`,
  volumeMuted: `<svg viewBox="0 0 24 24" fill="none"><path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z" fill="currentColor"/></svg>`,
  fullscreen: `<svg viewBox="0 0 24 24" fill="none"><path d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z" fill="currentColor"/></svg>`,
  pip: `<svg viewBox="0 0 24 24" fill="none"><path d="M19 7h-8v6h8V7zm2-4H3c-1.1 0-2 .9-2 2v14c0 1.1.9 1.98 2 1.98h18c1.1 0 2-.88 2-1.98V5c0-1.1-.9-2-2-2zm0 16.01H3V4.98h18v14.03z" fill="currentColor"/></svg>`,
  settings: `<svg viewBox="0 0 24 24" fill="none"><path d="M19.14 12.94c.04-.3.06-.61.06-.94 0-.32-.02-.64-.07-.94l2.03-1.58a.49.49 0 00.12-.61l-1.92-3.32a.488.488 0 00-.59-.22l-2.39.96c-.5-.38-1.03-.7-1.62-.94l-.36-2.54a.484.484 0 00-.48-.41h-3.84c-.24 0-.43.17-.47.41l-.36 2.54c-.59.24-1.13.57-1.62.94l-2.39-.96c-.22-.08-.47 0-.59.22L2.74 8.87c-.12.21-.08.47.12.61l2.03 1.58c-.05.3-.07.62-.07.94s.02.64.07.94l-2.03 1.58a.49.49 0 00-.12.61l1.92 3.32c.12.22.37.29.59.22l2.39-.96c.5.38 1.03.7 1.62.94l.36 2.54c.05.24.24.41.48.41h3.84c.24 0 .44-.17.47-.41l.36-2.54c.59-.24 1.13-.56 1.62-.94l2.39.96c.22.08.47 0 .59-.22l1.92-3.32c.12-.22.07-.47-.12-.61l-2.01-1.58zM12 15.6c-1.98 0-3.6-1.62-3.6-3.6s1.62-3.6 3.6-3.6 3.6 1.62 3.6 3.6-1.62 3.6-3.6 3.6z" fill="currentColor"/></svg>`,
}))

function onProviderSetup(event) {
  const provider = event.detail
  if (provider && provider.type === 'hls' && provider.instance) {
    hlsInstance = provider.instance
    isHlsReady.value = true
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

function unmute() {
  const player = playerRef.value
  if (player) {
    player.muted = false
    isMuted.value = false
    userInteracted.value = true
    emit('first-interaction')
  }
}

function onPlay() { emit('play') }
function onPause() { emit('pause') }
function onTimeUpdate(event) {
  const player = event.target
  emit('timeupdate', player.currentTime, player.duration)
}
function onEnded() { emit('ended') }
function onError(event) {
  console.error('Vidstack error:', event.detail)
  emit('error', event.detail)
}

function play() { playerRef.value?.play() }
function pause() { playerRef.value?.pause() }

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

onUnmounted(() => { destroy() })

watch(() => props.videoUrl, (newUrl) => {
  resolvedUrl.value = newUrl
})
</script>

<style scoped>
.video-wrapper {
  height: 100%;
  background: #000;
}

.video-wrapper :deep(.muhan-player) {
  --media-brand: #f97316;
  --media-focus-ring-color: #f97316;
  --media-tooltip-y-offset: 8px;
  --media-menu-y-offset: 8px;
  --media-slider-track-color: #555;
  --media-slider-fill-color: #f97316;
  --media-slider-progress-color: #f97316;
  --media-slider-thumbnail-border: 2px solid #f97316;
  --media-controls-bg: linear-gradient(180deg, transparent, rgba(0,0,0,0.8));
  --media-controls-color: #fff;
  --media-menu-bg: #1a1a2e;
  --media-menu-border: 1px solid #333;
  --media-menu-color: #eaeaea;
  --media-menu-hover-bg: #0f0f23;
  --media-menu-hover-color: #f97316;
  --media-time-color: #eaeaea;
  --media-time-bg: transparent;
  --media-live-button-color: #f97316;
  --media-captions-color: #fff;
  --media-captions-bg: rgba(0,0,0,0.7);
}

.video-wrapper :deep(media-player) {
  width: 100% !important;
  height: 100% !important;
}

.video-wrapper :deep(media-player[data-view-type="video"]) {
  aspect-ratio: 16 / 9;
}

/* Custom overlay gradient (DTube style) */
.video-wrapper :deep(.vds-controls) {
  background: linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 40%, transparent 60%, rgba(0,0,0,0.3) 100%);
}
</style>
