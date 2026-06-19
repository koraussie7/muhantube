<template>
  <div class="relative flex justify-center w-full overflow-hidden video-wrapper">
    <div class="flex items-center h-full w-full">
      <div class="relative h-full w-full flex items-center justify-center">
        <!-- Clappr Player Container -->
        <div
          ref="playerContainer"
          class="clappr-wrapper w-full h-full"
        ></div>

        <!-- Play Overlay -->
        <div v-show="showPlayOverlay" class="absolute inset-0 flex items-center justify-center z-10">
          <button
            @click="handlePlay"
            class="w-16 h-16 sm:w-20 sm:h-20 bg-black/40 rounded-full flex items-center justify-center cursor-pointer hover:bg-black/60 transition-all"
          >
            <svg class="w-8 h-8 sm:w-10 sm:h-10 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z"/>
            </svg>
          </button>
        </div>

        <!-- Mute Button -->
        <button
          v-if="hasInteraction && isMuted"
          @click="toggleMute"
          class="absolute bottom-4 left-4 z-10 bg-black/50 rounded-full p-2 text-white hover:bg-black/70"
        >
          <svg v-if="isMuted" class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M16.5 12c0-1.77-1.02-3.29-2.5-4.03v2.21l2.45 2.45c.03-.2.05-.41.05-.63zm2.5 0c0 .94-.2 1.82-.54 2.64l1.51 1.51C20.63 14.91 21 13.5 21 12c0-4.28-2.99-7.86-7-8.77v2.06c2.89.86 5 3.54 5 6.71zM4.27 3L3 4.27 7.73 9H3v6h4l5 5v-6.73l4.25 4.25c-.67.52-1.42.93-2.25 1.18v2.06c1.38-.31 2.63-.95 3.69-1.81L19.73 21 21 19.73l-9-9L4.27 3zM12 4L9.91 6.09 12 8.18V4z"/>
          </svg>
          <svg v-else class="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
          </svg>
        </button>

        <!-- DTube-style Gradient Overlay -->
        <div class="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/80 via-black/50 to-transparent pointer-events-none z-0"></div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch, nextTick } from 'vue'
import Clappr from '@clappr/player'
import { useSwarmCloud } from '@/composables/useSwarmCloud'

const props = defineProps({
  videoUrl: { type: String, required: true },
  videoId: { type: String, default: '' },
  autoPlay: { type: Boolean, default: false },
  muted: { type: Boolean, default: true },
  loop: { type: Boolean, default: true },
  poster: { type: String, default: '' },
})

const emit = defineEmits(['play', 'pause', 'timeupdate', 'ended', 'error', 'interaction'])

const playerContainer = ref(null)
const showPlayOverlay = ref(true)
const isPaused = ref(true)
const isMuted = ref(true)
const hasInteraction = ref(false)

let player = null
const { getProxiedUrl } = useSwarmCloud()

function setupClappr(sourceUrl) {
  if (!playerContainer.value) return

  if (player) {
    player.destroy()
    player = null
  }

  player = new Clappr.Player({
    source: sourceUrl,
    parentId: playerContainer.value,
    width: '100%',
    height: '100%',
    autoPlay: props.autoPlay,
    mute: props.muted,
    loop: props.loop,
    poster: props.poster || '',
    mediacontrol: {
      seekbar: '#e94560',
      buttons: '#FFF',
    },
  })

  player.on('ready', () => {
    if (props.autoPlay) {
      showPlayOverlay.value = false
    }
  })

  player.on('play', () => {
    isPaused.value = false
    showPlayOverlay.value = false
    emit('play')
  })

  player.on('pause', () => {
    isPaused.value = true
    emit('pause')
  })

  player.on('timeupdate', () => {
    emit('timeupdate', player.getCurrentTime(), player.getDuration())
  })

  player.on('ended', () => {
    isPaused.value = true
    showPlayOverlay.value = true
    emit('ended')
  })

  player.on('error', (e) => {
    console.error('Clappr error:', e)
    emit('error', e)
  })
}

async function handlePlay() {
  if (!hasInteraction.value) {
    hasInteraction.value = true
    emit('interaction')
  }
  if (player) {
    player.play()
  }
}

function toggleMute() {
  if (player) {
    isMuted.value = !isMuted.value
    if (isMuted.value) {
      player.mute()
    } else {
      player.unmute()
    }
  }
}

function play() {
  if (player) {
    player.play()
  }
}

function pause() {
  if (player) {
    player.pause()
  }
}

function destroy() {
  if (player) {
    player.destroy()
    player = null
  }
}

defineExpose({ play, pause, destroy })

onMounted(async () => {
  await nextTick()
  // Get SwarmCloud P2P proxied URL
  const sourceUrl = await getProxiedUrl(props.videoUrl)
  setupClappr(sourceUrl)
})

onUnmounted(() => {
  destroy()
})

watch(() => props.videoUrl, async (newUrl) => {
  const sourceUrl = await getProxiedUrl(newUrl)
  setupClappr(sourceUrl)
})
</script>

<style scoped>
.video-wrapper {
  height: 100%;
  background: #000;
}

.clappr-wrapper {
  position: relative;
  width: 100%;
  height: 100%;
}

.clappr-wrapper :deep(.clappr-player) {
  width: 100% !important;
  height: 100% !important;
}

.clappr-wrapper :deep(.media-control) {
  background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 50%);
}
</style>
